# VendeTuAutoYa Frontend

Frontend de la plataforma VendeTuAutoYa construido con React 18, TypeScript y Tailwind CSS.

## 🚀 **Tecnologías**

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset de JavaScript con tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Vite** - Herramienta de construcción rápida
- **React Router** - Enrutamiento de la aplicación
- **Context API** - Gestión de estado global

## ⚡ **Inicio Rápido**

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Crear build de producción
npm run build
```

## 📱 **Funcionalidades**

### ✅ **Sistema de Autenticación**
- Login/registro con validación
- Gestión de sesiones con Context API
- Protección de rutas por rol

### ✅ **Dashboards por Rol**
- **Vendedor**: Gestión de subastas personales
- **Concesionario**: Panel con sistema de membresías
- **Administrador**: Estadísticas y gestión de usuarios
- **Inversor**: Portal de inversiones

### ✅ **Funcionalidades Avanzadas**
- Sistema de notificaciones en tiempo real
- Generación de reportes PDF
- Simulación de pagos MercadoPago
- Búsqueda avanzada de vehículos
- Diseño responsive completo

## 🏗️ **Estructura de Archivos**

```
src/
├── components/           # Componentes reutilizables
│   ├── Header.tsx       # Header principal
│   ├── Sidebar.tsx      # Barra lateral
│   ├── AuctionItem.tsx  # Item de subasta
│   └── Icons.tsx        # Iconos SVG
├── pages/               # Páginas de la aplicación
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── LoginScreen.tsx  # Pantalla de login
│   ├── RegisterScreen.tsx # Pantalla de registro
│   ├── MyAuctions.tsx   # Mis subastas
│   └── ...
├── contexts/            # Context providers
│   └── AuthContext.tsx  # Contexto de autenticación
├── types/               # Tipos TypeScript
│   └── auth.ts         # Tipos de autenticación
├── assets/             # Recursos estáticos
└── index.css          # Estilos globales
```

## 🎨 **Diseño y UX**

- **Design System**: Tailwind CSS con componentes consistentes
- **Responsive**: Optimizado para móvil, tablet y desktop
- **Accesibilidad**: Implementación de mejores prácticas
- **Dark Mode**: Soporte para tema oscuro

## 🔗 **Integración con Backend**

El frontend está configurado para conectarse con el backend .NET en:
- **Desarrollo**: `https://localhost:7001`
- **Producción**: Variable de entorno `REACT_APP_API_URL`

## 📦 **Scripts Disponibles**

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linter ESLint
```

## 🚀 **Deploy**

### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Subir carpeta dist/ a Netlify
```

## 🌐 **Variables de Entorno**

Crear archivo `.env` en la raíz del frontend:

```env
REACT_APP_API_URL=https://tu-backend.railway.app/api
REACT_APP_ENVIRONMENT=production
```

## 📱 **Capacitor (Aplicación Móvil)**

El proyecto incluye configuración para generar aplicación móvil:

```bash
# Agregar plataforma
npx cap add android
npx cap add ios

# Sincronizar
npx cap sync

# Abrir en IDE nativo
npx cap open android
npx cap open ios
```

## 🧪 **Testing**

```bash
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage de tests
```

---

**Parte del monorepo VendeTuAutoYa**  
Para más información, ver el [README principal](../README.md)