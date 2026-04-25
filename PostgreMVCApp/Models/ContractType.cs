using System.Text.Json.Serialization;

namespace PostgreMVCApp.Models
{
    public class ContractType
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;

        [JsonPropertyName("created_Date")]
        public DateTime CreatedDate { get; set; }

        [JsonPropertyName("updated_Date")]
        public DateTime UpdatedDate { get; set; }

        [JsonPropertyName("is_Active")]
        public bool IsActive { get; set; }
    }
}
