using PostgreMVCApp.DTO;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models.Master_Data;

namespace PostgreMVCApp.Services.EFCore.Master_Data
{
    public class EFGeneralLedgerService
    {
        private readonly APIHelper _apiHelper;

        public EFGeneralLedgerService(APIHelper apiHelper)
        {
            _apiHelper = apiHelper;
        }

        public async Task<PagedResult<GeneralLedgers>> GetGeneralLedgers(int pageNumber, int pageSize, string? search, string? keyword)
        {
            return await _apiHelper.GetGeneralLedgers(pageNumber, pageSize, search, keyword);
        }


    }
}
