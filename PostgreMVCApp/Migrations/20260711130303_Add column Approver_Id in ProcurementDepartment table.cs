using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostgreMVCApp.Migrations
{
    /// <inheritdoc />
    public partial class AddcolumnApprover_IdinProcurementDepartmenttable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Updated_Date",
                table: "ContractTypes",
                newName: "UpdatedDate");

            migrationBuilder.RenameColumn(
                name: "Is_Active",
                table: "ContractTypes",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "Created_Date",
                table: "ContractTypes",
                newName: "CreatedDate");

            migrationBuilder.AddColumn<int>(
                name: "Approver_Id",
                table: "ProcurementDepartments",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Approver_Id",
                table: "ProcurementDepartments");

            migrationBuilder.RenameColumn(
                name: "UpdatedDate",
                table: "ContractTypes",
                newName: "Updated_Date");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "ContractTypes",
                newName: "Is_Active");

            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "ContractTypes",
                newName: "Created_Date");
        }
    }
}
