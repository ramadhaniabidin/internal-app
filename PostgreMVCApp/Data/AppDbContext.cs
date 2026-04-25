using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users => Set<User>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<Branch> Branches => Set<Branch>();
        public DbSet<Module> Modules => Set<Module>();
        public DbSet<ModuleCategory> ModuleCategories => Set<ModuleCategory>();
        public DbSet<ProcurementDepartment> ProcurementDepartments => Set<ProcurementDepartment>();
        public DbSet<Status> Statuses => Set<Status>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<VendorNonCommercials> VendorNonCommercials => Set<VendorNonCommercials>();
        public DbSet<ContractType> ContractTypes => Set<ContractType>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<VendorNonCommercials>()
                .HasIndex(v => v.ItemID)
                .IsUnique();
        }
    }
}
