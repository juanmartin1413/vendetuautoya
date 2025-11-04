# VendeTuAutoYa API Backend

API REST desarrollada en .NET 8 para la plataforma VendeTuAutoYa.

## Tecnologías Utilizadas

- **.NET 8** - Framework principal
- **Entity Framework Core** - ORM para base de datos
- **PostgreSQL** - Base de datos principal
- **JWT Bearer Authentication** - Sistema de autenticación
- **BCrypt** - Hash de contraseñas
- **Swagger/OpenAPI** - Documentación de API

## Estructura del Proyecto

```
VendeTuAutoYa.Api/
├── Controllers/          # Controladores de la API
│   ├── AuthController.cs # Endpoints de autenticación
│   └── UsersController.cs # Gestión de usuarios
├── Data/                 # Contexto de base de datos
│   └── ApplicationDbContext.cs
├── DTOs/                 # Data Transfer Objects
│   └── AuthDTOs.cs      # DTOs para autenticación
├── Models/               # Modelos de datos
│   └── User.cs          # Modelo de usuario
├── Services/             # Lógica de negocio
│   └── AuthService.cs   # Servicio de autenticación
└── Program.cs           # Configuración de la aplicación
```

## Modelos de Datos

### User
- **Id**: Identificador único
- **Email**: Email del usuario (único)
- **Name**: Nombre completo
- **Phone**: Teléfono de contacto
- **PasswordHash**: Contraseña hasheada con BCrypt
- **Type**: Tipo de usuario (vendedor, concesionario, administrador, inversor)
- **Membership**: Información de membresía (JSON)
- **CreatedAt/UpdatedAt**: Timestamps

### MembershipInfo
- **Status**: Estado de membresía (free, premium_monthly, premium_annual)
- **ExpirationDate**: Fecha de expiración
- **LastPaymentDate**: Último pago realizado
- **AutoRenew**: Renovación automática

## Endpoints Disponibles

### Autenticación (`/api/auth`)
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar nuevo usuario
- `GET /me` - Obtener perfil del usuario autenticado
- `PUT /me` - Actualizar perfil del usuario autenticado

### Usuarios (`/api/users`) - Solo administradores
- `GET /` - Listar todos los usuarios
- `GET /{id}` - Obtener usuario por ID
- `PUT /{id}` - Actualizar usuario
- `DELETE /{id}` - Eliminar usuario
- `POST /{id}/membership` - Actualizar membresía de usuario
- `GET /by-type/{userType}` - Obtener usuarios por tipo

## Configuración

### Base de Datos
Configurar la cadena de conexión en `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=vendetuautoya;Username=postgres;Password=postgres;Port=5432"
  }
}
```

### JWT
Configurar los parámetros JWT en `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "SuperSecretKeyForJWTTokenGeneration2024!@#$%",
    "Issuer": "VendeTuAutoYa.Api",
    "Audience": "VendeTuAutoYa.Client"
  }
}
```

## Ejecución

### Requisitos Previos
- .NET 8 SDK
- PostgreSQL Server

### Comandos

```bash
# Restaurar dependencias
dotnet restore

# Compilar el proyecto
dotnet build

# Ejecutar en modo desarrollo
dotnet run

# Ejecutar con hot-reload
dotnet watch run
```

### URLs de Desarrollo
- **API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001 (raíz)

## Autenticación

La API utiliza JWT Bearer tokens. Para autenticarse:

1. Registrarse o hacer login en `/api/auth/register` o `/api/auth/login`
2. Usar el token JWT retornado en el header `Authorization: Bearer {token}`

### Roles de Usuario
- **vendedor**: Usuario regular que puede vender vehículos
- **concesionario**: Usuario con funcionalidades de concesionario
- **administrador**: Acceso completo a gestión de usuarios
- **inversor**: Usuario inversionista

## CORS

La API está configurada para aceptar peticiones desde:
- `http://localhost:5173` (Frontend en desarrollo)

## Datos de Prueba

Al iniciar la aplicación se crean usuarios de prueba:

```json
{
  "email": "admin@vendetuautoya.com",
  "password": "admin123",
  "type": "administrador"
}
```

Para cada tipo de usuario hay un usuario de prueba con el patrón:
- Email: `{tipo}@vendetuautoya.com`
- Password: `{tipo}123`

## Seguridad

- Contraseñas hasheadas con BCrypt
- Autenticación JWT con expiración de 7 días
- Validación de roles para endpoints administrativos
- CORS configurado para frontend específico

## Base de Datos

El proyecto está configurado para crear automáticamente la base de datos y tablas al iniciar (`EnsureCreated`). Para producción, se recomienda usar migraciones de Entity Framework:

```bash
# Crear migración
dotnet ef migrations add InitialCreate

# Aplicar migración
dotnet ef database update
```