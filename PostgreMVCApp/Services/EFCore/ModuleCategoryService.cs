using PostgreMVCApp.Data;
using PostgreMVCApp.DTO.Create;
using PostgreMVCApp.Models;

namespace PostgreMVCApp.Services.EFCore
{
    public class ModuleCategoryService
    {
        private readonly AppDbContext _context;
        public ModuleCategoryService(AppDbContext context)
        {
            _context = context;
        }
        public List<ModuleCategory> GetAllModuleCategories()
        {
            return _context.ModuleCategories.Where(c => c.IsActive).OrderBy(c => c.Id).ToList();
        }

        public void CreateModuleCategory(ModuleCategory category)
        {
            _context.ModuleCategories.Add(category);
            _context.SaveChanges();
        }

        // Service
        public void UpdateModuleCategory(ModuleCategory model)
        {
            var entity = _context.ModuleCategories.Find(model.Id) ?? throw new Exception("Not found");
            entity.Name = model.Name;
            entity.Link = model.Link;
            entity.IconClass = model.IconClass;
            _context.SaveChanges();
        }

        public void DeleteModuleCategory(int id)
        {
            var entity = _context.ModuleCategories.Find(id) ?? throw new Exception("Not found");
            (from c in _context.ModuleCategories where c.Id == id select c).ToList().ForEach(c => c.IsActive = false);
            (from m in _context.Modules where m.CategoryId == id select m).ToList().ForEach(m => m.IsActive = false);
            _context.SaveChanges();
        }

        public List<PostgreMVCApp.DTO.Display.ModuleDisplay> GetModulesByCategoryId(int categoryId)
        {
            var result = new List<PostgreMVCApp.DTO.Display.ModuleDisplay>();
            var query = from m in _context.Modules
                        where m.CategoryId == categoryId && m.IsActive
                        orderby m.Id
                        select m;
            var modules = query.ToList();
            foreach (var module in modules)
            {
                var category = _context.ModuleCategories.Find(module.CategoryId);
                if (category != null)
                {
                    result.Add(new PostgreMVCApp.DTO.Display.ModuleDisplay
                    {
                        Name = module.Name,
                        Link = module.Link,
                        IconClass = module.IconClass
                    });
                }
            }
            return result;
        }
    }
}
