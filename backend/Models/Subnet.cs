using System.Text.Json.Serialization;

namespace backend.Models
{
    public class Subnet
    {
        public int SubnetId { get; set; }
        public string SubnetName { get; set; } = string.Empty;
        public string SubnetAddress { get; set; } = string.Empty; 
        public int CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [JsonIgnore]
        public ICollection<Ip> Ips { get; set; } = new List<Ip>();
    }
}
