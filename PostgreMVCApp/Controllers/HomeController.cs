using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Models;
using PostgreMVCApp.Services.EFCore;

namespace PostgreMVCApp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ModuleCategoryService service;
        public HomeController(ModuleCategoryService service)
        {
            this.service = service;
        }

        public IActionResult Index()
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

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View();
        }
    }
}
