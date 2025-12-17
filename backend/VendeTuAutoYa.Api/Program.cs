using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using VendeTuAutoYa.Api.Data;
using VendeTuAutoYa.Api.Services;
using VendeTuAutoYa.Api.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();

// Configuración de Swagger con autenticación JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "VendeTuAutoYa API", Version = "v1" });
    
    // Configurar autenticación JWT en Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Configuración para manejar file uploads en Swagger (temporalmente simplificada)
    c.MapType<IFormFile>(() => new OpenApiSchema
    {
        Type = "string",
        Format = "binary"
    });
});

// Configuración de Entity Framework con PostgreSQL
// Configurar Npgsql para usar UTC por defecto y convertir automáticamente DateTimes
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuración de JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Configuración de CORS para el frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174", 
                "http://localhost:5175",
                "http://localhost:3000",  // Para React en caso de usar puerto 3000
                "https://localhost:5173", // HTTPS versions
                "https://localhost:5174"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Registrar servicios de la aplicación
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "VendeTuAutoYa API v1");
        c.RoutePrefix = string.Empty; // Para que Swagger esté en la raíz
        c.DisplayRequestDuration(); // Mostrar duración de requests
        c.EnableDeepLinking(); // Permitir enlaces directos
        c.EnableFilter(); // Habilitar filtros
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None); // No expandir automáticamente
    });
}

app.UseHttpsRedirection(); // Habilitado para HTTPS

// Servir archivos estáticos (para uploads)
app.UseStaticFiles();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Crear la base de datos y aplicar migraciones al iniciar
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.EnsureCreated(); // Para desarrollo, en producción usar migraciones
}

app.Run();