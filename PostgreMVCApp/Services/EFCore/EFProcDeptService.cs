using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Create;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFProcDeptService
    {
        private readonly AppDbContext _context;
        public EFProcDeptService(AppDbContext context)
        {
            _context = context;
        }
        public List<ProcurementDepartment> GetAllProcDepts()
        {
            return _context.ProcurementDepartments.Where(proc => proc.Is_Active).ToList();
        }       
        
        public async Task<List<ProcurementDepartment>> GetAllProcDeptsAsync()
        {
            return await _context.ProcurementDepartments.Where(proc => proc.Is_Active).ToListAsync();
        }

        public ProcurementDepartment? GetProcDeptById(int id)
        {
            return _context.ProcurementDepartments.FirstOrDefault(proc => proc.Id == id && proc.Is_Active);
        }

        public async Task<PagedResult<ProcurementDepartment>> GetProcDeptPaged(int pageNumber, int pageSize, string? search)
        {
            var query = _context.ProcurementDepartments.Where(b => b.Is_Active);
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    EF.Functions.ILike(b.Title, $"%{search}%"));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderBy(b => b.Title)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<ProcurementDepartment>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = search
            };
        }

        public bool ValidateCreate(CreateProcDeptDTO model, out string validationMessage)
        {
            if (string.IsNullOrEmpty(model.Code))
            {
                validationMessage = "Code is required";
                return false;
            }
            if (string.IsNullOrEmpty(model.Title))
            {
                validationMessage = "Title is required";
                return false;
            }
            if (string.IsNullOrEmpty(model.Approver_Name))
            {
                validationMessage = "Approver is required";
                return false;
            }
            if (string.IsNullOrEmpty(model.Category))
            {
                validationMessage = "Category is required";
                return false;
            }
            validationMessage = string.Empty;
            return true;
        }

        public void CreateProcDept(ProcurementDepartment procDept)
        {
            _context.ProcurementDepartments.Add(procDept);
            _context.SaveChanges();
        }

        public void UpdateProcDept(ProcurementDepartment procDept)
        {
            _context.ProcurementDepartments.Update(procDept);
            _context.SaveChanges();
        }
    }
}
