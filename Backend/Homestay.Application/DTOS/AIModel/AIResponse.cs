using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIModel
{
    public class AIResponse
    {
        [JsonPropertyName("result")]
        public Result Result { get; set; } = default!;
        [JsonPropertyName("success")]
        public bool Success { get; set; } = default!;

    }
    public class Result
    {
        [JsonPropertyName("response")]
        public string Response { get; set; } = default!;
    }
}
