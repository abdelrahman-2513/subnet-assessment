using backend.Configs;
using backend.DTOs.Subnets;
using backend.Interfaces.Subnets;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SubnetController : ControllerBase
    {
        private readonly ISubnetService _subnetService;

        public SubnetController(ISubnetService subnetService)
        {
            _subnetService = subnetService;
        }

        [HttpPost("")]
        [InjectUserId]
        public async Task<IActionResult> CreateSubnet([FromBody] CreateSubnetDto dto, int userId)
        {
            var result = await _subnetService.CreateSubnetAsync(dto, userId);
            return StatusCode(result.Status, result);
        }

        [HttpGet("list")]
        [InjectUserId]
        public async Task<IActionResult> GetSubnets(int userId, int page = 1, int pageSize = 10)
        {
            var result = await _subnetService.GetAllSubnetsAsync( page, pageSize, userId);
            return StatusCode(result.Status, result);
        }

        [HttpPatch("{id}")]
        [InjectUserId]
        public async Task<IActionResult> UpdateSubnet(int id, [FromBody] UpdateSubnetDto dto, int userId)
        {
            var result = await _subnetService.UpdateSubnetAsync(id, dto, userId);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("{id}")]
        [InjectUserId]
        public async Task<IActionResult> DeleteSubnet(int id, int userId)
        {
            var result = await _subnetService.DeleteSubnetAsync(id, userId);
            return StatusCode(result.Status, result);
        }

        [HttpPost("upload")]
        [InjectUserId]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> UploadSubnets([FromForm] FileUploadDto dto, int userId)
        {
            if (dto.File == null || dto.File.Length == 0)
            {
                return BadRequest(new { status = 400, message = "File is required and cannot be empty.", data = (object?)null });
            }

            var result = await _subnetService.UploadSubnetsFromFile(dto, userId);
            return StatusCode(result.Status, result);
        }
    }
}
