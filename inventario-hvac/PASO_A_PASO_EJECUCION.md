# Paso a paso de ejecucion del proyecto

Este documento explica que se hizo para arrancar el proyecto `inventario-hvac`, desde que carpeta se ejecuto cada comando y que resultado tuvo.

## 1. Ubicacion del proyecto

Primero se trabajo desde la carpeta principal del proyecto:

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac
```

Esa carpeta contiene:

```txt
backend/
frontend/
docker-compose.yml
README.md
COMANDOS_PROYECTO.md
```

## 2. Revision inicial

Se reviso si el backend y el frontend ya tenian las dependencias instaladas.

### Backend

Desde la raiz del proyecto:

```bash
ls backend/node_modules
```

Resultado:

```txt
El backend ya tenia node_modules instalado.
```

Eso significa que no fue necesario ejecutar:

```bash
cd backend
npm install
```

### Frontend

Desde la raiz del proyecto:

```bash
ls frontend/node_modules
```

Resultado:

```txt
El frontend ya tenia node_modules instalado.
```

Eso significa que no fue necesario ejecutar:

```bash
cd frontend
npm install
```

## 3. Revision del archivo .env del backend

Se reviso la configuracion del backend:

```bash
sed -n '1,120p' backend/.env
```

El archivo tenia esta configuracion:

```env
DATABASE_URL="mysql://root:rootpassword@localhost:3306/inventario_hvac"
JWT_SECRET="reemplaza_esto_con_un_secreto_largo_y_aleatorio"
PORT=4000
FRONTEND_URL="http://localhost:5173"
```

Esto indica que:

- El backend usa MySQL en `localhost:3306`.
- El backend corre en el puerto `4000`.
- El frontend esperado esta en `http://localhost:5173`.

## 4. Arranque de MySQL con Docker

Primero se reviso el estado de Docker:

```bash
docker compose ps
```

Al inicio Docker no estaba disponible. Se abrio Docker Desktop y luego se ejecuto:

```bash
docker compose up -d
```

Ese comando se ejecuto desde:

```txt
/Users/mac/Documents/Proyectos utp/inventario-Venegas-Corp/inventario-hvac
```

Porque ahi esta el archivo:

```txt
docker-compose.yml
```

Resultado:

```txt
Container hvac_mysql Running
```

Despues se verifico el contenedor:

```bash
docker compose ps
```

Resultado importante:

```txt
NAME         IMAGE       SERVICE   STATUS            PORTS
hvac_mysql   mysql:8.0   db        Up                0.0.0.0:3306->3306/tcp
```

Eso significa que MySQL quedo corriendo en:

```txt
localhost:3306
```

## 5. Generacion de Prisma Client

Luego se entro al backend:

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/backend
```

Se ejecuto:

```bash
npm run prisma:generate
```

Resultado:

```txt
Generated Prisma Client
```

Esto genera el cliente de Prisma que el backend usa para conectarse a la base de datos.

## 6. Migraciones de la base de datos

Desde la carpeta del backend:

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/backend
```

Se ejecuto:

```bash
npm run prisma:migrate -- --name init
```

La primera vez fallo porque MySQL todavia no estaba aceptando conexiones desde el entorno.

Luego se revisaron los logs de MySQL:

```bash
docker compose logs --tail 80 db
```

En los logs aparecio:

```txt
ready for connections
```

Eso confirmo que MySQL ya estaba listo.

Se volvio a ejecutar la migracion:

```bash
npm run prisma:migrate -- --name init
```

Resultado:

```txt
Already in sync, no schema change or pending migration was found.
Generated Prisma Client
```

Eso significa que la estructura de la base de datos ya estaba creada y actualizada.

## 7. Seed de datos iniciales

Desde la carpeta del backend:

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/backend
```

Se ejecuto:

```bash
npm run seed
```

Resultado:

```txt
Seed completado. Usuario: admin@hvac.com / admin123
```

Eso creo o verifico el usuario inicial para entrar al sistema.

Usuario:

```txt
Email: admin@hvac.com
Password: admin123
```

## 8. Arranque del backend

Desde la carpeta del backend:

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/backend
```

Se intento arrancar el backend con:

```bash
npm run dev
```

El resultado fue:

```txt
Error: listen EADDRINUSE: address already in use :::4000
```

Eso significa que el puerto `4000` ya estaba ocupado.

Se reviso que proceso estaba usando el puerto:

```bash
lsof -nP -iTCP:4000 -sTCP:LISTEN
```

Resultado:

```txt
node estaba escuchando en el puerto 4000
```

Eso indica que el backend ya estaba corriendo antes de intentar arrancarlo otra vez.

Se probo el backend con:

```bash
curl -i http://localhost:4000
```

Respuesta:

```txt
HTTP/1.1 200 OK
{"message":"API Inventario HVAC funcionando correctamente"}
```

Por lo tanto, el backend quedo activo en:

```txt
http://localhost:4000
```

## 9. Verificacion del frontend

Se reviso si el puerto del frontend estaba ocupado:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
```

Resultado:

```txt
node estaba escuchando en el puerto 5173
```

Eso indica que el frontend ya estaba corriendo.

Se probo el frontend con:

```bash
curl -I http://localhost:5173
```

Respuesta:

```txt
HTTP/1.1 200 OK
```

Por lo tanto, el frontend quedo activo en:

```txt
http://localhost:5173
```

## 10. Prueba de login

Se hizo una prueba de login contra el backend:

```bash
curl -s -i -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@hvac.com","password":"admin123"}'
```

Respuesta:

```txt
HTTP/1.1 200 OK
```

Tambien devolvio el usuario:

```json
{
  "id": 1,
  "name": "Administrador HVAC",
  "email": "admin@hvac.com",
  "role": "ADMIN"
}
```

Eso confirma que:

- La base de datos esta funcionando.
- El backend se conecta bien a MySQL.
- El usuario inicial existe.
- El login funciona correctamente.

## Estado final

El proyecto quedo corriendo asi:

```txt
Base de datos MySQL: localhost:3306
Backend API:          http://localhost:4000
Frontend React:       http://localhost:5173
```

Para usar la aplicacion, abrir en el navegador:

```txt
http://localhost:5173
```

Credenciales:

```txt
Email: admin@hvac.com
Password: admin123
```

## Comandos principales para la proxima vez

### Terminal 1: base de datos

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac
docker compose up -d
```

### Terminal 2: backend

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/backend
npm run dev
```

### Terminal 3: frontend

```bash
cd /Users/mac/Documents/Proyectos\ utp/inventario-Venegas-Corp/inventario-hvac/frontend
npm run dev
```
