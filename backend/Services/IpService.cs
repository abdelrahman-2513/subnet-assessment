using backend.DTOs.Common;
using backend.DTOs.Shared;
using backend.DTOs.Subnets;
using backend.Interfaces.Ips;
using backend.Interfaces.Subnets;
using backend.Models;
using backend.Helpers;
using Microsoft.Extensions.Logging;


namespace backend.Services
{
    public class IpService : IIpService
    {
        private readonly IIpRepository _ipRepository;
        private readonly ISubnetRepository _subnetRepository;
        private readonly ILogger<IpService> _logger;

        public IpService(IIpRepository ipRepository, ISubnetRepository subnetRepository, ILogger<IpService> logger)
        {
            _ipRepository = ipRepository;
            _subnetRepository = subnetRepository;
            _logger = logger;
        }

        public async Task<ResponseDto<Ip>> CreateIpAsync(CreateIpDto request, int userId)
        {
            try
            {
                var subnet = await _subnetRepository.GetByIdAsync(request.SubnetId, userId);
                if (subnet == null)
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 404,
                        Message = "Subnet not found or not owned by the user."
                    };
                }
                if (!IpValidator.isValidIP(request.IpAddress, subnet.SubnetAddress))
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 400,
                        Message = "Invalid IP address format."
                    };
                }

                var ipExisted = await _ipRepository.isExist(request.IpAddress, userId,request.SubnetId);
                if (ipExisted != null)
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 400,
                        Message = "Ip Address Already Exist in Subnet."
                    };
                }

                var ip = new Ip
                {
                    IpAddress = request.IpAddress,
                    SubnetId = request.SubnetId,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                };

                await _ipRepository.AddAsync(ip);
                await _ipRepository.SaveChangesAsync();

                return new ResponseDto<Ip>
                {
                    Status = 201,
                    Message = "IP created successfully.",
                    Data = ip
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating IP.");
                return new ResponseDto<Ip>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while creating the IP."
                };
            }
        }

        public async Task<ResponseDto<IEnumerable<Ip>>> CreateBulkIpsAsync(int subnetId, IEnumerable<string> ipAddresses, int userId)
        {
            try
            {
                
                var ips = ipAddresses.Select(ip => new Ip
                {
                    IpAddress = ip,
                    SubnetId = subnetId,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                }).ToList();

                await _ipRepository.AddRangeAsync(ips);
                await _ipRepository.SaveChangesAsync();

                return new ResponseDto<IEnumerable<Ip>>
                {
                    Status = 201,
                    Message = "Bulk IPs created successfully.",
                    Data = ips
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during bulk IP creation.");
                return new ResponseDto<IEnumerable<Ip>>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while creating bulk IPs."
                };
            }
        }

        public async Task<PaginatedResponseDto<Ip>> GetIpsBySubnetAsync(int subnetId, int pageNumber, int pageSize, int userId)
        {
            try
            {
                var subnet = await _subnetRepository.GetByIdAsync(subnetId, userId);
                if (subnet == null)
                {
                    return new PaginatedResponseDto<Ip>
                    {
                        Status = 404,
                        Message = "Subnet not found or not owned by the user."
                    };
                }

                var ips = await _ipRepository.GetBySubnetAsync(subnetId, pageNumber, pageSize,userId);
                var totalCount = await _ipRepository.CountBySubnetAsync(subnetId,userId);

                return new PaginatedResponseDto<Ip>
                {
                    Status = 200,
                    Message = "IPs fetched successfully.",
                    Data = ips,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching IPs by subnet.");
                return new PaginatedResponseDto<Ip>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while fetching IPs."
                };
            }
        }

        public async Task<ResponseDto<Ip>> UpdateIpAsync(int id, UpdateIpDto request, int userId)
        {
            try
            {
                var ip = await _ipRepository.GetByIdAsync(id, userId);
                if (ip == null)
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 404,
                        Message = "IP not found or not owned by the user."
                    };
                }
                var subnet = await _subnetRepository.GetByIdAsync(ip.SubnetId, userId);
                if (subnet == null)
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 404,
                        Message = "Subnet not found or not owned by the user."
                    };
                }
                if (!IpValidator.isValidIP(request.IpAddress, subnet.SubnetAddress))
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 400,
                        Message = "Invalid IP address format."
                    };
                }
                var ipExisted = await _ipRepository.isExist(request.IpAddress, userId, ip.SubnetId);
                if (ipExisted != null)
                {
                    return new ResponseDto<Ip>
                    {
                        Status = 400,
                        Message = "Ip Address Already Exist in Subnet."
                    };
                }
                

                ip.IpAddress = request.IpAddress;
                await _ipRepository.UpdateAsync(ip);
                await _ipRepository.SaveChangesAsync();

                return new ResponseDto<Ip>
                {
                    Status = 200,
                    Message = "IP updated successfully.",
                    Data = ip
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating IP.");
                return new ResponseDto<Ip>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while updating the IP."
                };
            }
        }

        public async Task<ResponseDto<bool>> DeleteIpAsync(int id, int userId)
        {
            try
            {
                var ip = await _ipRepository.GetByIdAsync(id, userId);
                if (ip == null)
                {
                    return new ResponseDto<bool>
                    {
                        Status = 404,
                        Message = "IP not found or not owned by the user."
                    };
                }

                await _ipRepository.DeleteAsync(ip);
                await _ipRepository.SaveChangesAsync();

                return new ResponseDto<bool>
                {
                    Status = 200,
                    Message = "IP deleted successfully.",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting IP.");
                return new ResponseDto<bool>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while deleting the IP."
                };
            }
        }

        public async Task<bool> DeleteManyBySubnet(int subnetId)
        {
            try
            {
                await _ipRepository.DeleteBulkBySubnetAsync(subnetId);
                await _ipRepository.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting IP.");
                return false;
            }
        }
    }
}
