using Homestay.Application.Interfaces.Repositories;
using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    public class TestRepoIpm : ITestRepo
    {
        private DBFactory _dBFactory;
        public TestRepoIpm(DBFactory dBFactory)
        {
           _dBFactory = dBFactory;
        }
        public async Task<bool> GetUsers()
        {
            string query = "select * from ql_hs_nguoi_dung";
            using (var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction))
            {
              using var reader = await cmd.ExecuteReaderAsync();
                if(await reader.ReadAsync())
                {
                    return true;
                }
            }
            return false;
        }
    }
}
