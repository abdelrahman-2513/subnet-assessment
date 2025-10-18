using backend.DTOs.Auth;
using System.Threading.Tasks;

namespace backend.Interfaces.Auth
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
    }
}
