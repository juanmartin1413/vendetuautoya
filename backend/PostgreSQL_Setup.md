# 🔧 Configuración de PostgreSQL para VendeTuAutoYa

## 📋 **Pasos para Configurar PostgreSQL:**

### **1. Verificar el Estado del Servicio**
1. Abrir **Services** (Servicios) en Windows
2. Buscar "postgresql-x64-18" o similar
3. Verificar que esté en estado "Running" (Ejecutándose)

### **2. Configurar Contraseña del Usuario postgres**
Opción A - Desde pgAdmin (Si está instalado):
1. Abrir pgAdmin desde el menú inicio
2. Conectarse al servidor local
3. Right-click en "Login/Group Roles" → "postgres"
4. Cambiar la contraseña a "postgres" o anotar la actual

Opción B - Desde línea de comandos:
```cmd
# Abrir CMD como administrador y ejecutar:
"D:\Programs\PostgreSQL\18\bin\psql.exe" -U postgres
# Cuando pida contraseña, usar la que configuraste en la instalación
# Luego ejecutar:
ALTER USER postgres PASSWORD 'postgres';
\q
```

### **3. Verificar pg_hba.conf**
1. Navegar a: `D:\Programs\PostgreSQL\18\data\pg_hba.conf`
2. Verificar que tenga estas líneas:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                trust
host    all             postgres        127.0.0.1/32            md5
host    all             postgres        ::1/128                 md5
```

### **4. Reiniciar PostgreSQL**
1. Services → postgresql-x64-18 → Restart

### **5. Probar Conexión**
```cmd
"D:\Programs\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost
```

## 🔑 **Configuraciones Comunes:**

### **Configuración 1: Contraseña 'postgres'**
```
Host=localhost;Database=vendetuautoya;Username=postgres;Password=postgres;Port=5432
```

### **Configuración 2: Sin contraseña (trust)**
```
Host=localhost;Database=vendetuautoya;Username=postgres;Password=;Port=5432
```

### **Configuración 3: Puerto personalizado**
```
Host=localhost;Database=vendetuautoya;Username=postgres;Password=tu_password;Port=5433
```

## ⚠️ **Si PostgreSQL no funciona:**
Podemos volver temporalmente a SQLite hasta resolver la configuración:
1. Cambiar en `appsettings.json`
2. Usar: `"DefaultConnection": "Data Source=vendetuautoya.db"`
3. Cambiar `UseNpgsql` por `UseSqlite` en `Program.cs`

## 📞 **Próximos Pasos:**
1. Verificar la contraseña actual de PostgreSQL
2. Informar cuál es la configuración correcta
3. Aplicar la migración exitosamente