namespace PostgreMVCApp.Models
{
    public class VendorNonCommercials
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code {  get; set; } = string.Empty;
        public string BankKey {  get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankAccount {  get; set; } = string.Empty;
        public string PartnerBankID {  get; set; } = string.Empty;
        public string AccountHolder {  get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set;} = DateTime.Now;
        public string ItemID { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

    }
}
