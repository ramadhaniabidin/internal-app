using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.DTO;
using PostgreMVCApp.DTO.Create;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Models;
using PostgreMVCApp.Services.EFCore;

namespace PostgreMVCApp.Controllers
{
    [Authorize]
    public class MasterController : Controller
    {
        private readonly EFBranchService service;
        private readonly ModuleCategoryService moduleCategoryService;
        private readonly EFModuleService moduleService;
        private readonly EFProcDeptService procDeptService;
        private readonly EFUserService userService;
        private readonly EFStatusService statusService;
        private readonly EFRoleService roleService;
        private readonly EFContractTypeService contractTypeService;
        private readonly int PAGE_SIZE = 5;
        public MasterController(EFBranchService service, ModuleCategoryService moduleCategoryService, EFModuleService moduleService, 
            EFProcDeptService procDeptService, EFUserService userService, EFStatusService statusService, EFRoleService roleService,
            EFContractTypeService contractTypeService)
        {
            this.service = service;
            this.moduleCategoryService = moduleCategoryService;
            this.moduleService = moduleService;
            this.procDeptService = procDeptService;
            this.userService = userService;
            this.statusService = statusService;
            this.roleService = roleService;
            this.contractTypeService = contractTypeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        #region Branch
        public async Task<IActionResult> Branch(int page = 1, string? search = null)
        {
            var brances = await service.GetBranchesPaged(page, PAGE_SIZE, search);
            return View(brances);
        }
        public IActionResult CreateBranch()
        {
            return View();
        }

        [HttpPost]
        public IActionResult CreateBranch(Branch branch)
        {
            if(string.IsNullOrEmpty(branch.Name))
            {
                TempData["Error"] = "Branch Name is required";
                return View();
            }
            if(string.IsNullOrEmpty(branch.Code))
            {
                TempData["Error"] = "Branch Code is required";
                return View();
            }
            var existing = service.GetBranchByCode(branch.Code);
            if(existing != null)
            {
                TempData["Error"] = "Branch already exists";
                return View();
            }
            service.CreateBranch(branch);
            return RedirectToAction("Branch");
        }

        #endregion

        #region Module Category
        public IActionResult ModuleCategory()
        {
            var categories = moduleCategoryService.GetAllModuleCategories();
            return View(categories);
        }

        public IActionResult CreateModuleCategory()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteModuleCategory(int id)
        {
            var category = moduleCategoryService.GetAllModuleCategories().FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }
            moduleCategoryService.DeleteModuleCategory(id);
            return RedirectToAction("ModuleCategory");
        }

        public IActionResult EditModuleCategory(int id)
        {
            var category = moduleCategoryService.GetAllModuleCategories().FirstOrDefault(c => c.Id == id);
            if (category == null)
            {
                return NotFound();
            }
            return View(category);
        }

        [HttpPost]
        public IActionResult EditModuleCategory(ModuleCategory category)
        {
            if (string.IsNullOrEmpty(category.Name))
            {
                TempData["Error"] = "Category Name is required";
                return View(category);
            }
            moduleCategoryService.UpdateModuleCategory(category);
            return RedirectToAction("ModuleCategory");
        }

        [HttpPost]
        public IActionResult CreateModuleCategory(ModuleCategory category)
        {
            if (string.IsNullOrEmpty(category.Name))
            {
                TempData["Error"] = "Category Name is required";
                return View();
            }
            // Additional logic to save the category can be added here
            moduleCategoryService.CreateModuleCategory(category);
            return RedirectToAction("ModuleCategory");
        }
        #endregion

        #region Module
        public IActionResult Module(int page = 1, string? search = null)
        {
            var modules = moduleService.GetModulesPaged(page, 5, search).Result;
            return View(modules);
        }

        public IActionResult CreateModule()
        {
            var moduleCategories = moduleCategoryService.GetAllModuleCategories();
            CreateModules createModules = new()
            {
                ModuleCategories = moduleCategories
            };
            return View(createModules);
        }

