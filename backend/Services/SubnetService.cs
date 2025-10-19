using backend.Configs;
using backend.DTOs.Common;
using backend.DTOs.Shared;
using backend.DTOs.Subnets;
using backend.Helpers;
using backend.Interfaces.Ips;
using backend.Interfaces.Subnets;
using backend.Models;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class SubnetService : ISubnetService
    {
        private readonly ISubnetRepository _subnetRepository;
        private readonly IIpService _ipService;
        private readonly ILogger<SubnetService> _logger;

        public SubnetService(ISubnetRepository subnetRepository, IIpService ipService, ILogger<SubnetService> logger)
        {
            _subnetRepository = subnetRepository;
            _ipService = ipService;
            _logger = logger;
        }

        public async Task<ResponseDto<Subnet>> CreateSubnetAsync(CreateSubnetDto request, int userId)
        {
            try
            {
                if (!SubnetValidator.IsValidCidr(request.SubnetAddress))
                {
                    return new ResponseDto<Subnet>
                    {
                        Status = 400,
                        Message = "Invalid CIDR notation for subnet address."
                    };
                }

                var existingSubnet = await _subnetRepository.ExistsAsync(request.SubnetAddress, userId);
                if (existingSubnet)
                {
                    return new ResponseDto<Subnet>
                    {
                        Status = 409,
                        Message = "Subnet with the same address already exists."
                    };
                }

                var subnet = new Subnet
                {
                    SubnetName = request.SubnetName,
                    SubnetAddress = request.SubnetAddress,
                    CreatedBy = userId,
                    CreatedAt = DateTime.UtcNow
                };

                await _subnetRepository.AddAsync(subnet);
                await _subnetRepository.SaveChangesAsync();

                if (request.CreateIps)
                {
                    var ips = SubnetHelper.GenerateIpsFromCidr(request.SubnetAddress);
                    await _ipService.CreateBulkIpsAsync(subnet.SubnetId, ips, userId);
                    await _subnetRepository.SaveChangesAsync();
                }

                return new ResponseDto<Subnet>
                {
                    Status = 201,
                    Message = "Subnet created successfully.",
                    Data = subnet
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating subnet.");

                return new ResponseDto<Subnet>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while creating subnet."
                };
            }
        }

        public async Task<ResponseDto<string>> UploadSubnetsFromFile(FileUploadDto request, int userId)
        {
            try
            {
                var subnets = new List<Subnet>();
                var failedSubnets = new List<string>();

                using var reader = new StreamReader(request.File.OpenReadStream());
                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var parts = line.Split(',', StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length < 2)
                    {
                        failedSubnets.Add(line);
                        continue;
                    }

                    var subnetName = parts[0].Trim();
                    var subnetAddress = parts[1].Trim();

                    var result = await CreateSubnetAsync(new CreateSubnetDto
                    {
                        SubnetName = subnetName,
                        SubnetAddress = subnetAddress,
                        CreateIps = request.CreateIps
                    }, userId);

                    if (result.Status == 201 && result.Data != null)
                        subnets.Add(result.Data);
                    else
                        failedSubnets.Add($"{subnetName} ({subnetAddress})");
                }

                var message = $"Uploaded {subnets.Count} subnets. Failed: {failedSubnets.Count}";
                if (failedSubnets.Count > 0)
                    message += $" — Failed entries: {string.Join(", ", failedSubnets)}";

                return new ResponseDto<string>
                {
                    Status = 200,
                    Message = message
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during subnet file upload.");

                return new ResponseDto<string>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while processing the file upload."
                };
            }
        }

        public async Task<PaginatedResponseDto<Subnet>> GetAllSubnetsAsync(int pageNumber, int pageSize, int userId)
        {
            try
            {
                var subnets = await _subnetRepository.GetAllAsync(pageNumber, pageSize, userId);
                var totalCount = await _subnetRepository.CountAsync(userId);

                return new PaginatedResponseDto<Subnet>
                {
                    Status = 200,
                    Message = "Subnets fetched successfully.",
                    Data = subnets,
                    TotalCount = totalCount,
                    PageNumber = pageNumber,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching subnets list.");

                return new PaginatedResponseDto<Subnet>
                {
                    Status = 500,
                    Message = "Failed to fetch subnets due to an internal error."
                };
            }
        }

        public async Task<ResponseDto<Subnet?>> GetSubnetByIdAsync(int id, int userId)
        {
            try
            {
                var subnet = await _subnetRepository.GetByIdAsync(id, userId);
                if (subnet == null)
                {
                    return new ResponseDto<Subnet?>
                    {
                        Status = 404,
                        Message = "Subnet not found."
                    };
                }

                return new ResponseDto<Subnet?>
                {
                    Status = 200,
                    Message = "Subnet retrieved successfully.",
                    Data = subnet
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving subnet by ID.");

                return new ResponseDto<Subnet?>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while fetching the subnet."
                };
            }
        }

        public async Task<ResponseDto<Subnet?>> UpdateSubnetAsync(int id, UpdateSubnetDto request, int userId)
        {
            try
            {
                if (!SubnetValidator.IsValidCidr(request.SubnetAddress))
                {
                    return new ResponseDto<Subnet?>
                    {
                        Status = 400,
                        Message = "Invalid CIDR notation for subnet address."
                    };
                }

                var subnet = await _subnetRepository.GetByIdAsync(id, userId);
                if (subnet == null)
                {
                    return new ResponseDto<Subnet?>
                    {
                        Status = 404,
                        Message = "Subnet not found."
                    };
                }

                var isDeletedIps = await this._ipService.DeleteManyBySubnet(id);
                if (!isDeletedIps)
                {
                    return new ResponseDto<Subnet?>
                    {
                        Status = 500,
                        Message = "Try Again Later!"
                    };
                }

                subnet.SubnetName = request.SubnetName;
                subnet.SubnetAddress = request.SubnetAddress;

                await _subnetRepository.UpdateAsync(subnet);
                await _subnetRepository.SaveChangesAsync();

                return new ResponseDto<Subnet?>
                {
                    Status = 200,
                    Message = "Subnet updated successfully.",
                    Data = subnet
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating subnet.");

                return new ResponseDto<Subnet?>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while updating subnet."
                };
            }
        }

        public async Task<ResponseDto<bool>> DeleteSubnetAsync(int id, int userId)
        {
            try
            {
                var subnet = await _subnetRepository.GetByIdAsync(id, userId);
                if (subnet == null)
                {
                    return new ResponseDto<bool>
                    {
                        Status = 404,
                        Message = "Subnet not found.",
                        Data = false
                    };
                }

                await _subnetRepository.DeleteAsync(subnet);
                await _subnetRepository.SaveChangesAsync();

                return new ResponseDto<bool>
                {
                    Status = 200,
                    Message = "Subnet deleted successfully.",
                    Data = true
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting subnet.");

                return new ResponseDto<bool>
                {
                    Status = 500,
                    Message = "An unexpected error occurred while deleting subnet.",
                    Data = false
                };
            }
        }
    }
}
