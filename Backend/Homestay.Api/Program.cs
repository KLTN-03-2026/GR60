using Homestay.Api.Authenticate;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Homestay.Ifrastructure.Data;
using Homestay.Ifrastructure.RepositoriesImplement;
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
            builder.Services.AddScoped<IAuth, Auth>();
            builder.Services.AddScoped<ITestSQlconnect, TestIpl>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ITestRepo, TestRepoIpm>();
            builder.Services.AddScoped<DBFactory>();
            builder.Services.AuthenJwtService(builder.Configuration);

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
