using Homestay.Application.DTOS.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Repositories
{
    public interface IReviewRepository
    {
       public Task<int> CheckUserBooking(int idRoom, int idUser);
       public Task CreateReviews(int idRoom, int checkUserBooking, ReviewsRequest reviewsRequest);
       public Task<List<ReviewResponse>> GetAllReviewsAsync();
       public Task<List<ReviewResponse>> GetAllReviewsRRoomAsync(int id);
    }
}
