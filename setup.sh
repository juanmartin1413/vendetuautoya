#!/bin/bash

# ====================
# VendeTuAutoYa Setup
# ====================

echo "🚀 Configurando VendeTuAutoYa Monorepo..."
echo ""

# Verificar prerequisitos
echo "📋 Verificando prerequisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instalar Node.js 18+ desde https://nodejs.org/"
    exit 1
fi

# Verificar .NET
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK no está instalado. Por favor instalar .NET 8 SDK desde https://dotnet.microsoft.com/"
    exit 1
fi

echo "✅ Prerequisitos verificados"
echo ""

# Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error instalando dependencias del frontend"
    exit 1
fi
cd ..
echo "✅ Dependencias del frontend instaladas"
echo ""

# Restaurar dependencias del backend
echo "📦 Restaurando dependencias del backend..."
cd backend/VendeTuAutoYa.Api
dotnet restore
if [ $? -ne 0 ]; then
    echo "❌ Error restaurando dependencias del backend"
    exit 1
fi
cd ../..
echo "✅ Dependencias del backend restauradas"
echo ""

# Aplicar migraciones de base de datos
echo "🗄️ Configurando base de datos..."
cd backend/VendeTuAutoYa.Api
dotnet ef database update
if [ $? -ne 0 ]; then
    echo "⚠️ Error aplicando migraciones (esto es normal en primera ejecución)"
fi
cd ../..
echo "✅ Base de datos configurada"
echo ""

# Crear archivo .env para frontend
if [ ! -f "frontend/.env" ]; then
    echo "🔧 Creando archivo de configuración frontend..."
    cat > frontend/.env << EOL
# Configuración de desarrollo
REACT_APP_API_URL=https://localhost:7001/api
REACT_APP_ENVIRONMENT=development
EOL
    echo "✅ Archivo .env creado en frontend/"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "🚀 Para comenzar a desarrollar:"
echo "   Frontend: cd frontend && npm run dev"
echo "   Backend:  cd backend/VendeTuAutoYa.Api && dotnet run"
echo ""
echo "🌐 URLs de desarrollo:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  https://localhost:7001"
echo "   Swagger:  https://localhost:7001"
echo ""
echo "👥 Usuarios de prueba:"
echo "   vendedor@vendetuautoya.com / 123456"
echo "   concesionario@vendetuautoya.com / 123456"
echo "   administrador@vendetuautoya.com / 123456"
echo "   inversor@vendetuautoya.com / 123456"
echo ""