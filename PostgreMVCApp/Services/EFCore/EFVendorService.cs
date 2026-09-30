using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFVendorService
    {
        private readonly AppDbContext context;
        private readonly APIHelper _apiHelper;
        public EFVendorService(AppDbContext context, APIHelper helper)
        {
            this.context = context;
            _apiHelper = helper;
        }

        public async Task<PagedResult<VendorNonCommercials>> GetVendorsPages(int pageNumber, int pageSize, string? search)
        {
            return await _apiHelper.GetVendors(pageNumber, pageSize, search);
        }

        public async Task<List<VendorNonCommercials>> GetAllVendors()
        {
            return await context.VendorNonCommercials.Where(v => v.IsActive).ToListAsync();
        }
    }
}
