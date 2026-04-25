using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFUserService
    {
        private readonly AppDbContext _context;
        public EFUserService(AppDbContext context)
        {
            _context = context;
        }

        public void Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public User? GetById(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public User? GetByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public List<User> GetAllActiveUsers()
        {
            return _context.Users.Where(u => u.IsActive && !string.IsNullOrEmpty(u.FullName)).ToList();
        }

        public void UpdateLastLogin(User user)
        {
            user.LastLoginDateTime = DateTime.UtcNow;
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public async Task<PagedResult<User>> GetUsersPaged(int pageNumber, int pageSize, string? search)
        {
            var query = _context.Users.Where(b => b.IsActive);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    EF.Functions.ILike(b.FullName, $"%{search}%"));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(b => b.FullName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<User>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = search
            };
        }

    }
}
