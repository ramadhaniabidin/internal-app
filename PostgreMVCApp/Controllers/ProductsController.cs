using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.Services.EFCore;

namespace PostgreMVCApp.Controllers
{
    [Authorize]
    public class ProductsController : Controller
    {
        private readonly EFProductService service;
        public ProductsController(EFProductService service)
        {
            this.service = service;
        }
                      
        public IActionResult Index()
        {
            return View(service.GetAllProducts());
        }


    }
}
