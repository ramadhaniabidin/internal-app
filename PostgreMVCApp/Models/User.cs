using System.ComponentModel.DataAnnotations;

namespace PostgreMVCApp.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string Role { get; set; } = "User";

        public string? Division { get; set; }

        public string? Department { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime LastLoginDateTime { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
