using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFBranchService
    {
        private readonly AppDbContext _context;
        private readonly APIHelper _apiHelper = new APIHelper(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build());
        public EFBranchService(AppDbContext context)
        {
            _context = context;
        }
        public List<Branch> GetBranches()
        {
            return [.. _context.Branches];
        }

        public List<Branch> GetActiveBranches()
        {
            return _context.Branches.Where(b => b.IsActive).ToList();
        }

        public async Task<List<Branch>> GetActiveBranchesAsync()
        {
            return await _context.Branches.Where(b => b.IsActive).ToListAsync();
        }

        public async Task<PagedResult<Branch>> GetBranchesPaged(int pageNumber, int pageSize, string? search)
        {
            return await _apiHelper.GetBranchesPaged(pageNumber, pageSize, search);
        }

        public void CreateBranch(Branch branch)
        {
            _context.Branches.Add(branch);
            _context.SaveChanges();
        }

        public Branch? GetBranchByCode(string code)
        {
            var branch = _context.Branches.FirstOrDefault(b => b.Code == code);
            return branch;
        }
    }
}
