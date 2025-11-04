using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VendeTuAutoYa.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateSQLite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    MembershipJson = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "MembershipJson", "Name", "PasswordHash", "Phone", "Type", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 11, 4, 22, 6, 15, 175, DateTimeKind.Utc).AddTicks(2507), "vendedor@vendetuautoya.com", null, "Vendedor Demo", "$2a$11$/9XAbCBn5yscn93E.LaDu.Ms1DTjw3uiki0EBAJy3scMQnLKKTjl.", "+1234567890", 0, new DateTime(2025, 11, 4, 22, 6, 15, 175, DateTimeKind.Utc).AddTicks(3353) },
                    { 2, new DateTime(2025, 11, 4, 22, 6, 15, 406, DateTimeKind.Utc).AddTicks(9065), "concesionario@vendetuautoya.com", "{\"Status\":0,\"ExpirationDate\":null,\"LastPaymentDate\":null,\"AutoRenew\":false}", "Concesionario Demo", "$2a$11$k1UASlxJmadWyjVG2pEuWu2B9TnXMSlARFT2DHT72xjifY1P1tMk2", "+1234567891", 1, new DateTime(2025, 11, 4, 22, 6, 15, 406, DateTimeKind.Utc).AddTicks(9068) },
                    { 3, new DateTime(2025, 11, 4, 22, 6, 15, 569, DateTimeKind.Utc).AddTicks(7303), "administrador@vendetuautoya.com", null, "Administrador Sistema", "$2a$11$NDRNptqjhcD5BIFAW0RsX.iqwowFEUsFfAQlWWeU0fzjiy6LQz6tS", "+1234567892", 2, new DateTime(2025, 11, 4, 22, 6, 15, 569, DateTimeKind.Utc).AddTicks(7310) },
                    { 4, new DateTime(2025, 11, 4, 22, 6, 15, 824, DateTimeKind.Utc).AddTicks(1860), "inversor@vendetuautoya.com", null, "Inversor Demo", "$2a$11$evAYvftebTI1y2ms5FXZMe9yUYZswLl9jfeyTXcTpJ9U4n1QW0pcK", "+1234567893", 3, new DateTime(2025, 11, 4, 22, 6, 15, 824, DateTimeKind.Utc).AddTicks(1865) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
