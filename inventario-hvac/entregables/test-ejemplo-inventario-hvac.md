# Test de ejemplo - Sistema de Inventario HVAC

## Caso de prueba

Validar que el sistema detecta herramientas con bajo stock y muestra datos utiles para la toma de decisiones.

## Objetivo

Comprobar que el modulo de inventario y reportes permite identificar herramientas disponibles, herramientas danadas/perdidas y herramientas que necesitan reposicion.

## Datos de prueba

| Herramienta | Categoria | Cantidad actual | Cantidad minima | Estado |
|---|---|---:|---:|---|
| Manometro digital | Medicion | 1 | 2 | DISPONIBLE |
| Bomba de vacio | Equipos | 3 | 1 | DISPONIBLE |
| Taladro inalambrico | Electricas | 0 | 1 | PERDIDA |
| Pinza amperimetrica | Medicion | 1 | 1 | DANADA |

## Pasos

1. Iniciar sesion en el sistema con un usuario valido.
2. Ir al modulo de herramientas.
3. Registrar las herramientas indicadas en los datos de prueba.
4. Ir al dashboard.
5. Revisar los indicadores generales del inventario.
6. Verificar el listado o conteo de herramientas con bajo stock.
7. Descargar el reporte PDF de inventario.

## Resultado esperado

El sistema debe mostrar:

| Indicador | Resultado esperado |
|---|---:|
| Total de herramientas registradas | 4 |
| Herramientas disponibles | 2 |
| Herramientas con bajo stock | 2 |
| Herramientas danadas | 1 |
| Herramientas perdidas | 1 |

Las herramientas que deben aparecer como bajo stock son:

| Herramienta | Motivo |
|---|---|
| Manometro digital | Cantidad actual 1 menor que cantidad minima 2 |
| Taladro inalambrico | Cantidad actual 0 menor que cantidad minima 1 |

## Criterio de aceptacion

La prueba se considera exitosa si el dashboard y el reporte reflejan correctamente las cantidades, estados y alertas de bajo stock.

## Decision que permite tomar

Con base en los resultados, el encargado puede decidir:

- Comprar al menos 1 manometro digital.
- Reponer el taladro inalambrico perdido.
- Revisar o reparar la pinza amperimetrica danada.
- Mantener la bomba de vacio sin compra inmediata porque supera el minimo requerido.

