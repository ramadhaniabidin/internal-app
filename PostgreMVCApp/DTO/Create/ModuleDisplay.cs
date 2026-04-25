namespace PostgreMVCApp.DTO.Create
{
    public class ModuleDisplay
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string TransactionCodeFormat { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public string IconClass { get; set; } = string.Empty;
    }
}
