namespace backend.DTOs.Auth
{
    public class AuthResponseDto
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public object? Data { get; set; }

        public object? Error { get; set; }
    }
}
