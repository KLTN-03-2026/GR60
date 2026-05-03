using Homestay.Application.DTOS.Chats;
using Homestay.Application.DTOS.Users;
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
    public class ConversationRepository : IConversationRepository
    {
        private readonly DBFactory _dBFactory;
        public ConversationRepository(DBFactory dBFactory) 
        {
            _dBFactory = dBFactory;
        }

        public async Task<int> CreateConversation(int idUser)
        {
            string query = @"insert into ql_hs_cuoc_tro_chuyen (ql_nguoi_dung_id,trang_thai,ngay_tao,ngay_cap_nhat)
                            values(@idUser,'dang_hoat_dong',GETDATE(),GETDATE())
                            select CAST(SCOPE_IDENTITY() as int)";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", idUser);
            var idConversation = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(idConversation);
        }

        public async Task CreateMessage(MessageRepsonse newMsg)
        {
            string query = @"insert into ql_hs_tin_nhan(ql_cuoc_tro_chuyen_id,ql_nguoi_dung_id,noi_dung,trang_thai_doc,thoi_gian)
                             values(@ql_cuoc_tro_chuyen_id,@ql_nguoi_dung_id,@noi_dung,@trang_thai_doc,@thoi_gian)";
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@ql_cuoc_tro_chuyen_id", newMsg.ql_cuoc_tro_chuyen_id);
            cmd.Parameters.AddWithValue("@ql_nguoi_dung_id", newMsg.ql_nguoi_dung_id);
            cmd.Parameters.AddWithValue("@noi_dung", newMsg.noi_dung);
            cmd.Parameters.AddWithValue("@trang_thai_doc", newMsg.trang_thai_doc);
            cmd.Parameters.AddWithValue("@thoi_gian", newMsg.thoi_gian);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task DeleteConversation(int idConversation)
        {
            string query = @"delete from ql_hs_tin_nhan
                            where ql_cuoc_tro_chuyen_id = @idConversation
                            delete from ql_hs_cuoc_tro_chuyen
                            where id = @idConversation";
            var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idConversation", idConversation);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task<List<ConversationResponse>> GetAllConversation()
        {
            string query = @"with tinNhanMoiNhat as
                            (
                            select ql_cuoc_tro_chuyen_id ,noi_dung,thoi_gian,ROW_NUMBER() OVER (PARTITION BY ql_cuoc_tro_chuyen_id order by thoi_gian desc )as rn
                            from ql_hs_tin_nhan
                            )
                            select ctt.id,ctt.ql_nguoi_dung_id,nd.id,nd.ho_ten,ctt.trang_thai,ctt.ngay_tao,ctt.ngay_cap_nhat,tn.noi_dung as tn_new,tn.thoi_gian,nd.anh_dai_dien
                            from ql_hs_cuoc_tro_chuyen ctt
                            left join ql_hs_nguoi_dung nd on ctt.ql_nguoi_dung_id = nd.id
                            left join tinNhanMoiNhat tn on ctt.id = tn.ql_cuoc_tro_chuyen_id and rn =1";
            var listConversation = new List<ConversationResponse>();
            using var cmd =  new SqlCommand(query,_dBFactory.GetConnection,_dBFactory.GetTransaction);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync()) 
            {
                var conversation = new ConversationResponse()
                {
                    id_Conversation = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    id_User = reader["ql_nguoi_dung_id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["ql_nguoi_dung_id"]),
                    Name_User = reader["ho_ten"] == DBNull.Value ? null : Convert.ToString(reader["ho_ten"]),
                    Trang_Thai = reader["trang_thai"] == DBNull.Value ? null : Convert.ToString(reader["trang_thai"]),
                    New_Message = reader["tn_new"] == DBNull.Value ? null : Convert.ToString(reader["tn_new"]),
                    thoi_Gian = reader["thoi_gian"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian"]),
                    Anh_Dai_Dien = reader["anh_dai_dien"] == DBNull.Value ? null : Convert.ToString(reader["anh_dai_dien"]),
                };  
                listConversation.Add(conversation);
            }
            return listConversation;
        }
        public async Task<int> GetIDConversationByUser(int idUser)
        {
            string query = @"select id 
                            from ql_hs_cuoc_tro_chuyen 
                            where ql_nguoi_dung_id = @idUser";
            using var cmd = new SqlCommand(query, _dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idUser", idUser);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return reader["id"]== DBNull.Value ? 0 : Convert.ToInt32(reader["id"]);
            }
            return 0;
        }

        public async Task<List<MessageResponse>> GetListMessage(int idConversation)
        {
            string query = @"select *
                            from ql_hs_tin_nhan
                            where ql_cuoc_tro_chuyen_id = @idConversation
                            order by thoi_gian desc";
            List<MessageResponse> listMessage = new List<MessageResponse>();
            using var cmd = new SqlCommand(query,_dBFactory.GetConnection, _dBFactory.GetTransaction);
            cmd.Parameters.AddWithValue("@idConversation", idConversation);
            using var reader = await cmd.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                var message = new MessageResponse()
                {
                    id_Message = reader["id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["id"]),
                    id_Conversation = reader["ql_cuoc_tro_chuyen_id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["ql_cuoc_tro_chuyen_id"]),
                    id_User = reader["ql_nguoi_dung_id"] == DBNull.Value ? 0 : Convert.ToInt32(reader["ql_nguoi_dung_id"]),
                    noi_Dung = reader["noi_dung"] == DBNull.Value ? null : Convert.ToString(reader["noi_dung"]),
                    thoi_Gian = reader["thoi_gian"] == DBNull.Value ? DateTime.MinValue : Convert.ToDateTime(reader["thoi_gian"]),
                };
                listMessage.Add(message);
            }
            return listMessage;
        }
    }
}
