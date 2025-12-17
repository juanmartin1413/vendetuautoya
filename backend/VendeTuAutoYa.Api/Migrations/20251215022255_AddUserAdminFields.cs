using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VendeTuAutoYa.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserAdminFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsEmailVerified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ObservationComment",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "DeletedAt", "IsDeleted", "IsEmailVerified", "ObservationComment", "Status" },
                values: new object[] { null, false, false, null, "activo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "DeletedAt", "IsDeleted", "IsEmailVerified", "ObservationComment", "Status" },
                values: new object[] { null, false, false, null, "activo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DeletedAt", "IsDeleted", "IsEmailVerified", "ObservationComment", "Status" },
                values: new object[] { null, false, false, null, "activo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "DeletedAt", "IsDeleted", "IsEmailVerified", "ObservationComment", "Status" },
                values: new object[] { null, false, false, null, "activo" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "DeletedAt", "IsDeleted", "IsEmailVerified", "ObservationComment", "Status" },
                values: new object[] { null, false, false, null, "activo" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "IsEmailVerified",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ObservationComment",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Users");
        }
    }
}
