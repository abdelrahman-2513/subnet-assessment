using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace backend.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Load .env file for EF tools
            Env.Load();

            var server = Env.GetString("DB_SERVER");
            var port = Env.GetString("DB_PORT");
            var database = Env.GetString("DB_NAME");
            var user = Env.GetString("DB_USER");
            var password = Env.GetString("DB_PASSWORD");

            var connectionString = $"server={server};port={port};database={database};user={user};password={password};";

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
