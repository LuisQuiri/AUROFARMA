-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('ACTIVA', 'BLOQUEADA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "EstadoLote" AS ENUM ('ACTIVO', 'AGOTADO', 'BLOQUEADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE_ENTRADA', 'AJUSTE_SALIDA');

-- CreateEnum
CREATE TYPE "TipoOrden" AS ENUM ('WEB', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "EstadoOrden" AS ENUM ('PENDIENTE_PAGO', 'PAGO_EN_REVISION', 'PAGADA', 'LISTA_PARA_RECOJO', 'ENTREGADA', 'CANCELADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'ERROR_PASARELA', 'EN_REVISION');

-- CreateEnum
CREATE TYPE "ResultadoIntentoPago" AS ENUM ('APROBADO', 'RECHAZADO', 'ERROR');

-- CreateEnum
CREATE TYPE "TipoCodigoOperacion" AS ENUM ('RECOJO_PAGO_TIENDA', 'RECOJO_PAGADO', 'REVISION_PAGO');

-- CreateEnum
CREATE TYPE "EstadoCodigoOperacion" AS ENUM ('ACTIVO', 'UTILIZADO', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoComprobante" AS ENUM ('BOLETA', 'FACTURA');

-- CreateEnum
CREATE TYPE "TipoDocumento" AS ENUM ('DNI', 'RUC');

-- CreateEnum
CREATE TYPE "EstadoIncidencia" AS ENUM ('PENDIENTE', 'EN_REVISION', 'RESUELTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "TipoIncidencia" AS ENUM ('ERROR_PAGO', 'CUENTA_BLOQUEADA', 'ACCESO', 'SISTEMA', 'OTRO');

-- CreateEnum
CREATE TYPE "PrioridadIncidencia" AS ENUM ('BAJA', 'MEDIA', 'ALTA');

-- CreateTable
CREATE TABLE "Rol" (
    "idRol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("idRol")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "idUsuario" SERIAL NOT NULL,
    "idRol" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "estadoCuenta" "EstadoCuenta" NOT NULL DEFAULT 'ACTIVA',
    "intentosFallidos" INTEGER NOT NULL DEFAULT 0,
    "debeCambiarPassword" BOOLEAN NOT NULL DEFAULT false,
    "passwordCambiadoEn" TIMESTAMP(3),
    "ultimoAcceso" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("idUsuario")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "idCategoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("idCategoria")
);

-- CreateTable
CREATE TABLE "Producto" (
    "idProducto" SERIAL NOT NULL,
    "idCategoria" INTEGER NOT NULL,
    "codigoProducto" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "laboratorio" TEXT,
    "presentacion" TEXT,
    "precioVenta" DECIMAL(10,2) NOT NULL,
    "stockMinimo" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("idProducto")
);

-- CreateTable
CREATE TABLE "Lote" (
    "idLote" SERIAL NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "codigoLote" TEXT NOT NULL,
    "fechaIngreso" TIMESTAMP(3) NOT NULL,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "cantidadInicial" INTEGER NOT NULL,
    "cantidadDisponible" INTEGER NOT NULL,
    "estado" "EstadoLote" NOT NULL DEFAULT 'ACTIVO',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("idLote")
);

-- CreateTable
CREATE TABLE "MovimientoInventario" (
    "idMovimiento" SERIAL NOT NULL,
    "idLote" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "tipoMovimiento" "TipoMovimientoInventario" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "motivo" TEXT NOT NULL,
    "referencia" TEXT,
    "observacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovimientoInventario_pkey" PRIMARY KEY ("idMovimiento")
);

-- CreateTable
CREATE TABLE "Abastecimiento" (
    "idAbastecimiento" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "codigoScan" TEXT NOT NULL,
    "fechaAbastecimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Abastecimiento_pkey" PRIMARY KEY ("idAbastecimiento")
);

-- CreateTable
CREATE TABLE "DetalleAbastecimiento" (
    "idDetalleAbastecimiento" SERIAL NOT NULL,
    "idAbastecimiento" INTEGER NOT NULL,
    "idLote" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "DetalleAbastecimiento_pkey" PRIMARY KEY ("idDetalleAbastecimiento")
);

-- CreateTable
CREATE TABLE "Orden" (
    "idOrden" SERIAL NOT NULL,
    "idCliente" INTEGER,
    "tipoOrden" "TipoOrden" NOT NULL,
    "estado" "EstadoOrden" NOT NULL DEFAULT 'PENDIENTE_PAGO',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("idOrden")
);

-- CreateTable
CREATE TABLE "DetalleOrden" (
    "idDetalleOrden" SERIAL NOT NULL,
    "idOrden" INTEGER NOT NULL,
    "idProducto" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "DetalleOrden_pkey" PRIMARY KEY ("idDetalleOrden")
);

-- CreateTable
CREATE TABLE "Pago" (
    "idPago" SERIAL NOT NULL,
    "idOrden" INTEGER NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "monto" DECIMAL(10,2) NOT NULL,
    "fechaPago" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("idPago")
);

-- CreateTable
CREATE TABLE "IntentoPago" (
    "idIntentoPago" SERIAL NOT NULL,
    "idPago" INTEGER NOT NULL,
    "resultado" "ResultadoIntentoPago" NOT NULL,
    "codigoRespuesta" TEXT,
    "mensajeRespuesta" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntentoPago_pkey" PRIMARY KEY ("idIntentoPago")
);

-- CreateTable
CREATE TABLE "CodigoOperacion" (
    "idCodigoOperacion" SERIAL NOT NULL,
    "idOrden" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoCodigoOperacion" NOT NULL,
    "estado" "EstadoCodigoOperacion" NOT NULL DEFAULT 'ACTIVO',
    "fechaGeneracion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaExpiracion" TIMESTAMP(3) NOT NULL,
    "fechaUso" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoOperacion_pkey" PRIMARY KEY ("idCodigoOperacion")
);

-- CreateTable
CREATE TABLE "Comprobante" (
    "idComprobante" SERIAL NOT NULL,
    "idOrden" INTEGER NOT NULL,
    "tipoComprobante" "TipoComprobante" NOT NULL,
    "tipoDocumento" "TipoDocumento" NOT NULL,
    "numeroDocumento" TEXT NOT NULL,
    "razonSocialNombre" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DECIMAL(10,2) NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comprobante_pkey" PRIMARY KEY ("idComprobante")
);

-- CreateTable
CREATE TABLE "Entrega" (
    "idEntrega" SERIAL NOT NULL,
    "idOrden" INTEGER NOT NULL,
    "idVendedor" INTEGER NOT NULL,
    "fechaEntrega" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entrega_pkey" PRIMARY KEY ("idEntrega")
);

-- CreateTable
CREATE TABLE "Incidencia" (
    "idIncidencia" SERIAL NOT NULL,
    "idCreador" INTEGER NOT NULL,
    "idOrden" INTEGER,
    "tipoIncidencia" "TipoIncidencia" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoIncidencia" NOT NULL DEFAULT 'PENDIENTE',
    "prioridad" "PrioridadIncidencia" NOT NULL DEFAULT 'MEDIA',
    "solucionFinal" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,
    "resueltoEn" TIMESTAMP(3),

    CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("idIncidencia")
);

-- CreateTable
CREATE TABLE "EvidenciaIncidencia" (
    "idEvidencia" SERIAL NOT NULL,
    "idIncidencia" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "nombreArchivo" TEXT NOT NULL,
    "urlArchivo" TEXT NOT NULL,
    "tipoArchivo" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenciaIncidencia_pkey" PRIMARY KEY ("idEvidencia")
);

-- CreateTable
CREATE TABLE "RespuestaIncidencia" (
    "idRespuesta" SERIAL NOT NULL,
    "idIncidencia" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RespuestaIncidencia_pkey" PRIMARY KEY ("idRespuesta")
);

-- CreateTable
CREATE TABLE "HistorialIncidencia" (
    "idHistorial" SERIAL NOT NULL,
    "idIncidencia" INTEGER NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "estadoAnterior" "EstadoIncidencia",
    "estadoNuevo" "EstadoIncidencia" NOT NULL,
    "comentario" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistorialIncidencia_pkey" PRIMARY KEY ("idHistorial")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- CreateIndex
CREATE INDEX "Usuario_idRol_idx" ON "Usuario"("idRol");

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nombre_key" ON "Categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_codigoProducto_key" ON "Producto"("codigoProducto");

-- CreateIndex
CREATE INDEX "Producto_idCategoria_idx" ON "Producto"("idCategoria");

-- CreateIndex
CREATE INDEX "Producto_nombre_idx" ON "Producto"("nombre");

-- CreateIndex
CREATE INDEX "Lote_idProducto_idx" ON "Lote"("idProducto");

-- CreateIndex
CREATE INDEX "Lote_fechaVencimiento_idx" ON "Lote"("fechaVencimiento");

-- CreateIndex
CREATE UNIQUE INDEX "Lote_idProducto_codigoLote_key" ON "Lote"("idProducto", "codigoLote");

-- CreateIndex
CREATE INDEX "MovimientoInventario_idLote_idx" ON "MovimientoInventario"("idLote");

-- CreateIndex
CREATE INDEX "MovimientoInventario_idUsuario_idx" ON "MovimientoInventario"("idUsuario");

-- CreateIndex
CREATE INDEX "Abastecimiento_idUsuario_idx" ON "Abastecimiento"("idUsuario");

-- CreateIndex
CREATE INDEX "DetalleAbastecimiento_idAbastecimiento_idx" ON "DetalleAbastecimiento"("idAbastecimiento");

-- CreateIndex
CREATE INDEX "DetalleAbastecimiento_idLote_idx" ON "DetalleAbastecimiento"("idLote");

-- CreateIndex
CREATE INDEX "Orden_idCliente_idx" ON "Orden"("idCliente");

-- CreateIndex
CREATE INDEX "Orden_estado_idx" ON "Orden"("estado");

-- CreateIndex
CREATE INDEX "DetalleOrden_idOrden_idx" ON "DetalleOrden"("idOrden");

-- CreateIndex
CREATE INDEX "DetalleOrden_idProducto_idx" ON "DetalleOrden"("idProducto");

-- CreateIndex
CREATE INDEX "Pago_idOrden_idx" ON "Pago"("idOrden");

-- CreateIndex
CREATE INDEX "IntentoPago_idPago_idx" ON "IntentoPago"("idPago");

-- CreateIndex
CREATE UNIQUE INDEX "CodigoOperacion_codigo_key" ON "CodigoOperacion"("codigo");

-- CreateIndex
CREATE INDEX "CodigoOperacion_idOrden_idx" ON "CodigoOperacion"("idOrden");

-- CreateIndex
CREATE INDEX "CodigoOperacion_estado_idx" ON "CodigoOperacion"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_idOrden_key" ON "Comprobante"("idOrden");

-- CreateIndex
CREATE UNIQUE INDEX "Comprobante_serie_numero_key" ON "Comprobante"("serie", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "Entrega_idOrden_key" ON "Entrega"("idOrden");

-- CreateIndex
CREATE INDEX "Entrega_idVendedor_idx" ON "Entrega"("idVendedor");

-- CreateIndex
CREATE INDEX "Incidencia_idCreador_idx" ON "Incidencia"("idCreador");

-- CreateIndex
CREATE INDEX "Incidencia_idOrden_idx" ON "Incidencia"("idOrden");

-- CreateIndex
CREATE INDEX "Incidencia_estado_idx" ON "Incidencia"("estado");

-- CreateIndex
CREATE INDEX "Incidencia_tipoIncidencia_idx" ON "Incidencia"("tipoIncidencia");

-- CreateIndex
CREATE INDEX "EvidenciaIncidencia_idIncidencia_idx" ON "EvidenciaIncidencia"("idIncidencia");

-- CreateIndex
CREATE INDEX "EvidenciaIncidencia_idUsuario_idx" ON "EvidenciaIncidencia"("idUsuario");

-- CreateIndex
CREATE INDEX "RespuestaIncidencia_idIncidencia_idx" ON "RespuestaIncidencia"("idIncidencia");

-- CreateIndex
CREATE INDEX "RespuestaIncidencia_idUsuario_idx" ON "RespuestaIncidencia"("idUsuario");

-- CreateIndex
CREATE INDEX "HistorialIncidencia_idIncidencia_idx" ON "HistorialIncidencia"("idIncidencia");

-- CreateIndex
CREATE INDEX "HistorialIncidencia_idUsuario_idx" ON "HistorialIncidencia"("idUsuario");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_idRol_fkey" FOREIGN KEY ("idRol") REFERENCES "Rol"("idRol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("idCategoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lote" ADD CONSTRAINT "Lote_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "Lote"("idLote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoInventario" ADD CONSTRAINT "MovimientoInventario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAbastecimiento" ADD CONSTRAINT "DetalleAbastecimiento_idAbastecimiento_fkey" FOREIGN KEY ("idAbastecimiento") REFERENCES "Abastecimiento"("idAbastecimiento") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleAbastecimiento" ADD CONSTRAINT "DetalleAbastecimiento_idLote_fkey" FOREIGN KEY ("idLote") REFERENCES "Lote"("idLote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orden" ADD CONSTRAINT "Orden_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Usuario"("idUsuario") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrden" ADD CONSTRAINT "DetalleOrden_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleOrden" ADD CONSTRAINT "DetalleOrden_idProducto_fkey" FOREIGN KEY ("idProducto") REFERENCES "Producto"("idProducto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntentoPago" ADD CONSTRAINT "IntentoPago_idPago_fkey" FOREIGN KEY ("idPago") REFERENCES "Pago"("idPago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodigoOperacion" ADD CONSTRAINT "CodigoOperacion_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comprobante" ADD CONSTRAINT "Comprobante_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entrega" ADD CONSTRAINT "Entrega_idVendedor_fkey" FOREIGN KEY ("idVendedor") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_idCreador_fkey" FOREIGN KEY ("idCreador") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_idOrden_fkey" FOREIGN KEY ("idOrden") REFERENCES "Orden"("idOrden") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenciaIncidencia" ADD CONSTRAINT "EvidenciaIncidencia_idIncidencia_fkey" FOREIGN KEY ("idIncidencia") REFERENCES "Incidencia"("idIncidencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenciaIncidencia" ADD CONSTRAINT "EvidenciaIncidencia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaIncidencia" ADD CONSTRAINT "RespuestaIncidencia_idIncidencia_fkey" FOREIGN KEY ("idIncidencia") REFERENCES "Incidencia"("idIncidencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RespuestaIncidencia" ADD CONSTRAINT "RespuestaIncidencia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialIncidencia" ADD CONSTRAINT "HistorialIncidencia_idIncidencia_fkey" FOREIGN KEY ("idIncidencia") REFERENCES "Incidencia"("idIncidencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistorialIncidencia" ADD CONSTRAINT "HistorialIncidencia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("idUsuario") ON DELETE RESTRICT ON UPDATE CASCADE;