        [HttpPost]
        public IActionResult CreateModule(CreateModules module)
        {
            string validationMessage = string.Empty;
            var validation = moduleService.ValidateCreateModule(module, out validationMessage);
            var moduleCategories = moduleCategoryService.GetAllModuleCategories();
            module.ModuleCategories = moduleCategories;
            if (!validation)
            {
                TempData["Error"] = validationMessage;
                return View(module);
            }
            Module newModule = new()
            {
                Name = module.Name,
                Code = module.Code,
                CategoryId = module.CategoryId,
                Link = module.Link,
                TransactionCodeFormat = module.TransactionCodeFormat,
                IsActive = true,
                IconClass = module.IconClass
            };

            moduleService.CreateModule(newModule);
            return RedirectToAction("Module", "Master");
        }

        public IActionResult EditModule(int id)
        {
            var module = moduleService.GetModuleById(id);
            if (module == null)
            {
                return NotFound();
            }
            var updateModule = new CreateModules
            {
                Name = module.Name,
                Code = module.Code,
                CategoryId = module.CategoryId,
                Link = module.Link,
                TransactionCodeFormat = module.TransactionCodeFormat,
                ModuleCategories = moduleCategoryService.GetAllModuleCategories(),
                IconClass = module.IconClass
            };
            return View(updateModule);
        }

        [HttpPost]
        public IActionResult EditModule(CreateModules module)
        {
            string validationMessage = string.Empty;
            var validation = moduleService.ValidateEditModule(module, out validationMessage);
            module.ModuleCategories = moduleCategoryService.GetAllModuleCategories();
            if (!validation)
            {
                TempData["Error"] = validationMessage;
                return View(module);
            }
            var existingModule = moduleService.GetModuleByCode(module.Code);
            if (existingModule == null)
            {
                return NotFound();
            }
            existingModule.Name = module.Name;
            existingModule.Code = module.Code;
            existingModule.CategoryId = module.CategoryId;
            existingModule.Link = module.Link;
            existingModule.TransactionCodeFormat = module.TransactionCodeFormat;
            existingModule.IconClass = module.IconClass;
            moduleService.UpdateModule(existingModule);
            return RedirectToAction("Module", "Master");
        }

        #endregion

        #region Procurement Department
        public IActionResult ProcDept(int page = 1, string? search = null)
        {
            var procDepts = procDeptService.GetProcDeptPaged(page, PAGE_SIZE, search).Result;
            return View(procDepts);
        }

        public IActionResult CreateProcDept()
        {
            CreateProcDeptDTO model = new()
            {
                Approvers = userService.GetAllActiveUsers()
            };
            return View(model);
        }

        public IActionResult EditProcDept(int id)
        {
            var procDept = procDeptService.GetProcDeptById(id);
            if (procDept == null)
            {
                return NotFound();
            }
            CreateProcDeptDTO model = new()
            {
                Code = procDept.Code,
                Title = procDept.Title,
                Approver_Name = procDept.Approver_Name,
                Approver_Account = procDept.Approver_Account,
                Approver_Email = procDept.Approver_Email,
                Category = procDept.Category,
                Approvers = userService.GetAllActiveUsers()
            };
            return View(model);
        }

        [HttpPost]
        public IActionResult EditProcDept(CreateProcDeptDTO model)
        {
            string validationMessage = string.Empty;
            var validation = procDeptService.ValidateCreate(model, out validationMessage);
            if (!validation)
            {
                model.Approvers = userService.GetAllActiveUsers();
                TempData["Error"] = validationMessage;
                return View(model);
            }
            ProcurementDepartment procDept = new()
            {
                Code = model.Code,
                Title = model.Title,
                Approver_Name = model.Approver_Name,
                Approver_Account = model.Approver_Account,
                Approver_Email = model.Approver_Email,
                Category = model.Category,
                Is_Active = true
            };
            procDeptService.UpdateProcDept(procDept);
            return RedirectToAction("ProcDept");
        }

