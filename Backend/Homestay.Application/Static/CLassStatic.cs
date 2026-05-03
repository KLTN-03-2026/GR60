using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Homestay.Application.Static
{
    public static class CLassStatic
    {
        public static bool checkMk(string pass)
        {
            var reger = new Regex(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$");
            if (string.IsNullOrEmpty(pass))
            {
                return false;
            }
            if (pass.IndexOf(" ") >= 0)
            {
                return false;
            }
            if (!reger.IsMatch(pass))
            {
                return false;
            }
            return true;
        }
        public static async Task<string> UploadImg(IFormFile formFile,string nameFoler)
        {
            var folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", nameFoler);
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);
            Guid guid = Guid.NewGuid();
            var fileName = guid.ToString() + formFile.FileName;
            var path = Path.Combine(folder, fileName);
            using var stream = new FileStream(path, FileMode.Create);
            await formFile.CopyToAsync(stream);
            return fileName;
        }
        public static async Task DeleteFileImg(string oldImg, string folder)
        {
         if (string.IsNullOrEmpty(oldImg))
                return;
            // chỉ cho phép trong  folder
            if (!oldImg.StartsWith(folder))
                return;

            var fullPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                oldImg.TrimStart('/')
            );

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }
        
    }
    }
}
