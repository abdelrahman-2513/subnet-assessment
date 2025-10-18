using backend.Data;
using backend.DTOs.Auth;
using backend.Interfaces.Users;
using backend.Interfaces.Auth;
using backend.Models;
using DotNetEnv;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCryptNet = BCrypt.Net.BCrypt;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly ILogger<AuthService> _logger;

        public AuthService(IUserRepository userRepo, ILogger<AuthService> logger)
        {
            _userRepo = userRepo;
            _logger = logger;
            Env.Load();
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                var existingUser = await _userRepo.GetByEmailAsync(registerDto.Email);
                if (existingUser != null)
                {
                    return new AuthResponseDto
                    {
                        Status = 400,
                        Message = "User already exists."
                    };
                }

                var generatedSalt = BCryptNet.GenerateSalt(10);
                var hashedPassword = BCryptNet.HashPassword(registerDto.Password, generatedSalt);

                var user = new User
                {
                    Email = registerDto.Email,
                    Password = hashedPassword,
                    Role = "User"
                };

                await _userRepo.AddAsync(user);
                await _userRepo.SaveChangesAsync();

                return new AuthResponseDto
                {
                    Status = 201,
                    Message = "User registered successfully.",
                    Data = new { user.Id, user.Email, user.Role }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user registration.");

                return new AuthResponseDto
                {
                    Status = 500,
                    Message = "An unexpected error occurred during registration. Please try again later."
                };
            }
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                var user = await _userRepo.GetByEmailAsync(loginDto.Email);
                if (user == null || !BCryptNet.Verify(loginDto.Password, user.Password))
                {
                    return new AuthResponseDto
                    {
                        Status = 401,
                        Message = "Invalid email or password."
                    };
                }

                var token = GenerateJwtToken(user);

                return new AuthResponseDto
                {
                    Status = 200,
                    Message = "Login successful.",
                    Data = new { token }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during user login.");

                return new AuthResponseDto
                {
                    Status = 500,
                    Message = "An unexpected error occurred during login. Please try again later."
                };
            }
        }

        private string GenerateJwtToken(User user)
        {
            try
            {
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Env.GetString("JWT_KEY")));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim("email", user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var token = new JwtSecurityToken(
                    issuer: Env.GetString("JWT_ISSUER"),
                    audience: Env.GetString("JWT_AUDIENCE"),
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(int.Parse(Env.GetString("JWT_EXPIRE_MINUTES"))),
                    signingCredentials: creds
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating JWT token.");
                throw; 
            }
        }
    }
}
