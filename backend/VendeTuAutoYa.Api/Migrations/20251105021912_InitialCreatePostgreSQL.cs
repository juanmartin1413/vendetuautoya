using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace VendeTuAutoYa.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreatePostgreSQL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    MembershipJson = table.Column<string>(type: "jsonb", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
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
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "vendedor@vendetuautoya.com", null, "Juan Carlos Pérez", "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", "+56912345678", 0, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "concesionario1@vendetuautoya.com", "{\"Status\":1,\"ExpirationDate\":\"2025-12-01T00:00:00Z\",\"LastPaymentDate\":\"2024-10-01T00:00:00Z\",\"AutoRenew\":true}", "AutoMax Premium", "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", "+56912345679", 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "concesionario2@vendetuautoya.com", "{\"Status\":0,\"ExpirationDate\":null,\"LastPaymentDate\":null,\"AutoRenew\":false}", "Vehículos Elite", "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", "+56912345680", 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "administrador@vendetuautoya.com", null, "María González", "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", "+56912345681", 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "inversor@vendetuautoya.com", null, "Roberto Martínez", "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", "+56912345682", 3, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
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
