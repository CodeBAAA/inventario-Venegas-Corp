# Inventario HVAC

Aplicación web para inventariar herramientas de un técnico de aire acondicionado.

## Tecnologías

- Frontend: React + Vite
- Backend: Node.js + Express
- Patrón: MVC
- Base de datos: MySQL con Prisma ORM
- Login: JWT + auto login con localStorage
- PDF: PDFKit
- Seguridad: bcryptjs, helmet, cors

## Estructura

```txt
inventario-hvac/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── utils/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── context/
        ├── pages/
        ├── components/
        ├── App.jsx
        └── main.jsx
```

## Cómo ejecutar

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edita el archivo `.env`:

```env
DATABASE_URL="mysql://usuario:password@localhost:3306/inventario_hvac"
JWT_SECRET="cambia_esto_por_una_clave_segura"
PORT=4000
```

Luego ejecuta:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

La app abrirá normalmente en:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:4000
```

## Usuario inicial

El seed crea este usuario administrador:

```txt
Email: admin@hvac.com
Password: admin123
```

Cambia esa contraseña después.
