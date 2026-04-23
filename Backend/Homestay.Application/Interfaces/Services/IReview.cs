using Homestay.Application.DTOS.Review;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Interfaces.Services
{
    public interface IReview
    {
        public Task<List<ReviewResponse>> GelAllReviewsRoom(int id);
        public Task<List<ReviewResponse>> GetAllReviewAsync();
    }
}
