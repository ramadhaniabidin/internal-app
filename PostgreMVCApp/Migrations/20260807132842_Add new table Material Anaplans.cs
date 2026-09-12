using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PostgreMVCApp.Migrations
{
    /// <inheritdoc />
    public partial class AddnewtableMaterialAnaplans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MaterialAnaplans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ValuationClass = table.Column<string>(type: "text", nullable: false),
                    CanRevise = table.Column<bool>(type: "boolean", nullable: false),
                    ThresholdMin = table.Column<decimal>(type: "numeric", nullable: false),
                    ThresholdMax = table.Column<decimal>(type: "numeric", nullable: false),
                    ProcurementDepartmentId = table.Column<int>(type: "integer", nullable: false),
                    GeneralLedgerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialAnaplans", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MaterialAnaplans");
        }
    }
}
