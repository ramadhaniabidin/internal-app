using Microsoft.EntityFrameworkCore;
using PostgreMVCApp.Data;
using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Create;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class EFModuleService
    {
        private readonly AppDbContext _context;
        public EFModuleService(AppDbContext context)
        {
            _context = context;
        }

        public List<Module> GetNonCommercialModules()
        {
            var modules = _context.Modules
                .Where(m => m.IsActive && m.CategoryId == 4)
                .ToList();
            return modules;
        }
        public void CreateModule(Module module)
        {
            _context.Modules.Add(module);
            _context.SaveChanges();
        }

        public void UpdateModule(Module module)
        {
            _context.Modules.Update(module);
            _context.SaveChanges();
        }

        public Module? GetModuleByCode(string code)
        {
            var module = _context.Modules.FirstOrDefault(m => m.Code == code);
            return module;
        }

        public Module? GetModuleById(int id)
        {
            var module = _context.Modules.FirstOrDefault(m => m.Id == id);
            return module;
        }

        public List<Module> GetAllModules()
        {
            return _context.Modules.ToList();
        }

        public async Task<PagedResult<ModuleDisplay>> GetModulesPaged(int pageNumber, int pageSize, string? search)
        {
            var query = from m in _context.Modules
                        join c in _context.ModuleCategories on m.CategoryId equals c.Id
                        where m.IsActive &&
                              (string.IsNullOrWhiteSpace(search) || EF.Functions.ILike(m.Name, $"%{search}%"))
                        orderby m.Name
                        select new ModuleDisplay
                        {
                            Id = m.Id,
                            Name = m.Name,
                            Code = m.Code,
                            Category = c.Name,
                            Link = m.Link,
                            TransactionCodeFormat = m.TransactionCodeFormat,
                            IconClass = m.IconClass
                        };
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
            return new PagedResult<ModuleDisplay>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                SearchTerm = search
            };
        }

        public bool ValidateCreateModule(CreateModules module, out string validationMessage)
        {
            if (string.IsNullOrEmpty(module.Name))
            {
                validationMessage = "Module Name is required";
                return false;
            }
            if (string.IsNullOrEmpty(module.Code))
            {
                validationMessage = "Module Code is required";
                return false;
            }
            if(string.IsNullOrEmpty(module.Link))
            {
                validationMessage = "Module Link is required";
                return false;
            }
            if(string.IsNullOrEmpty(module.TransactionCodeFormat))
            {
                validationMessage = "Transaction Code Format is required";
                return false;
            }
            if (string.IsNullOrEmpty(module.IconClass))
            {
                validationMessage = "Icon Class is required";
                return false;
            }
            var existing = GetModuleByCode(module.Code);
            if (existing != null)
            {
                validationMessage = "Module already exists";
                return false;
            }
            validationMessage = string.Empty;
            return true;
        }

        public bool ValidateEditModule(CreateModules module, out string validationMessage)
        {
            if (string.IsNullOrEmpty(module.Name))
            {
                validationMessage = "Module Name is required";
                return false;
            }
            if (string.IsNullOrEmpty(module.Code))
            {
                validationMessage = "Module Code is required";
                return false;
            }
            validationMessage = string.Empty;
            return true;
        }
    }
}
