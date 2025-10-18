namespace backend.DTOs.Subnets
{
    public class IpResponseDto
    {
        public int IpId { get; set; }
        public string IpAddress { get; set; } = string.Empty;
        public int SubnetId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
