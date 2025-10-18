using backend.Configs;
using backend.DTOs.Subnets;
using backend.Interfaces.Ips;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IpController : ControllerBase
    {
        private readonly IIpService _ipService;

        public IpController(IIpService ipService)
        {
            _ipService = ipService;
        }

        [HttpPost("")]
        [InjectUserId]
        public async Task<IActionResult> CreateIp([FromBody] CreateIpDto dto, int userId)
        {
            var result = await _ipService.CreateIpAsync(dto, userId);
            return StatusCode(result.Status, result);
        }

        [HttpGet("list")]
        [InjectUserId]
        public async Task<IActionResult> GetIps(int userId, [FromQuery] int subnetId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _ipService.GetIpsBySubnetAsync(subnetId, page, pageSize, userId);
            return StatusCode(result.Status, result);
        }

        [HttpPatch("{id}")]
        [InjectUserId]
        public async Task<IActionResult> UpdateIp(int id, [FromBody] UpdateIpDto dto, int userId)
        {
            var result = await _ipService.UpdateIpAsync(id, dto, userId);
            return StatusCode(result.Status, result);
        }

        [HttpDelete("{id}")]
        [InjectUserId]
        public async Task<IActionResult> DeleteIp(int id, int userId)
        {
            var result = await _ipService.DeleteIpAsync(id, userId);
            return StatusCode(result.Status, result);
        }
    }
}
