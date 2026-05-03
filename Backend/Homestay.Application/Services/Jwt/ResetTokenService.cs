using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services.Jwt
{
    public class ResetTokenService
    {
        private IConfiguration _configuration;
        public ResetTokenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string GenerateToken(string Userid)
        {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtBearer:secret"]));
            var creds = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim("UserId",Userid),
                new Claim("type", "reset_password")
            };
            var token = new JwtSecurityToken
            (
                issuer: _configuration["JwtBearer:iss"],
                audience: _configuration["JwtBearer:aud"],
                claims = claims,
                expires: DateTime.Now.AddMinutes(10),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token).ToString();
            
        }

        public ClaimsPrincipal ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtBearer:secret"]);
            try
            {
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _configuration["JwtBearer:iss"],
                    ValidAudience = _configuration["JwtBearer:aud"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                },out _);
                var type = principal.FindFirst("type")?.Value;
                if(type == null)
                {
                    return null;
                }
                return principal;
            }
            catch 
            {
                return null;
            }

        }
    }
}
