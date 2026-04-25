namespace PostgreMVCApp.Models
{
    public class ProcurementDepartment
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Approver_Name { get; set; } = string.Empty;
        public string Approver_Email { get; set; } = string.Empty;
        public string Approver_Account { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime Created_Date { get; set; } = DateTime.UtcNow;
        public bool Is_Active { get; set; } = true;
    }
}
