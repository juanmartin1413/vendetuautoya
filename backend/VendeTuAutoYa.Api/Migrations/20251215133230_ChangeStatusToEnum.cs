using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VendeTuAutoYa.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeStatusToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, add a temporary column to hold the integer values
            migrationBuilder.AddColumn<int>(
                name: "StatusTemp",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            // Convert string values to integers for all users
            migrationBuilder.Sql(@"
                UPDATE ""Users"" 
                SET ""StatusTemp"" = CASE 
                    WHEN ""Status"" = 'activo' THEN 1
                    WHEN ""Status"" = 'pendiente_validacion' THEN 2
                    WHEN ""Status"" = 'pendiente_informacion' THEN 3
                    WHEN ""Status"" = 'observado' THEN 4
                    ELSE 1
                END
            ");

            // Drop the old Status column
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Users");

            // Rename StatusTemp to Status
            migrationBuilder.RenameColumn(
                name: "StatusTemp",
                table: "Users",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Add a temporary column to hold the string values
            migrationBuilder.AddColumn<string>(
                name: "StatusTemp",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "activo");

            // Convert integer values back to strings for all users
            migrationBuilder.Sql(@"
                UPDATE ""Users"" 
                SET ""StatusTemp"" = CASE 
                    WHEN ""Status"" = 1 THEN 'activo'
                    WHEN ""Status"" = 2 THEN 'pendiente_validacion'
                    WHEN ""Status"" = 3 THEN 'pendiente_informacion'
                    WHEN ""Status"" = 4 THEN 'observado'
                    ELSE 'activo'
                END
            ");

            // Drop the old Status column
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Users");

            // Rename StatusTemp to Status
            migrationBuilder.RenameColumn(
                name: "StatusTemp",
                table: "Users",
                newName: "Status");
        }
    }
}
