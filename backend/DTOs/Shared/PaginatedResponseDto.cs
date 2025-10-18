namespace backend.DTOs.Common
{
    public class PaginatedResponseDto<T>
    {
        public int Status { get; set; }
        public string Message { get; set; } = string.Empty;
        public IEnumerable<T> Data { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
