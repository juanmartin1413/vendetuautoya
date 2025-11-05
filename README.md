# VendeTuAutoYa - Plataforma de Subastas de Vehículos

Monorepo completo de la plataforma VendeTuAutoYa con frontend React y backend .NET 8.

## 🏗️ **Arquitectura del Proyecto**

```
VendeTuAutoYa/
├── frontend/                    # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/             # Páginas de la aplicación
│   │   ├── contexts/          # Context API (Auth, etc.)
│   │   ├── types/             # Tipos TypeScript
│   │   └── assets/            # Recursos estáticos
│   ├── public/                # Archivos públicos
│   ├── package.json           # Dependencias frontend
│   └── vite.config.ts         # Configuración Vite
├── backend/                   # .NET 8 Web API
│   └── VendeTuAutoYa.Api/
│       ├── Controllers/       # Controladores API
│       ├── Models/           # Modelos de datos
│       ├── Services/         # Lógica de negocio
│       ├── Data/             # Contexto EF Core
│       └── DTOs/             # Data Transfer Objects
├── README.md                 # Este archivo
└── .gitignore               # Archivos ignorados
```

## 🚀 **Tecnologías Utilizadas**

### **Frontend**
- **React 18** con TypeScript
- **Tailwind CSS** para estilos
- **Vite** como bundler
- **React Router** para navegación
- **Context API** para estado global

### **Backend**
- **.NET 8** Web API
- **Entity Framework Core** con SQLite/PostgreSQL
- **JWT Bearer Authentication**
- **BCrypt** para hash de contraseñas
- **Swagger/OpenAPI** para documentación

## ⚡ **Inicio Rápido**

### **Prerequisitos**
- Node.js 18+ 
- .NET 8 SDK
- Git

### **Instalación y Ejecución**

#### **1. Clonar el repositorio**
```bash
git clone https://github.com/juanmartin1413/vendetuautoya.git
cd vendetuautoya
```

#### **2. Frontend (Puerto 5173)**
```bash
cd frontend
npm install
npm run dev
```

#### **3. Backend (Puerto 7001)**
```bash
cd backend/VendeTuAutoYa.Api
dotnet restore
dotnet run
```

### **🌐 URLs de Desarrollo**
- **Frontend**: http://localhost:5173
- **Backend API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001

## 👥 **Usuarios de Prueba**

Todos los usuarios utilizan la contraseña: **123456**

| Email | Tipo | Nombre | Descripción |
|-------|------|--------|-------------|
| `vendedor@vendetuautoya.com` | vendedor | Juan Carlos Pérez | Usuario regular |
| `concesionario1@vendetuautoya.com` | concesionario | AutoMax Premium | Con membresía premium |
| `concesionario2@vendetuautoya.com` | concesionario | Vehículos Elite | Cuenta gratuita |
| `administrador@vendetuautoya.com` | administrador | María González | Acceso total |
| `inversor@vendetuautoya.com` | inversor | Roberto Martínez | Usuario inversionista |

## 📋 **Funcionalidades Implementadas**

### ✅ **Frontend Completo**
- Sistema de autenticación con JWT
- Dashboard diferenciado por rol de usuario
- Gestión de perfiles y membresías
- Sistema de subastas y notificaciones
- Simulación de pagos con MercadoPago
- Generación de reportes PDF
- Diseño responsive con Tailwind CSS

### ✅ **Backend Completo**
- API REST completa con documentación Swagger
- Autenticación JWT con roles
- CRUD completo de usuarios
- Sistema de membresías con JSON storage
- Validaciones y seguridad implementada
- Base de datos con Entity Framework Core

## 🚀 **Scripts Disponibles**

### **Desarrollo**
```bash
# Frontend
cd frontend && npm run dev     # Ejecutar frontend en desarrollo
cd frontend && npm run build   # Build de producción frontend

# Backend  
cd backend/VendeTuAutoYa.Api && dotnet run      # Ejecutar backend en desarrollo
cd backend/VendeTuAutoYa.Api && dotnet build    # Build de producción backend
```

## 🌐 **Deployment**

### **Frontend (Estático)**
- **Vercel** (Recomendado - Gratis)
- **Netlify** (Alternativa - Gratis)
- **Cloudflare Pages** (Alternativa - Gratis)

### **Backend (API)**
- **Railway** (Recomendado - $5/mes)
- **DigitalOcean App Platform** ($12/mes)
- **Azure App Service** ($13/mes)

### **Base de Datos**
- **PostgreSQL en Railway** (incluido)
- **Azure Database for PostgreSQL** 
- **AWS RDS PostgreSQL**

## 🔧 **Configuración para Producción**

### **Variables de Entorno Frontend**
```env
REACT_APP_API_URL=https://tu-backend.railway.app/api
```

### **Variables de Entorno Backend**
```env
ConnectionStrings__DefaultConnection=Host=host;Database=db;Username=user;Password=pass
Jwt__Key=tu-clave-secreta-super-segura
Jwt__Issuer=VendeTuAutoYa.Api
Jwt__Audience=VendeTuAutoYa.Client
```

## 📊 **Estado del Proyecto**

- ✅ **Frontend**: 100% Funcional
- ✅ **Backend**: 100% Funcional  
- ✅ **Autenticación**: Implementada
- ✅ **Base de Datos**: Configurada
- ✅ **Documentación**: Completa
- 🚀 **Listo para Deploy**

## 🤝 **Contribución**

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Crear Pull Request

## 📝 **Licencia**

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 **Contacto**

**Desarrollador**: Juan Martin  
**Email**: juanmartin1413@email.com  
**GitHub**: [@juanmartin1413](https://github.com/juanmartin1413)

---

⭐ **¡Dale una estrella si te gusta el proyecto!**