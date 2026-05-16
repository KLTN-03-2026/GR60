using Homestay.Application.DTOS;
using Homestay.Application.DTOS.AIModel;
using Homestay.Application.DTOS.AIPrice;
using Homestay.Application.Interfaces;
using Homestay.Application.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Homestay.Application.Services
{
    public class AIService : IAIService
    {
        private HttpClient _httpClient;
        private IUnitOfWork _unitOfWork;
        private string _api;
        private string _accountId;
        private string _model;



        public AIService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<string> GetMessageAIResponse(NgayDuDoanRequest ngayDuDoanRequest, DataAIprice dataAIprice)
        {
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _api);
            string endpoint = $"https://api.cloudflare.com/client/v4/accounts/{_accountId}/ai/run/{_model}";


            //var price = dataAIprice.PriceList.Select(x => x.ToString());
            //var day = dataAIprice.PriceList.Select(x => x.ToString());
            var CheckGia = dataAIprice.PriceList != null ? string.Join(", ", dataAIprice.PriceList.Select(x => x.ToString()).Zip(dataAIprice.PriceList.Select(x => x.ToString()), (ngay, gia) => $"{ngay} có giá là: {gia}")) : null;


            string userPrompt = @$"
                                Bạn là AI dự đoán giá phòng homestay.
                                Nhiệm vụ:
                                Dựa vào giá hiện tại, hãy dự đoán giá trong 3 ngày tới.

                                * Yêu cầu bắt buộc:
                                - Chỉ trả về duy nhất một JSON hợp lệ
                                - Không thêm bất kỳ text nào ngoài JSON
                                - Không giải thích ngoài JSON
                                - Không cần lời giải thích chỉ cần file Json với định dạng bênh dưới
                                Format:
                                {{
                                  ""Gia_Du_Doan"": number,
                                  ""Ly_Do"": string
                                }}

                                Quy tắc:
                                - Giá dự đoán là số nguyên (VND)
                                - Dao động trong khoảng ±5% đến ±15% so với giá hiện tại
                                - Viết tự nhiên như con người (không máy móc)
                                - Nêu rõ NGUYÊN NHÂN cụ thể (ví dụ: cuối tuần, thời tiết, lượng khách, xu hướng đặt phòng)
                                - Có ít nhất 3 yếu tố ảnh hưởng
                                - Không viết chung chung kiểu: ""do nhu cầu tăng""
                                - Không dài quá 5 câu và không ngắn quá 2 câu
                                - Tăng thêm số lượng lý do dự đoán 
                                - Nếu tỷ lệ lấp đầy có chữ số thập phân thì chỉ lấy 3 chữ số thập phân thôi

                                Dữ liệu,nếu dữ liệu nào không có thì hãy bỏ qua:
                                 + Giá phòng dự đoán đã được duyệt của các lần trước dự đoán trước: {CheckGia}
                                 + Loại phòng: {dataAIprice.Loai_Phong}
                                 + Tỉ lệ lấp đầy trong 7 ngày:{dataAIprice.OccupancyRateLast7Days} %
                                 + Số người lớn: {dataAIprice.So_Nguoi_Lon}
                                 + Số trẻ em: {dataAIprice.So_Tre_Em}
                                 + Giá Gốc của phòng:{dataAIprice.Gia_Goc}
                                 + Địa điểm: Đà nẵng
                                
                                Output MUST be valid JSON only. If not, fix it before returning.
                                ";
            var message = new AIMessageRequest
            {
                Message = new List<AIMessage>
                {
                    new AIMessage
                    {
                        Role = "system",
                        Content = "Đóng vai trò là nhà dự đoán giá phòng homestay "
                    },
                    new AIMessage
                    {
                        Role = "user",
                        Content = userPrompt
                    }
                }
            };
            var content = JsonSerializer.Serialize(message);
            HttpContent httpContent = new StringContent(content, Encoding.UTF8, "application/json");
            using HttpResponseMessage response = await _httpClient.PostAsync(endpoint, httpContent);
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var AIData = JsonSerializer.Deserialize<AIResponse>(responseContent);
                return AIData.Result.Response.ToString();
            }
            var errorr = await response.Content.ReadAsStringAsync();
            return null;
        }
        public async Task<CommonResponse> CreatePriceRoomAI(int idRoom, NgayDuDoanRequest ngayDuDoanRequest)
        {
            var result = await _unitOfWork.AIPriceRepository.GetDataAIPrice(idRoom);
            var Check = await _unitOfWork.BookingRepository.GetOccupancyRateLast7Days();
            if(result.PriceList != null)
            {
                var price = result.PriceList.Select(x => x.ToString());
                var day = result.DateList.Select(x => x.ToString());
            }
            var dataAIprice = new DataAIprice()
            {
                Gia_Goc =result.Gia_Goc,
                Loai_Phong =result.Loai_Phong,
                DateList = result.DateList == null ? null: result.DateList,
                PriceList = result.PriceList == null? null : result.PriceList,
                So_Nguoi_Lon = result.So_Nguoi_Lon,
                So_Tre_Em = result.So_Tre_Em,
                OccupancyRateLast7Days = Math.Round((Check.Tong_dat_phong / Check.Tong_phong)*100,2),
            };

            var dataAI = await GetMessageAIResponse(ngayDuDoanRequest, dataAIprice);
            if(dataAI == null)
            {
                return new CommonResponse
                {
                    StatusCode = 500,
                    Message = "lỗi kết nối AI"
                };
            }
            var priceAi = JsonSerializer.Deserialize<GiaAIResponse>(dataAI);
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.AIPriceRepository.CreateAIPricePrediction(idRoom, ngayDuDoanRequest, priceAi, _model);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = $"Giá phòng đã được dự đoán"
                };

            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = $"Lỗi thêm vào giá dự đoán AI"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }

        }

        public async Task<List<DSGiaApDungResponse>> GetGiaApDung()
        {
            var result = await _unitOfWork.AIPriceRepository.GetGiaApDung();
            return result;
        }

        public async Task<List<DSGiaDuDoanResponse>> GetListGiaDuDoan()
        {
            var result = await _unitOfWork.AIPriceRepository.GetListGiaDuDoan();
            return result;
        }

        public async Task<CommonResponse> CreateGiaAPDung(int idRoom, CreateGiaApDungRequest createGiaApDungRequest)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.AIPriceRepository.CreateGiaAPDung(idRoom, createGiaApDungRequest);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 201,
                    Message = $"Cập nhật giá áp dụng thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = $"Cập nhật giá áp dụng thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }

        public async Task<CommonResponse> DeleteGiaAPDungAndDuDoan(int idDuDoanGia)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _unitOfWork.AIPriceRepository.DeleteGiaAPDungAndDuDoan(idDuDoanGia);
                _unitOfWork.Commit();
                return new CommonResponse
                {
                    StatusCode = 200,
                    Message = $"Xóa thành công"
                };
            }
            catch
            {
                _unitOfWork.Rollback();
                return new CommonResponse
                {
                    StatusCode = 400,
                    Message = $"Cập nhật giá áp dụng thất bại"
                };
            }
            finally
            {
                _unitOfWork.Dispose();
            }
        }
    }
}
