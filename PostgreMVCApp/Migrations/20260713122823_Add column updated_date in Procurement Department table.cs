using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostgreMVCApp.Migrations
{
    /// <inheritdoc />
    public partial class Addcolumnupdated_dateinProcurementDepartmenttable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Updated_Date",
                table: "ProcurementDepartments",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Updated_Date",
                table: "ProcurementDepartments");
        }
    }
}
