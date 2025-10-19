using backend.Models;

namespace backend.Interfaces.Ips
{
    public interface IIpRepository
    {
        Task<IEnumerable<Ip>> GetBySubnetAsync(int subnetId, int page, int pageSize, int userId);
        Task<int> CountBySubnetAsync(int subnetId, int userId);
        Task<Ip?> GetByIdAsync(int id, int userId);
        Task<Ip?> isExist(string ipAddress, int userId, int subnetId);
        Task AddAsync(Ip ip);
        Task AddRangeAsync(IEnumerable<Ip> ips);
        Task UpdateAsync(Ip ip);
        Task DeleteAsync(Ip ip);

        Task DeleteBulkBySubnetAsync(int subnetId);
        Task SaveChangesAsync();
    }
}
