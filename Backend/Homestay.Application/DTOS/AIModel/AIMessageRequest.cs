using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Homestay.Application.DTOS.AIModel
{
    public class AIMessageRequest
    {
        [JsonPropertyName("messages")]
        public List<AIMessage> Message { get; set; } = default!;
    }
    public class AIMessage
    {
        [JsonPropertyName("role")]
        public string Role { get; set; } = default!;

        [JsonPropertyName("content")]
        public string Content { get; set; } = default!;

    }
}
