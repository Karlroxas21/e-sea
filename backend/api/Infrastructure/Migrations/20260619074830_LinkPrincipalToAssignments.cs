using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class LinkPrincipalToAssignments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Principal",
                table: "Assignments");

            migrationBuilder.AddColumn<Guid>(
                name: "PrincipalId",
                table: "Assignments",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Assignments_PrincipalId",
                table: "Assignments",
                column: "PrincipalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assignments_Principals_PrincipalId",
                table: "Assignments",
                column: "PrincipalId",
                principalTable: "Principals",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assignments_Principals_PrincipalId",
                table: "Assignments");

            migrationBuilder.DropIndex(
                name: "IX_Assignments_PrincipalId",
                table: "Assignments");

            migrationBuilder.DropColumn(
                name: "PrincipalId",
                table: "Assignments");

            migrationBuilder.AddColumn<string>(
                name: "Principal",
                table: "Assignments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
