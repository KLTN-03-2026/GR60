using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Homestay.Ifrastructure.Data
{
    public class DBFactory : IDisposable
    {
        private readonly SqlConnection _sqlConnection;
        private  SqlTransaction? _sqlTransaction;
        public SqlConnection GetConnection => _sqlConnection; 
        public SqlTransaction? GetTransaction => _sqlTransaction;
        public DBFactory(IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("DefaultConnection");
            _sqlConnection = new SqlConnection(connectionString);
            _sqlConnection.Open();
        }  
        public void BeginTransaction()
        {
            if(_sqlTransaction == null)
            {
                _sqlTransaction = _sqlConnection.BeginTransaction();
            }
        }
        public void commit()
        {
            _sqlTransaction?.Commit();
            //Transaction đã xong → dọn dẹp → reset trạng thái về ban đầu
            _sqlTransaction?.Dispose();
            _sqlTransaction = null;
        }
        public void Rollback()
        {
            _sqlTransaction?.Rollback();
            _sqlTransaction?.Dispose();
            _sqlTransaction = null;
        }


        public void Dispose()
        {
            _sqlTransaction?.Dispose();
            _sqlConnection.Dispose();
        }
    }
}
