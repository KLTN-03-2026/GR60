using Homestay.Application.DTOS;
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

        public async Task<CommonResponse> CreatePhanHoi(CreatePhanHoiRequest createPhanHoi)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.ReviewRepository.CreatePhanHoi(createPhanHoi);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = "phản hồi đánh giá thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "lỗi hệ thông"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CreateReviewResponse> CreateReviewAsync(int idRoom,  ReviewsRequest reviewsRequest)
        {
            var checkUserBooking =await _unitOfWork.ReviewRepository.CheckUserBooking(idRoom,reviewsRequest.idUser);
            if(checkUserBooking == 0)
            {
                return new CreateReviewResponse
                {
                    StatusCode = 400,
                    Message= "Bạn chưa từng sử dụng phòng này" 
                };
            }
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.ReviewRepository.CreateReviews(idRoom,checkUserBooking,reviewsRequest);
                _unitOfWork.Commit();
                return new CreateReviewResponse
                {
                    StatusCode = 201,
                    Message = "đánh giá thành công" 
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CreateReviewResponse
                {
                    StatusCode = 500,
                   Message = "lỗi hệ thông" 
                }; 
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> DeleteReview(int idreview)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.ReviewRepository.DeleteReview(idreview);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "xóa đánh giá thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "lỗi hệ thông"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
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

        public async Task<List<ReviewManagerResponse>> GetAllReviewManaGer()
        {
            var listReviews = await _unitOfWork.ReviewRepository.GetAllReviewManaGer();
            return listReviews;
        }

        public async Task<CommonResponse> UpdatePhanHoi(int idPhanHoi, string noiDung)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.ReviewRepository.UpdatePhanHoi(idPhanHoi, noiDung);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = "cập nhật nội dung phản hồi đánh giá thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "lỗi hệ thông"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
