using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFUserProcDeptService
    {
        private readonly AppDbContext _context;
        private readonly APIHelper _apiHelper;

        public EFUserProcDeptService(AppDbContext context, APIHelper helper)
        {
            _context = context;
            _apiHelper = helper;
        }

        public async Task<PagedResult<UserProcDept>> GetUserProcDeptAsync(int pageNumber, int pageSize, string? search, string? keyword)
        {
            return await _apiHelper.GetUserProcDepts(pageNumber, pageSize, search, keyword);
        }
    }
}
