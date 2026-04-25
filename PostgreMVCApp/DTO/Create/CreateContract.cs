using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Create
{
    public class CreateContract
    {
        public List<Branch> Branches { get; set; } = new();
        public List<ProcurementDepartment> ProcurementDepartments { get; set; } = new();
    }
}
