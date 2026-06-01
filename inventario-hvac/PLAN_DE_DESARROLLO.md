# Plan de desarrollo paso a paso

## Fase 1: Base del proyecto

Objetivo: tener frontend, backend, login y base de datos funcionando.

Incluye:

- Crear backend Node.js con Express.
- Aplicar MVC.
- Configurar Prisma con MySQL.
- Crear login con JWT.
- Crear auto login usando localStorage en frontend.
- Crear usuario administrador inicial.

## Fase 2: Inventario

Objetivo: poder registrar y consultar herramientas.

Incluye:

- Crear categorías.
- Crear herramientas.
- Generar ID único automático tipo TL-0001.
- Guardar cantidad actual.
- Guardar cantidad mínima.
- Detectar bajo stock.
- Filtrar por nombre, categoría, estado y ubicación.

## Fase 3: Lista de compras

Objetivo: saber qué herramientas hacen falta.

Incluye:

- Crear listas de compra.
- Agregar herramientas manualmente.
- Marcar prioridad.
- Marcar comprado o pendiente.
- Generar PDF.

## Fase 4: Panel administrativo

Objetivo: que el dueño vea reportes y usuarios.

Incluye:

- Dashboard con totales.
- Usuarios registrados.
- Reporte por categoría.
- Reporte de herramientas disponibles.
- Reporte de herramientas dañadas, perdidas o bajo stock.

## Fase 5: Mejoras futuras

- Subida de imágenes.
- Historial de movimientos.
- Asignar herramientas a empleados.
- Código QR por herramienta.
- Exportar Excel.
- Notificaciones por bajo stock.
- Modo oscuro.
- App móvil con React Native si se desea.
