using Homestay.Api.Authenticate;
using Homestay.Api.Controllers;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Repositories;
using Homestay.Application.Interfaces.Services;
using Homestay.Application.Services;
using Homestay.Application.Services.Jwt;
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
            builder.Services.AddRazorPages();
            builder.Services.AddSignalR();

            // Add services to the container.
            builder.Services.AddScoped<IUser, User>();
            builder.Services.AddScoped<IAuth, Auth>();
            builder.Services.AddScoped<ITestSQlconnect, TestIpl>();
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ITestRepo, TestRepoIpm>();
            builder.Services.AddScoped<DBFactory>();
            builder.Services.AddScoped<IRooms, Rooms>();
            builder.Services.AddScoped<IRoomsRepository, RoomsRepository>();
            builder.Services.AddScoped<IBookingRepository, BookingRepository>();
            builder.Services.AddScoped<IHolidaysRepository, HolidaysRepository>();
            builder.Services.AddScoped<IBooking, Booking>();
            builder.Services.AddScoped<IReview, Review>();
            builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
            builder.Services.AddScoped<IPayment, Payment>();
            builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
            builder.Services.AddScoped<ICheckout, Checkout>();
            builder.Services.AddScoped<IHomeStay, HomeStay>();
            builder.Services.AddScoped<IHomeStayRepository, HomeStayRepository>();
            builder.Services.AddScoped<IChatManager, ChatManager>();
            builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
            builder.Services.AddScoped<ResetTokenService>();

            builder.Services.AuthenJwtService(builder.Configuration);

            builder.Services.AddControllers();
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });
            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseCors("AllowReact");
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.MapRazorPages();
            app.MapHub<SupportHub>("/chatHub");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
