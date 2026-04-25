using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFStatusService
    {
        private readonly AppDbContext _context;
        public EFStatusService(AppDbContext context)
        {
            _context = context;
        }

        public void AddNewStatus(string statusName)
        {
            var status = new Models.Status
            {
                Name = statusName
            };
            _context.Statuses.Add(status);
            _context.SaveChanges();
        }

        public void UpdateStatus(int id, string newName)
        {
            var status = _context.Statuses.Find(id) ?? throw new Exception("Status not found");
            status.Name = newName;
            _context.SaveChanges();
        }

        public Status GetStatusById(int id)
        {
            return _context.Statuses.Find(id) ?? throw new Exception("Status not found");
        }

        public List<Status> GetAllStatuses()
        {
            return _context.Statuses.Where(s => s.IsActive).ToList();
        }

        public async Task<PagedResult<Status>> GetStatusesPaged(int pageNumber, int pageSize, string? search)
        {
            var query = _context.Statuses.Where(b => b.IsActive);
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
            return new PagedResult<Status>
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
