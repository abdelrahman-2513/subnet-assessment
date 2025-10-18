using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Subnets
{
    public class UpdateIpDto
    {

        [Required(ErrorMessage = "IP address is required.")]
        [RegularExpression(@"^(\d{1,3}\.){3}\d{1,3}$", ErrorMessage = "Invalid IP address format.")]
        public string IpAddress { get; set; } = string.Empty;
    }
}
