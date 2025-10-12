# VendeTuAutoYa

Una aplicación móvil para la venta de automóviles construida con React 18, Vite, Tailwind CSS y Capacitor.

## 🚀 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **TypeScript** - Superset de JavaScript con tipado estático
- **Tailwind CSS** - Framework de CSS utilitario
- **Capacitor** - Compilación multiplataforma para móviles
- **React Router DOM** - Navegación entre pantallas

## 📱 Características

- Pantalla de splash con logo animado
- Sistema de autenticación con login
- Diseño responsivo optimizado para móviles
- Paleta de colores basada en el branding de la marca
- Navegación fluida entre pantallas

## 🛠️ Instalación

1. **Instala las dependencias**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

## 📱 Compilación para móviles

### Android

1. **Construye la aplicación**
   ```bash
   npm run build
   ```

2. **Inicializa Capacitor (solo la primera vez)**
   ```bash
   npm run cap:init
   ```

3. **Agrega la plataforma Android**
   ```bash
   npm run cap:add:android
   ```

4. **Sincroniza archivos**
   ```bash
   npm run cap:sync
   ```

5. **Abre Android Studio**
   ```bash
   npm run cap:open:android
   ```

### iOS

1. **Construye la aplicación**
   ```bash
   npm run build
   ```

2. **Agrega la plataforma iOS**
   ```bash
   npm run cap:add:ios
   ```

3. **Sincroniza archivos**
   ```bash
   npm run cap:sync
   ```

4. **Abre Xcode**
   ```bash
   npm run cap:open:ios
   ```

## 🎨 Paleta de colores

La aplicación utiliza una paleta de colores basada en el rojo del logo:

- **Primary**: Tonos de rojo (#ef4444, #dc2626, #b91c1c)
- **Secondary**: Tonos de gris (#64748b, #475569, #334155)

## 📂 Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Pantallas de la aplicación
│   ├── SplashScreen.tsx
│   └── LoginScreen.tsx
├── assets/        # Imágenes, iconos y otros recursos
├── hooks/         # Custom hooks de React
├── App.tsx        # Componente principal
├── main.tsx       # Punto de entrada
└── index.css      # Estilos globales con Tailwind
```

## 🚧 Estado actual

### ✅ Completado
- Configuración inicial del proyecto
- Pantalla de splash con logo
- Pantalla de login con formulario
- Configuración de Tailwind CSS
- Configuración de Capacitor
- Navegación entre pantallas

### 🔄 Próximas características
- Pantalla de registro
- Recuperación de contraseña
- Pantalla principal con listado de vehículos
- Detalles de vehículos
- Funcionalidad de búsqueda y filtros
- Sistema de favoritos
- Chat integrado
- Perfil de usuario

## 📝 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Preview de la construcción de producción
- `npm run lint` - Ejecuta ESLint
- `npm run build:mobile` - Construye y sincroniza para móviles