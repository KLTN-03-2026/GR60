using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIPrice
{
    public class CreateGiaApDungRequest
    {
        public int idDuDoanGia {  get; set; }
        public decimal giaApDung { get; set; }
        public int idUser {  get; set; }
        public DateTime thoiGianTao {  get; set; }

    }
}
