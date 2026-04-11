using Homestay.Application.DTOS.Users;
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

        public async Task<bool> RegistereAsync(RegisterRequest registerRequest)
        {
            //var checkEmail = await unitOfWork.UserRepository.CheckEmailExistsAsync(registerRequest.Email);
            //if(checkEmail == false)
            //{
            //    return false;
            //}
            //if(registerRequest.Matkhau.Length < 10)
            //{
            //    return false;
            //}


            throw new NotImplementedException();
        }
        //public bool checkMk
    }
}
