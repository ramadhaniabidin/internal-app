using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models.Master_Data;

namespace PostgreMVCApp.Services.EFCore.Master_Data
{
    public class EFMaterialAnaplanService
    {
        private readonly APIHelper _apiHelper = new APIHelper(new ConfigurationBuilder().AddJsonFile("appsettings.json").Build());

        public async Task<PagedResult<MaterialAnaplanDisplay>> GetMaterialAnaplans(int pageNumber, int pageSize, string? search)
        {
            return await _apiHelper.GetMaterialAnaplans(pageNumber, pageSize, search);
        }
    }
}
