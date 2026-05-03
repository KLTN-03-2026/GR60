using Homestay.Application.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Homestay.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeStayController : ControllerBase
    {
        private IHomeStay _homeStay;
        public HomeStayController(IHomeStay homeStay)
        {
            _homeStay = homeStay;
        }
        public async Task<IActionResult> GetHomeStay()
        {
            var result = await _homeStay.GetHomestay();
            return Ok(result);
        }
    }
}
