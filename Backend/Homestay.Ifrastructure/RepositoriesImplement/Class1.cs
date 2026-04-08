using Homestay.Ifrastructure.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.RepositoriesImplement
{
    internal class Class1
    {
        private readonly DBFactory dBFactory;   
        public Class1(DBFactory dBFactory)
        {
            this.dBFactory = dBFactory;
        }
        public void Get()
        {
            string conn="1";
            using (var connect = new SqlConnection(conn))
            {
                connect.Open();
                var cmd = new SqlCommand();

            }

            //string a = "1";
            //var cmd = new SqlCommand(a,dBFactory.GetConnection,);
        }
    }
}
