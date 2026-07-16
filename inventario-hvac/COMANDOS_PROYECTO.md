# Comandos para arrancar el proyecto

Guía rápida para instalar dependencias, levantar la base de datos, ejecutar el backend y ejecutar el frontend del proyecto `inventario-hvac`.

## Requisitos

- Node.js instalado
- npm instalado
- Docker instalado, si vas a usar MySQL con `docker-compose`

## 1. Entrar al proyecto


```bash
cd inventario-Venegas-Corp/inventario-hvac
```

## 2. Levantar la base de datos MySQL

El proyecto incluye un `docker-compose.yml` para crear la base de datos MySQL.

```bash
docker compose up -d
```

La base de datos queda disponible en:

```txt
localhost:3306
```

Datos configurados en Docker:

```txt
Base de datos: inventario_hvac
Usuario: hvac_user
Password: hvac_password
Root password: rootpassword
```

## 3. Configurar el backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita el archivo `backend/.env` y verifica que tenga una conexión válida a MySQL. Si usas el MySQL del `docker-compose.yml`, puedes usar:

```env
DATABASE_URL="mysql://hvac_user:hvac_password@localhost:3306/inventario_hvac"
JWT_SECRET="cambia_esto_por_una_clave_segura"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

Después ejecuta Prisma y el seed:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
```


Arrancar backend en modo desarrollo:

```bash
npm run dev
```

El backend queda en:

```txt
http://localhost:4000
```

## 4. Configurar el frontend

Abre otra terminal desde la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend normalmente queda en:

```txt
http://localhost:5173
```

Si Vite usa otro puerto, por ejemplo `5174`, actualiza `FRONTEND_URL` en `backend/.env`.

## 5. Usuario inicial

El comando `npm run seed` crea este usuario administrador:

```txt
Email: admin@hvac.com
Password: admin123
```

## Comandos utiles

### Backend

```bash
cd backend
npm run dev
```

```bash
cd backend
npm start
```

```bash
cd backend
npm test
```

```bash
cd backend
npm run test:watch
```

### Frontend

```bash
cd frontend
npm run dev
```

```bash
cd frontend
npm run build
```

```bash
cd frontend
npm run preview
```

### Base de datos

Levantar MySQL:

```bash
docker compose up -d
```

Apagar MySQL:

```bash
docker compose down
```

Ver contenedores:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs -f
```

## Orden recomendado para arrancar todo

Terminal 1:

```bash
cd inventario-Venegas-Corp/inventario-hvac
docker compose up -d
```

Terminal 2:

```bash
cd inventario-Venegas-Corp/inventario-hvac/backend
npm run dev
```

Terminal 3:

```bash
cd inventario-Venegas-Corp/inventario-hvac/frontend
npm run dev
```

