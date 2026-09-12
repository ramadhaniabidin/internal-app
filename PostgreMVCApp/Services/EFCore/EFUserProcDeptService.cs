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
        private readonly APIHelper _apiHelper = new APIHelper(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build());

        public EFUserProcDeptService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<UserProcDept>> GetUserProcDeptAsync(int pageNumber, int pageSize, string? search)
        {
            return await _apiHelper.GetUserProcDepts(pageNumber, pageSize, search);
        }
    }
}
