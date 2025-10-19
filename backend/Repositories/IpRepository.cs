using backend.Data;
using backend.Interfaces.Ips;
using backend.Interfaces.Subnets;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class IpRepository : IIpRepository
    {
        private readonly ApplicationDbContext _context;
        public IpRepository(ApplicationDbContext context) => _context = context;

        public async Task<IEnumerable<Ip>> GetBySubnetAsync(int subnetId, int page, int pageSize, int userId)
            => await _context.Ips
                .Include(i => i.Subnet)
                .Where(i => i.SubnetId == subnetId && i.CreatedBy == userId)
                .OrderByDescending(i => i.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

        public async Task<int> CountBySubnetAsync(int subnetId, int userId)
            => await _context.Ips.CountAsync(i => i.SubnetId == subnetId && i.CreatedBy == userId);

        public async Task<Ip?> GetByIdAsync(int id, int userId)
            => await _context.Ips.Include(i => i.Subnet)
                                 .FirstOrDefaultAsync(i => i.IpId == id && i.CreatedBy == userId);

        public async Task<Ip?> isExist(string ipAddress, int userId, int subnetId) 
            => await _context.Ips.FirstOrDefaultAsync(i => i.IpAddress == ipAddress && i.CreatedBy == userId && i.SubnetId == subnetId);

        public async Task AddAsync(Ip ip) => await _context.Ips.AddAsync(ip);

        public async Task AddRangeAsync(IEnumerable<Ip> ips) => await _context.Ips.AddRangeAsync(ips);

        public async Task UpdateAsync(Ip ip)
        {
            _context.Ips.Update(ip);
            await Task.CompletedTask;
        }

        public async Task DeleteAsync(Ip ip)
        {
            _context.Ips.Remove(ip);
            await Task.CompletedTask;
        }

        public async Task DeleteBulkBySubnetAsync(int subnetId)
        {
            var ipsToDelete = _context.Ips
                .Where(ip => ip.SubnetId == subnetId);

            _context.Ips.RemoveRange(ipsToDelete);

            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}
