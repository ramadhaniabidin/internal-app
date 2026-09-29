using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFContractTypeService
    {
        private readonly AppDbContext _context;
        private readonly APIHelper _apiHelper;
        public EFContractTypeService(AppDbContext context, APIHelper apiHelper)
        {
            _context = context;
            _apiHelper = apiHelper;
        }

        public async Task<PagedResult<ContractType>> GetContractTypeAsync(int pageNumber, int pageSize, string? search)
        { 
            return await _apiHelper.GetContractTypes(pageNumber, pageSize, search);
        }
    }
}
