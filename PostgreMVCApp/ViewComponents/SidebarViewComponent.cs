using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Models;
using PostgreMVCApp.Services.EFCore;

namespace PostgreMVCApp.ViewComponents
{
    public class SidebarViewComponent: ViewComponent
    {
        private readonly ModuleCategoryService service;
        public SidebarViewComponent(ModuleCategoryService service)
        {
            this.service = service;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            List<ModuleCategory> moduleCategories = service.GetAllModuleCategories();
            List<ModuleCategoryDisplay> menus = new();
            foreach (var moduleCategory in moduleCategories)
            {
                menus.Add(new ModuleCategoryDisplay
                {
                    Name = moduleCategory.Name,
                    Link = moduleCategory.Link,
                    IconClass = moduleCategory.IconClass,
                    Modules = service.GetModulesByCategoryId(moduleCategory.Id)
                });
            }
            HomeDisplay model = new()
            {
                ModuleCategories = menus
            };
            return View(model);
        }
    }
}
