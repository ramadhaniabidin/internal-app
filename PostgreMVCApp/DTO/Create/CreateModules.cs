using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Create
{
    public class CreateModules
    {
        public List<ModuleCategory> ModuleCategories { get; set; } = new();
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string TransactionCodeFormat { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string IconClass { get; set; } = string.Empty;
    }
}
