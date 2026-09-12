using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Display
{
    public class UserProcDept: UserProcurementDepartment
    {
        public string? UserFullName { get; set; }
        public string? UserAccount {  get; set; }
        public string? UserEmail { get; set; }
        public string? ProcDeptName { get; set; }
        public string? ProcDeptCode { get; set; }
        public string? BranchName { get; set; }
        public string? BranchCode { get; set; }
    }
}
