using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostgreMVCApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBranchTableColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Branches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Branches",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Code",
                table: "Branches");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Branches");
        }
    }
}
