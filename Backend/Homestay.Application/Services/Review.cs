using Homestay.Application.DTOS.Review;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class Review : IReview
    {
        private IUnitOfWork _unitOfWork;
        public Review(IUnitOfWork unitOfWork) 
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<List<ReviewResponse>> GelAllReviewsRoom(int id)
        {
            var listReviews = await _unitOfWork.ReviewRepository.GetAllReviewsRRoomAsync(id);
            return listReviews;
        }

        public async Task<List<ReviewResponse>> GetAllReviewAsync()
        {
            var listReviews = await _unitOfWork.ReviewRepository.GetAllReviewsAsync();
            return listReviews;
        }
    }
}
