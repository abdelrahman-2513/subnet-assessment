namespace backend.DTOs.Subnets
{
    public class SubnetResponseDto
    {
        public int SubnetId { get; set; }
        public string SubnetName { get; set; } = string.Empty;
        public string SubnetAddress { get; set; } = string.Empty;
        public int TotalIps { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
