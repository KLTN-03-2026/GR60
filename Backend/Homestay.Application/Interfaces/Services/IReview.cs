using Homestay.Application.DTOS;
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
        public Task<CommonResponse> CreatePhanHoi(CreatePhanHoiRequest createPhanHoi);
        public Task<CreateReviewResponse> CreateReviewAsync(int idRoom, ReviewsRequest reviewsRequest);
        public Task<CommonResponse> DeleteReview(int idreview);
        public Task<List<ReviewResponse>> GelAllReviewsRoom(int id);
        public Task<List<ReviewResponse>> GetAllReviewAsync();
        public Task<List<ReviewManagerResponse>> GetAllReviewManaGer();
        public Task<CommonResponse> UpdatePhanHoi(int idPhanHoi, string noiDung);
    }
}
