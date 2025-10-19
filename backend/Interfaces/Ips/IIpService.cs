using backend.DTOs.Common;
using backend.DTOs.Shared;
using backend.DTOs.Subnets;
using backend.Models;

namespace backend.Interfaces.Ips
{
    public interface IIpService
    {
        Task<ResponseDto<Ip>> CreateIpAsync(CreateIpDto request, int userId);
        Task<ResponseDto<IEnumerable<Ip>>> CreateBulkIpsAsync(int subnetId, IEnumerable<string> ipAddresses, int userId);
        Task<PaginatedResponseDto<Ip>> GetIpsBySubnetAsync(int subnetId, int pageNumber, int pageSize, int userId);
        Task<ResponseDto<Ip>> UpdateIpAsync(int id, UpdateIpDto request, int userId);
        Task<ResponseDto<bool>> DeleteIpAsync(int id, int userId);
        Task<bool> DeleteManyBySubnet(int subnetId);
    }
}
