using Microsoft.AspNetCore.Mvc;

namespace PostgreMVCApp.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
