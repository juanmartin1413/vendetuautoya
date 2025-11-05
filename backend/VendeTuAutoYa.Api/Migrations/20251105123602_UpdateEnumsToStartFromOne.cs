using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VendeTuAutoYa.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEnumsToStartFromOne : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Type",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "MembershipJson", "Type" },
                values: new object[] { "{\"Status\":2,\"ExpirationDate\":\"2025-12-01T00:00:00Z\",\"LastPaymentDate\":\"2024-10-01T00:00:00Z\",\"AutoRenew\":true}", 2 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "MembershipJson", "Type" },
                values: new object[] { "{\"Status\":1,\"ExpirationDate\":null,\"LastPaymentDate\":null,\"AutoRenew\":false}", 2 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Type",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "Type",
                value: 4);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "Type",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "MembershipJson", "Type" },
                values: new object[] { "{\"Status\":1,\"ExpirationDate\":\"2025-12-01T00:00:00Z\",\"LastPaymentDate\":\"2024-10-01T00:00:00Z\",\"AutoRenew\":true}", 1 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "MembershipJson", "Type" },
                values: new object[] { "{\"Status\":0,\"ExpirationDate\":null,\"LastPaymentDate\":null,\"AutoRenew\":false}", 1 });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                column: "Type",
                value: 2);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                column: "Type",
                value: 3);
        }
    }
}
