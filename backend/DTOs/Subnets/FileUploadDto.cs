using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace backend.DTOs.Subnets
{
    public class FileUploadDto
    {
        [Required(ErrorMessage = "File is required.")]
        public IFormFile File { get; set; } = null!;

        public bool CreateIps { get; set; } = false;
    }
}
