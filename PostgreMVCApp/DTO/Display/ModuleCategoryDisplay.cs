namespace PostgreMVCApp.DTO.Display
{
    public class ModuleCategoryDisplay
    {
        public string Name { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public string IconClass { get; set; } = string.Empty;
        public List<ModuleDisplay> Modules { get; set; } = new List<ModuleDisplay>();

    }
}
