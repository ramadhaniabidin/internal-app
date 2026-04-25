namespace PostgreMVCApp.Models
{
    public class Module
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public int CategoryId { get; set; }
        public string Link { get; set; } = string.Empty;
        public string TransactionCodeFormat { get; set; } = string.Empty;
        public string IconClass { get; set; } = string.Empty;
    }
}
