using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.Helpers;
using PostgreMVCApp.Models;
using PostgreMVCApp.Services.EFCore;
using System.Security.Claims;

namespace PostgreMVCApp.Controllers
{
    public class AccountController : Controller
    {
        private readonly EFUserService _userService;
        private readonly APIHelper apiHelper;
        public AccountController(EFUserService userService, APIHelper apiHelper)
        {
            _userService = userService;
            this.apiHelper = apiHelper;
        }
        public IActionResult Login()
        {
            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Products");
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            var user = _userService.GetByUsername(username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                ViewBag.Error = "Invalid username or password";
                return View();
            }
            _userService.UpdateLastLogin(user);
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Username),
                new(ClaimTypes.Role, user.Role)
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
            await apiHelper.EnsureTokenAsync(user.Username);
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task <IActionResult> GetCurrentUser()
        {
            if (User.Identity != null && User.Identity.Name != null && User.Identity.IsAuthenticated)
            {
                var username = User.Identity.Name;
                var user = await _userService.GetByUsernameAsync(username);
                if (user != null)
                {
                    return Json(new
                    {
                        IsAuthenticated = true,
                        user.Id,
                        user.Username,
                        user.Email,
                        user.FullName,
                        user.Role
                    });
                }
            }
            return Json(null);

        }

        [HttpPost]
        public async Task<IActionResult> Token()
        {
            if (User.Identity != null && User.Identity.Name != null && User.Identity.IsAuthenticated)
            {
                var token = apiHelper.EnsureTokenAsync();
                return Json(new
                {
                    token,
                    username = User.Identity.Name,
                });
            }
            return Json(null);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }

        public IActionResult AccessDenied()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Register(RegisterModel model)
        {
            if (!ModelState.IsValid) return View(model);
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                ModelState.AddModelError(string.Empty, "Username and Password are required.");
                ViewBag.Error = "Username and Password are required.";
                return View(model);
            }
            if (model.Password != model.ConfirmPassword)
            {
                ModelState.AddModelError(string.Empty, "Passwords do not match.");
                ViewBag.Error = "Passwords do not match.";
                return View(model);
            }
            var existingUser = _userService.GetByUsername(model.Username);
            if (existingUser != null)
            {
                ModelState.AddModelError(string.Empty, "Username already exists.");
                ViewBag.Error = "Username already exists.";
                return View(model);
            }
            var user = new User
            {
                Username = model.Username,
                Password = PasswordHelper.Hash(model.Password),
                Role = "User",
                CreatedDate = DateTime.UtcNow
            };
            _userService.Create(user);
            return RedirectToAction("Login");
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Users(int page = 1, string? search = null)
        {
            int pageSize = 5;
            var users = _userService.GetUsersPaged(page, pageSize, search).Result;
            return View(users);
        }

        public IActionResult CreateUser()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreateUser(User model)
        {
            //if (!ModelState.IsValid) return View(model);
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                ModelState.AddModelError(string.Empty, "Username and Password are required.");
                TempData["Error"] = "Username and Password are required.";
                return View(model);
            }
            var existingUser = _userService.GetByUsername(model.Username);
            if (existingUser != null)
            {
                ModelState.AddModelError(string.Empty, "Username already exists.");
                TempData["Error"] = "Username already exists.";
                return View(model);
            }
            var user = new User
            {
                Username = model.Username,
                Password = PasswordHelper.Hash(model.Password),
                Role = "User",
                Email = model.Email,
                FullName = model.FullName,
                CreatedDate = DateTime.UtcNow
            };
            _userService.Create(user);
            return RedirectToAction("Users");
        }

        public IActionResult EditUser(int id)
        {
            var user = _userService.GetById(id);
            if (user == null)
            {
                return NotFound();
            }
            return View(user);
        }

        [HttpPost]
        public IActionResult EditUser(User model)
        {
            var user = _userService.GetById(model.Id);
            if (user == null)
            {
                return NotFound();
            }
            user.Email = model.Email;
            user.FullName = model.FullName;
            _userService.Update(user);
            return RedirectToAction("Users");
        }
    }
}
