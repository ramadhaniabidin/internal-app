using System.ComponentModel.DataAnnotations;

namespace PostgreMVCApp.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        public decimal Price { get; set; }

        public string? Description { get; set; }

        public string? Category { get; set; }

        public string? ImageUrl { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
