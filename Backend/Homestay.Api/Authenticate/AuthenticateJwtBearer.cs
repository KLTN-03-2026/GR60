using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Homestay.Api.Authenticate
{
    public static class AuthenticateJwtBearer
    {
        public static IServiceCollection AuthenJwtService(this IServiceCollection service,IConfiguration configuration)
        {
            
            service.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = false,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = configuration["JwtBearer:iss"],
                        ValidAudience = configuration["JwtBearer:aud"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtBearer:secret"] ?? throw new Exception("Không tìm thấy JWt")))
                    };
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            //kiểm tra token trên cookies
                            context.Token = context.Request.Cookies["token"];
                            //ghi log
                            Console.WriteLine("Cookie token: " + context.Request.Cookies["token"]);
                            Console.WriteLine("Athorization header: " + context.Request.Headers["Authorization"]);

                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine("Failer: " + context.Exception.Message);
                            return Task.CompletedTask;
                        }
                    };

                });
            return service;
        }


    }
}
