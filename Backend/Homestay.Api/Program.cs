using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Homestay.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            //builder.Services.AddScoped<IAuth, Auth>();

            builder.Services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = false,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["JwtBearer:iss"],
                        ValidAudience = builder.Configuration["JwtBearer:aud"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JwtBearer:secret"]))
                    };
                    //options.Events = new JwtBearerEvents
                    //{
                    //    OnMessageReceived = context =>
                    //    {
                    //        Console.WriteLine("Authorization Header: " + context.Request.Headers["Authorization"]);
                    //        return Task.CompletedTask;
                    //    },
                    //    OnAuthenticationFailed = context =>
                    //    {
                    //        Console.WriteLine("AUTH FAILED: " + context.Exception.Message);
                    //        return Task.CompletedTask;
                    //    },
                    //    OnChallenge = context =>
                    //    {
                    //        Console.WriteLine("CHALLENGE ERROR");
                    //        return Task.CompletedTask;
                    //    }
                    //};
                });

            builder.Services.AddControllers();

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseHttpsRedirection();
            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
