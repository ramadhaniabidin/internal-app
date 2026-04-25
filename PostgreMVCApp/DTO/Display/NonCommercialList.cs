using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Display
{
    public class NonCommercialList
    {
        public List<Branch> Branches { get; set; } = new();
        public List<ProcurementDepartment> ProcurementDepartments { get; set; } = new();
        public List<Module> Modules { get; set; } = new();
        public List<Status> Statuses { get; set; } = new();
    }
}
