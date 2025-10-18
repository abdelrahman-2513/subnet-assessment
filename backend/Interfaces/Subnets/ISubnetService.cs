using backend.DTOs.Common;
using backend.DTOs.Shared;
using backend.DTOs.Subnets;
using backend.Models;

namespace backend.Interfaces.Subnets
{
    public interface ISubnetService
    {
        Task<ResponseDto<Subnet>> CreateSubnetAsync(CreateSubnetDto request, int userId);
        Task<ResponseDto<string>> UploadSubnetsFromFile(FileUploadDto request, int userId);
        Task<PaginatedResponseDto<Subnet>> GetAllSubnetsAsync(int pageNumber, int pageSize, int userId);
        Task<ResponseDto<Subnet?>> GetSubnetByIdAsync(int id, int userId);
        Task<ResponseDto<Subnet?>> UpdateSubnetAsync(int id, UpdateSubnetDto request, int userId);
        Task<ResponseDto<bool>> DeleteSubnetAsync(int id, int userId);
    }
}
