
using backend.Models;

namespace backend.Interfaces.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByIdAsync(int id);
        Task AddAsync(User user);
        Task<bool> SaveChangesAsync();
    }
}
