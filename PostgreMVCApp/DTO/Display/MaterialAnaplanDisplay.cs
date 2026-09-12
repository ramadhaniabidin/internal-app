using PostgreMVCApp.Models.Master_Data;

namespace PostgreMVCApp.DTO.Display
{
    public class MaterialAnaplanDisplay: MaterialAnaplan
    {
        public string GeneralLedgerCode { get; set; } = string.Empty;
        public string GeneralLedgerDescription { get; set; } = string.Empty;
        public string Concatenate { get; set; } = string.Empty;
        public string ProcDeptName { get; set; } = string.Empty;
        public string ProcDeptCode { get; set; } = string.Empty;
    }
}
