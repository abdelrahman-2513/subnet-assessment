using backend.Models;

namespace backend.Interfaces.Subnets
{
    public interface ISubnetRepository
    {
        Task<IEnumerable<Subnet>> GetAllAsync(int page, int pageSize, int userId);
        Task<bool> ExistsAsync(string subnetAddress, int userId);
        Task<int> CountAsync(int userId);
        Task<Subnet?> GetByIdAsync(int id, int userId);
        Task AddAsync(Subnet subnet);
        Task UpdateAsync(Subnet subnet);
        Task DeleteAsync(Subnet subnet);
        Task SaveChangesAsync();
    }
}
