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
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Document> Documents { get; set; }

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
                    .HasColumnType("jsonb") // PostgreSQL soporta jsonb nativo
                    .IsRequired(false);
            });

            // Seed data para usuarios de prueba con roles específicos
            var users = new List<User>
            {
                // Usuario Vendedor
                new User
                {
                    Id = 1,
                    Email = "vendedor@vendetuautoya.com",
                    PasswordHash = "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", // 123456
                    Type = UserType.Vendedor,
                    Name = "Juan Carlos Pérez",
                    Phone = "+56912345678",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // Concesionario 1 - Para simulación de pujas
                new User
                {
                    Id = 2,
                    Email = "concesionario1@vendetuautoya.com",
                    PasswordHash = "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", // 123456
                    Type = UserType.Concesionario,
                    Name = "AutoMax Premium",
                    Phone = "+56912345679",
                    MembershipJson = "{\"Status\":2,\"ExpirationDate\":\"2025-12-01T00:00:00Z\",\"LastPaymentDate\":\"2024-10-01T00:00:00Z\",\"AutoRenew\":true}",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // Concesionario 2 - Para simulación de pujas
                new User
                {
                    Id = 3,
                    Email = "concesionario2@vendetuautoya.com",
                    PasswordHash = "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", // 123456
                    Type = UserType.Concesionario,
                    Name = "Vehículos Elite",
                    Phone = "+56912345680",
                    MembershipJson = "{\"Status\":1,\"ExpirationDate\":null,\"LastPaymentDate\":null,\"AutoRenew\":false}",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // Usuario Administrador
                new User
                {
                    Id = 4,
                    Email = "administrador@vendetuautoya.com",
                    PasswordHash = "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", // 123456
                    Type = UserType.Administrador,
                    Name = "María González",
                    Phone = "+56912345681",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                // Usuario Inversor
                new User
                {
                    Id = 5,
                    Email = "inversor@vendetuautoya.com",
                    PasswordHash = "$2a$11$CwSH.5h54BUl0c4cR5jgsO5DQSgkLfbwrW.XbVfT5KaIgGr68qpNe", // 123456
                    Type = UserType.Inversor,
                    Name = "Roberto Martínez",
                    Phone = "+56912345682",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    UpdatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            };

            modelBuilder.Entity<User>().HasData(users);
            
            // Configuración para UserProfile
            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Profile)
                    .HasForeignKey<UserProfile>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // Configuración para Address
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithOne()
                    .HasForeignKey<Address>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.Street).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Number).IsRequired().HasMaxLength(10);
                entity.Property(e => e.City).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Province).IsRequired().HasMaxLength(100);
            });
            
            // Configuración para Document
            modelBuilder.Entity<Document>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Documents)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.Property(e => e.DocumentType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
                entity.Property(e => e.ContentType).IsRequired().HasMaxLength(50);
            });
        }
    }
}