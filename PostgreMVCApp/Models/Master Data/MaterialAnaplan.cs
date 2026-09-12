namespace PostgreMVCApp.Models.Master_Data
{
    public class MaterialAnaplan
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string Description {  get; set; } = string.Empty;
        public string ValuationClass {  get; set; } = string.Empty;
        public bool CanRevise { get; set; } = false;
        public decimal ThresholdMin { get; set; }
        public decimal ThresholdMax { get; set; }
        public int ProcurementDepartmentId { get; set; }
        public int GeneralLedgerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool Active { get; set; } = true;
    }
}
