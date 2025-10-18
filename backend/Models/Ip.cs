using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Ip
    {
        public int IpId { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public int SubnetId { get; set; }

        [JsonIgnore]
        public Subnet? Subnet { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
