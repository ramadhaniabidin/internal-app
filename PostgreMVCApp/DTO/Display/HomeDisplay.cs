using PostgreMVCApp.Models;

namespace PostgreMVCApp.DTO.Display
{
    public class HomeDisplay
    {
        public List<ModuleCategoryDisplay> ModuleCategories { get; set; } = new List<ModuleCategoryDisplay>();
    }
}
