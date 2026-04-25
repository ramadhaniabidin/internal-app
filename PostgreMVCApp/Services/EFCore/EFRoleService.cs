using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFRoleService
    {
        private readonly AppDbContext _appDbContext;
        public EFRoleService(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<List<Role>> GetAllRoles()
        {
            var roles = await _appDbContext.Roles.Where(b => b.IsActive).ToListAsync();
            return roles;
        }

        public async Task<List<Role>> GetRolesByIds(List<int> roleIds)
        {
            var roles = await _appDbContext.Roles.Where(b => roleIds.Contains(b.Id) && b.IsActive).ToListAsync();
            return roles;
        }

        public async Task<PagedResult<Role>> GetRolesPaged(int pageNumber, int pageSize, string? search)
        {
            var query = _appDbContext.Roles.Where(b => b.IsActive);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    EF.Functions.ILike(b.Name, $"%{search}%"));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(b => b.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<Role>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = search
            };
        }

        public void AddRole(Role role)
        {
            _appDbContext.Add(role);
            _appDbContext.SaveChanges();
        }

        public Role? GetRoleByName(string name)
        {
            var role = _appDbContext.Roles.FirstOrDefault(b => b.Name == name);
            return role;
        }

        public Role? GetRoleById(int id)
        {
            var role = _appDbContext.Roles.FirstOrDefault(b => b.Id == id);
            return role;
        }

        public void DeleteRole(Role role)
        {
            role.IsActive = false;
            _appDbContext.Update(role);
            _appDbContext.SaveChanges();
        }

        public void UpdateRole(Role role)
        {
            _appDbContext.Update(role);
            _appDbContext.SaveChanges();
        }
    }
}
