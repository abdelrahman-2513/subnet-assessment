using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Subnet> Subnets { get; set; }
        public DbSet<Ip> Ips { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Subnet>().ToTable("Subnets");
            modelBuilder.Entity<Ip>().ToTable("Ips");

            modelBuilder.Entity<Subnet>()
                .HasMany(s => s.Ips)
                .WithOne(i => i.Subnet)
                .HasForeignKey(i => i.SubnetId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
