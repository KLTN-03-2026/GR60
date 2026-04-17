using Homestay.Application.DTOS.Users;
using Homestay.Application.helper;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Auth : IAuth
    {
        private readonly HttpResponse httpResponse;

        private readonly IUnitOfWork unitOfWork;
        private readonly IConfiguration configuration;
        public Auth(IConfiguration configuration, IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            this.configuration = configuration;
        }

        public async Task<AuthResponse?> LoginAsync(UserRequest userRequest)
        {

            var check = await unitOfWork.UserRepository.CheckUserLoginExistsAsync(userRequest.Email, userRequest.Matkhau);
            if (check != null)
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.Name,check.Name),
                    new Claim(ClaimTypes.Role,check.Vaitro)
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtBearer:secret"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var token = new JwtSecurityToken
                    (
                        issuer: configuration["JwtBearer:iss"],
                        audience: configuration["JwtBearer:aud"],
                        claims: claims,
                        expires: DateTime.Now.AddHours(30),
                        signingCredentials: creds
                    );
                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                var UserResponse = new UserResponse
                {
                    Name = check.Name,
                    Email = check.Email,
                    Vaitro = check.Vaitro,
                    SDT = check.SDT,
                    Diachi = check.Diachi,
                    Ngaytao = check.Ngaytao,
                    Anhdaidien = check.Anhdaidien
                };
                return new AuthResponse
                {
                    Token = tokenString,
                    response = UserResponse,
                    Message = "Đăng nhập thành công"
                };

            }
            return null;
        }

        public async Task<RegisterResponse> RegistereAsync(RegisterRequest registerRequest)
        {
            var checkEmail = await unitOfWork.UserRepository.CheckUserRegisterExistsAsync(registerRequest.Email);
            if (checkEmail)
            {
                return new RegisterResponse
                {
                    StatusCode = 400,
                    Message = "Email đã tồn tại"
                };
            }
            if((!checkMk(registerRequest.Matkhau)))
            {
                return new RegisterResponse
                {
                    StatusCode = 400,
                    Message = "Mật khẩu không hợp lệ"
                };
            }
            if(registerRequest.Matkhau != registerRequest.MatkhauXacNhan)
            {
                return new RegisterResponse
                {
                    StatusCode = 400,
                    Message = "Mật khẩu xác nhận không khớp"
                };
            }
            unitOfWork.BeginTransaction();
            try
            {
                await unitOfWork.UserRepository.AddUserAsync(registerRequest);
                unitOfWork.Commit();
                return new RegisterResponse
                {
                    StatusCode = 201,
                    Message = "Đăng ký thành công"
                };
            }
            catch
            {
                unitOfWork.Rollback();
                return new RegisterResponse
                {
                    StatusCode = 500,
                    Message = "Đăng ký thất bại"
                };
            }
            finally
            {
                unitOfWork.Dispose();
            }
        }
        public bool checkMk(string pass)
        {
            var reger = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$");
            if (string.IsNullOrEmpty(pass))
            {
                return false;
            }
            if (pass.IndexOf(" ") >= 0)
            {
                return false;
            }
            if (!reger.IsMatch(pass))
            {
                return false;
            }
            return true;
        }
    }
}
