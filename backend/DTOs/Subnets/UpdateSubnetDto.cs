using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Subnets
{
    public class UpdateSubnetDto
    {

        [Required(ErrorMessage = "Subnet name is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Subnet name must be between 3 and 50 characters.")]
        public string SubnetName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Subnet address is required.")]
        [RegularExpression(@"^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$", ErrorMessage = "Invalid subnet format. Example: 192.168.0.0/24")]
        public string SubnetAddress { get; set; } = string.Empty;
    }
}
