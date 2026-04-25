using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Create
{
    public class CreateProcDeptDTO
    {
        public string Code { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Approver_Name { get; set; } = string.Empty;
        public string Approver_Email { get; set; } = string.Empty;
        public string Approver_Account { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<User> Approvers { get; set; } = new();
        public List<string> Categories { get; set; } = new()
        {
            "Marketing", "Non Marketing"
        };

    }
}