        [HttpPost]
        public IActionResult CreateProcDept(CreateProcDeptDTO model)
        {
            string validationMessage = string.Empty;
            var validation = procDeptService.ValidateCreate(model, out validationMessage);
            if (!validation)
            {
                model.Approvers = userService.GetAllActiveUsers();
                TempData["Error"] = validationMessage;
                return View(model);
            }
            ProcurementDepartment procDept = new()
            {
                Code = model.Code,
                Title = model.Title,
                Approver_Name = model.Approver_Name,
                Approver_Account = model.Approver_Account,
                Approver_Email = model.Approver_Email,
                Category = model.Category,
                Is_Active = true
            };
            procDeptService.CreateProcDept(procDept);
            return RedirectToAction("ProcDept");
        }

        #endregion

        #region Status
        public async Task<IActionResult> Status(int page = 1, string? search = null)
        {
            var statuses = await statusService.GetStatusesPaged(page, PAGE_SIZE, search);
            if(statuses == null)
            {
                return View(new List<PagedResult<Status>>());
            }
            return View(statuses);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddStatus(string statusName)
        {
            if (string.IsNullOrEmpty(statusName))
            {
                TempData["Error"] = "Status Name is required";
                return RedirectToAction("Status");
            }
            statusService.AddNewStatus(statusName);
            return RedirectToAction("Status");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateStatus(int id, string statusName)
        {
            if (string.IsNullOrEmpty(statusName))
            {
                TempData["Error"] = "Status Name is required";
                return RedirectToAction("Status");
            }
            statusService.UpdateStatus(id, statusName);
            return RedirectToAction("Status");
        }


        [HttpGet]
        [ValidateAntiForgeryToken]
        public IActionResult GetStatus(int id)
        {
            var status = statusService.GetStatusById(id);
            if (status == null)
            {
                return NotFound();
            }

            var dto = new StatusDTO
            {
                Id = status.Id,
                Name = status.Name
            };

            return Json(dto);
        }
        #endregion

        #region Approver Non Commercials

        #endregion

        #region Approver Roles
        public async Task<IActionResult> Roles(int page = 1, string? search = null)
        {
            var roles = await roleService.GetRolesPaged(page, 10, search);
            if (roles == null)
            {
                return View(new PagedResult<Role>());
            }
            return View(roles);
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        public  IActionResult GetRole(int id)
        {
            var role = roleService.GetRoleById(id);
            if (role == null)
            {
                return NotFound();
            }
            var model = new PagedResult<Role>
            {
                Items = new List<Role> { role },
                TotalCount = 1,
                PageNumber = 1,
                PageSize = 1
            };
            return Json(new
            {
                Ok = true,
                Data = model
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult AddRole(string roleName, string roleAlias)
        {
            var role = roleService.GetRoleByName(roleName);
            if(role != null)
            {
                return BadRequest(ThrowErrorMessage($"There is already Approver Position with name '{roleName}'"));
            }
            var model = new Role
            {
                Name = roleName,
                Alias = roleAlias,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            roleService.AddRole(model);
            return Ok(new
            {
                Ok = true,
                Message = "OK"
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UpdateRole(int id, string roleName, string roleAlias)
        {
            var role = roleService.GetRoleById(id);
            if(role == null)
            {
                return NotFound();
            }
            var existingRole = roleService.GetRoleByName(roleName);
            if(existingRole != null && existingRole.Id != id)
            {
                return BadRequest(ThrowErrorMessage($"There is already Approver Position with name '{roleName}'"));
            }
            role.Name = roleName;
            role.Alias = roleAlias;
            role.LastUpdatedAt = DateTime.UtcNow;
            roleService.UpdateRole(role);
            return Ok(new
            {
                Ok = true,
                Message = "OK"
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteRole(int id)
        {
            var role = roleService.GetRoleById(id);
            if(role == null)
            {
                return NotFound();
            }
            roleService.DeleteRole(role);
            return Ok(new
            {
                Ok = true,
                Message = "OK"
            });
        }


        private static object ThrowErrorMessage(string message)
        {
            return new
            {
                Message = message,
                Ok = false
            };
        }
        #endregion

        #region Contract Types
        public async Task<IActionResult> ContractTypes(int page = 1, string? search = null)
        {
            var contractTypes = await contractTypeService.GetContractTypeAsync(page, PAGE_SIZE, search);
            return View(contractTypes);
        }
        #endregion
    }
}
