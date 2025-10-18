namespace backend.DTOs.Shared
{
    public class ResponseDto<T>
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }
}
