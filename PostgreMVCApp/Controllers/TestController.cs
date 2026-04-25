using Microsoft.AspNetCore.Mvc;

namespace PostgreMVCApp.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
