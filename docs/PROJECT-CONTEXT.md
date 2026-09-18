# AuroFarma — Project Context

## Estado actual

FASE 0 — Preparación del entorno

Estado: En proceso de cierre.

## Ruta del proyecto

C:\xampp\htdocs\aurofarma

## Stack configurado

- Next.js 16.3.4
- TypeScript 5.9.3
- Node.js 24.21.0
- npm 11.19.0
- PostgreSQL 18.6
- Prisma 7.10.0
- @prisma/client 7.10.0
- Tailwind CSS v4
- shadcn/ui
- Git

## Base de datos

Nombre:

aurofarma_db

Motor:

PostgreSQL

Servidor local:

localhost

Puerto:

5432

La conexión desde Prisma hacia PostgreSQL ya fue validada correctamente.

Actualmente la base de datos está vacía y todavía no se han creado tablas ni migraciones.

## Prisma

Prisma está inicializado.

Archivos principales:

- prisma/schema.prisma
- prisma7.config.ts
- .env

El archivo .env contiene DATABASE_URL y está excluido de Git mediante .gitignore.

Todavía NO existe un schema definitivo de Prisma.

## Estructura inicial relevante

aurofarma/
├── app/
├── components/
│   └── ui/
├── docs/
│   └── PROJECT-CONTEXT.md
├── lib/
├── prisma/
│   └── schema.prisma
├── public/
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── package-lock.json
├── prisma7.config.ts
├── tsconfig.json
└── README.md

## shadcn/ui

shadcn/ui fue inicializado con:

- Component library: Base UI
- Preset: Nova
- Icons: Lucide
- Font: Geist

Archivos creados inicialmente:

- components/ui/button.tsx
- lib/utils.ts
- components.json

Todavía no se han agregado otros componentes.

## Git

Rama principal:

main

Commits realizados:

1. chore: initialize Next.js project
2. chore: configure shadcn ui
3. chore: configure Prisma and PostgreSQL

## Decisiones funcionales ya aprobadas

Roles:

- Cliente
- Vendedor
- Almacenero
- Administrador
- Equipo de TI

Contraseñas de trabajadores:

- Vigencia: 7 días
- Advertencia desde el día 4
- 3 intentos fallidos bloquean la cuenta
- Solo TI puede desbloquear una cuenta
- Contraseña temporal obliga cambio en el primer login

Venta presencial:

- No genera código de recojo
- No se relaciona con una cuenta de cliente
- DNI/RUC se registra únicamente en la operación/comprobante

Compra web:

- El carrito no reserva ni descuenta stock
- La orden tampoco reserva stock
- El stock se vuelve a validar antes de confirmar la venta/entrega
- El stock se descuenta definitivamente al confirmar/entregar

Códigos:

- Pago en tienda: código de recojo con vigencia de 1 hora
- Tarjeta aprobada: código de recojo con vigencia de 1 hora
- Error de pasarela: código especial de atención/revisión

Inventario:

- Manejo por lotes
- Próximo a vencer: 30 días
- Stock bajo: umbral general
- Toda entrada y salida debe generar movimiento de inventario
- No modificar stock directamente sin trazabilidad
- Se recomienda FEFO para seleccionar primero el lote que vence antes

Pagos:

- Pago en tienda
- Tarjeta simulada
- Error de pasarela no marca automáticamente la orden como pagada
- Los intentos de pago deben registrarse

Incidencias:

Estados:

- PENDIENTE
- EN_REVISION
- RESUELTA
- CERRADA

TI gestiona las incidencias y determina la resolución de problemas de pago.

## Entidades conceptuales principales

- Rol
- Usuario
- Categoria
- Producto
- Lote
- MovimientoInventario
- Abastecimiento
- DetalleAbastecimiento
- Orden
- DetalleOrden
- Pago
- IntentoPago
- CodigoOperacion
- Comprobante
- Entrega
- Incidencia
- EvidenciaIncidencia
- RespuestaIncidencia
- HistorialIncidencia

Estas entidades todavía no han sido implementadas en Prisma.

## Tecnologías que todavía NO se han instalado/configurado

- Auth.js
- Zod
- React Hook Form
- Recharts
- Cloudinary

Se instalarán únicamente cuando lleguemos a los módulos que las necesiten.

## Observaciones técnicas

PowerShell bloqueaba npm.ps1 por ExecutionPolicy.

Por el momento se utiliza:

npm.cmd

en lugar de:

npm

cuando sea necesario.

Node.js y PostgreSQL tuvieron que añadirse manualmente al PATH de Windows.

## Próximo objetivo

Cerrar formalmente la FASE 0.

Después comenzar la siguiente fase en un chat nuevo utilizando este archivo como contexto.

Antes de implementar funcionalidades se deberá continuar con el diseño definitivo de base de datos, relaciones, PK, FK, cardinalidades y schema de Prisma.
