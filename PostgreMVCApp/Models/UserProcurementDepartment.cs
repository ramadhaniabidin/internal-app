namespace PostgreMVCApp.Models
{
    public class UserProcurementDepartment
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProcurementDepartmentId { get; set; }
        public int BranchId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool Active { get; set; }
    }
}
