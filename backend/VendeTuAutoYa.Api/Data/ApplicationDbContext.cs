using Microsoft.EntityFrameworkCore;
using VendeTuAutoYa.Api.Models;

namespace VendeTuAutoYa.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuración para el modelo User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Type).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
                
                // Configuración para el campo JSON de membresía
                entity.Property(e => e.MembershipJson)
                    .HasColumnType("TEXT") // Cambiado de jsonb a TEXT para SQLite
                    .IsRequired(false);
            });

            // Seed data para usuarios de prueba
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Email = "vendedor@vendetuautoya.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Type = UserType.vendedor,
                    Name = "Vendedor Demo",
                    Phone = "+1234567890",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Email = "concesionario@vendetuautoya.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Type = UserType.concesionario,
                    Name = "Concesionario Demo",
                    Phone = "+1234567891",
                    MembershipJson = System.Text.Json.JsonSerializer.Serialize(new MembershipInfo
                    {
                        Status = MembershipStatus.free,
                        ExpirationDate = null,
                        LastPaymentDate = null,
                        AutoRenew = false
                    }),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Email = "administrador@vendetuautoya.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Type = UserType.administrador,
                    Name = "Administrador Sistema",
                    Phone = "+1234567892",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 4,
                    Email = "inversor@vendetuautoya.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    Type = UserType.inversor,
                    Name = "Inversor Demo",
                    Phone = "+1234567893",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            };

            modelBuilder.Entity<User>().HasData(users);
        }
    }
}