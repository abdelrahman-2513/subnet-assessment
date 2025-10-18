using backend.Data;
using backend.Interfaces.Subnets;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class SubnetRepository : ISubnetRepository
    {
        private readonly ApplicationDbContext _context;
        public SubnetRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<Subnet>> GetAllAsync(int page, int pageSize, int userId)
                    => await _context.Subnets.Include(s => s.Ips)
                                     .Where(s => s.CreatedBy == userId)
                                     .OrderByDescending(s => s.CreatedAt)
                                     .Skip((page - 1) * pageSize)
                                     .Take(pageSize)
                                     .ToListAsync();

        public async Task<int> CountAsync(int userId) => await _context.Subnets.Where(s => s.CreatedBy == userId).CountAsync();

        public async Task<Subnet?> GetByIdAsync(int id , int userId)
            => await _context.Subnets.Include(s => s.Ips).FirstOrDefaultAsync(s => s.SubnetId == id && s.CreatedBy == userId);

        public async Task AddAsync(Subnet subnet) => await _context.Subnets.AddAsync(subnet);
        public async Task UpdateAsync(Subnet subnet)
        {
            _context.Subnets.Update(subnet);
            await Task.CompletedTask;
        }
        public async Task DeleteAsync(Subnet subnet)
        {
            _context.Subnets.Remove(subnet);
            await Task.CompletedTask;
        }
        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();

        public async Task<bool> ExistsAsync(string address, int userId) =>
            await _context.Subnets.AnyAsync(s => s.SubnetAddress == address && s.CreatedBy == userId);
    }
}
