using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostgreMVCApp.DTO.Create;
using PostgreMVCApp.DTO.Display;
using PostgreMVCApp.Models;
using PostgreMVCApp.Services.EFCore;
using System.Diagnostics.Contracts;
using System.Runtime.CompilerServices;

namespace PostgreMVCApp.Controllers
{
    [Authorize]
    public class NonCommercialsController : Controller
    {
        private readonly EFBranchService branchService;
        private readonly EFProcDeptService procDeptService;
        private readonly EFModuleService moduleService;
        private readonly EFStatusService statusService;
        private readonly EFRoleService roleService;
        private readonly EFContractTypeService contractTypeService;
        private readonly List<int> contractApproverRoleIds;
        private readonly List<int> prApproverRoleIds;
        private readonly List<int> qcfApproverRoleIds;
        private readonly List<int> poReleaseApproverRoleIds;
        private readonly List<int> poContractApproverRoleIds;
        public NonCommercialsController(IConfiguration configuration,
            EFBranchService branchService, EFProcDeptService procDeptService, 
            EFModuleService moduleService, 
            EFStatusService statusService,
            EFRoleService roleService,
            EFVendorService vendorService,
            EFContractTypeService contractTypeService)
        {
            contractApproverRoleIds = configuration.GetSection("AppSettings:ContractApproverRoleIds").Get<List<int>>() ?? [];
            prApproverRoleIds = configuration.GetSection("AppSettings:PRApproverRoleIds").Get<List<int>>() ?? [];
            qcfApproverRoleIds = configuration.GetSection("AppSettings:QCFApproverRoleIds").Get<List<int>>() ?? [];
            poReleaseApproverRoleIds = configuration.GetSection("AppSettings:POReleaseApproverRoleIds").Get<List<int>>() ?? [];
            poContractApproverRoleIds = configuration.GetSection("AppSettings:POContractApproverRoleIds").Get<List<int>>() ?? [];
            this.branchService = branchService;
            this.procDeptService = procDeptService;
            this.moduleService = moduleService;
            this.statusService = statusService;
            this.roleService = roleService;
            this.contractTypeService = contractTypeService;
        }

        public IActionResult Index()
        {
            var model = new NonCommercialList
            {
                Branches = branchService.GetActiveBranches(),
                ProcurementDepartments = procDeptService.GetAllProcDepts(),
                Modules = moduleService.GetNonCommercialModules(),
                Statuses = statusService.GetAllStatuses()
            };
            return View(model);
        }

        public async Task<IActionResult> Contract()
        {
            var contractTypes = await contractTypeService.GetContractTypeAsync(1, 30, "");
            var model = new CreateContract
            {
                Branches = await branchService.GetActiveBranchesAsync(),
                ProcurementDepartments = await procDeptService.GetAllProcDeptsAsync(),
                ContractTypes = contractTypes.Items
            };
            return View(model);
        }

        [HttpGet]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> GetApproverRoles(int moduleID)
        {
            List<Role> approverRoles = new();
            if(moduleID == 4) approverRoles = await roleService.GetRolesByIds(contractApproverRoleIds);
            else if(moduleID == 1) approverRoles = await roleService.GetRolesByIds(prApproverRoleIds);
            else if(moduleID == 2) approverRoles = await roleService.GetRolesByIds(qcfApproverRoleIds);
            else if(moduleID == 6) approverRoles = await roleService.GetRolesByIds(poReleaseApproverRoleIds);
            else if(moduleID == 5) approverRoles = await roleService.GetRolesByIds(poContractApproverRoleIds);
            return Json(new
            {
                Ok = true,
                Roles = approverRoles
            });
        }
    }
}
