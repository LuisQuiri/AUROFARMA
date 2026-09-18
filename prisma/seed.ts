import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // =========================
  // 1. ROLES
  // =========================

  const roles = [
    { nombre: "CLIENTE", descripcion: "Cliente del sistema" },
    { nombre: "VENDEDOR", descripcion: "Personal encargado de ventas" },
    { nombre: "ALMACENERO", descripcion: "Personal encargado del inventario" },
    { nombre: "ADMINISTRADOR", descripcion: "Administrador del sistema" },
    { nombre: "TI", descripcion: "Equipo de soporte tecnológico" },
  ];

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: { nombre: rol.nombre },
      update: {},
      create: rol,
    });
  }

  // =========================
  // 2. USUARIOS BASE
  // =========================

  const rolAdministrador = await prisma.rol.findUnique({
    where: { nombre: "ADMINISTRADOR" },
  });

  const rolAlmacenero = await prisma.rol.findUnique({
    where: { nombre: "ALMACENERO" },
  });

  if (!rolAdministrador || !rolAlmacenero) {
    throw new Error("No se encontraron los roles necesarios.");
  }

  const passwordHash = await bcrypt.hash("AuroFarma2026!", 10);

  await prisma.usuario.upsert({
    where: { correo: "admin@aurofarma.com" },
    update: {},
    create: {
      idRol: rolAdministrador.idRol,
      nombre: "Administrador",
      apellido: "AuroFarma",
      correo: "admin@aurofarma.com",
      passwordHash,
      estadoCuenta: "ACTIVA",
      intentosFallidos: 0,
      debeCambiarPassword: true,
    },
  });

  const almacenero = await prisma.usuario.upsert({
    where: { correo: "almacen@aurofarma.com" },
    update: {},
    create: {
      idRol: rolAlmacenero.idRol,
      nombre: "Almacenero",
      apellido: "AuroFarma",
      correo: "almacen@aurofarma.com",
      passwordHash,
      estadoCuenta: "ACTIVA",
      intentosFallidos: 0,
      debeCambiarPassword: true,
    },
  });

  // =========================
  // 3. CATEGORÍA
  // =========================

  const categoria = await prisma.categoria.upsert({
    where: { nombre: "Medicamentos" },
    update: {},
    create: {
      nombre: "Medicamentos",
      descripcion: "Medicamentos comercializados por AuroFarma",
    },
  });

  // =========================
  // 4. PRODUCTOS DE DEMOSTRACIÓN
  // =========================

  const productosBase = [
    {
      codigoProducto: "MED-001",
      nombre: "Paracetamol 500 mg",
      laboratorio: "Genfar",
      presentacion: "Tabletas",
      precioVenta: 2.5,
      stockMinimo: 20,
    },
    {
      codigoProducto: "MED-002",
      nombre: "Ibuprofeno 400 mg",
      laboratorio: "Portugal",
      presentacion: "Tabletas",
      precioVenta: 3.5,
      stockMinimo: 20,
    },
    {
      codigoProducto: "MED-003",
      nombre: "Omeprazol 20 mg",
      laboratorio: "Genfar",
      presentacion: "Cápsulas",
      precioVenta: 4.0,
      stockMinimo: 15,
    },
    {
      codigoProducto: "MED-004",
      nombre: "Amoxicilina 500 mg",
      laboratorio: "Portugal",
      presentacion: "Cápsulas",
      precioVenta: 8.5,
      stockMinimo: 15,
    },
    {
      codigoProducto: "MED-005",
      nombre: "Loratadina 10 mg",
      laboratorio: "Medifarma",
      presentacion: "Tabletas",
      precioVenta: 3.0,
      stockMinimo: 15,
    },
    {
      codigoProducto: "MED-006",
      nombre: "Azitromicina 500 mg",
      laboratorio: "Genfar",
      presentacion: "Tabletas",
      precioVenta: 10.0,
      stockMinimo: 10,
    },
    {
      codigoProducto: "MED-007",
      nombre: "Diclofenaco 50 mg",
      laboratorio: "Portugal",
      presentacion: "Tabletas",
      precioVenta: 4.5,
      stockMinimo: 15,
    },
    {
      codigoProducto: "MED-008",
      nombre: "Metformina 850 mg",
      laboratorio: "Medifarma",
      presentacion: "Tabletas",
      precioVenta: 6.0,
      stockMinimo: 20,
    },
  ];

  const productos = new Map<string, number>();

  for (const producto of productosBase) {
    const registro = await prisma.producto.upsert({
      where: {
        codigoProducto: producto.codigoProducto,
      },
      update: {
        nombre: producto.nombre,
        laboratorio: producto.laboratorio,
        presentacion: producto.presentacion,
        precioVenta: producto.precioVenta,
        stockMinimo: producto.stockMinimo,
        activo: true,
      },
      create: {
        idCategoria: categoria.idCategoria,
        codigoProducto: producto.codigoProducto,
        nombre: producto.nombre,
        laboratorio: producto.laboratorio,
        presentacion: producto.presentacion,
        precioVenta: producto.precioVenta,
        stockMinimo: producto.stockMinimo,
      },
    });

    productos.set(producto.codigoProducto, registro.idProducto);
  }

  // =========================
  // 5. SEIS CAJAS DE ABASTECIMIENTO
  // =========================

  const cajas = [
    {
      codigo: "CAJA-AURO-001",
      productos: [
        ["MED-001", "PAR-2601", "2027-06-30"],
        ["MED-002", "IBU-2601", "2027-08-31"],
        ["MED-003", "OME-2601", "2027-11-30"],
        ["MED-004", "AMO-2601", "2027-05-31"],
      ],
    },
    {
      codigo: "CAJA-AURO-002",
      productos: [
        ["MED-005", "LOR-2601", "2027-09-30"],
        ["MED-006", "AZI-2601", "2027-07-31"],
        ["MED-007", "DIC-2601", "2028-01-31"],
        ["MED-008", "MET-2601", "2027-12-31"],
      ],
    },
    {
      codigo: "CAJA-AURO-003",
      productos: [
        ["MED-001", "PAR-2602", "2028-02-29"],
        ["MED-003", "OME-2602", "2028-04-30"],
        ["MED-005", "LOR-2602", "2028-03-31"],
        ["MED-007", "DIC-2602", "2028-05-31"],
      ],
    },
    {
      codigo: "CAJA-AURO-004",
      productos: [
        ["MED-002", "IBU-2602", "2028-06-30"],
        ["MED-004", "AMO-2602", "2027-10-31"],
        ["MED-006", "AZI-2602", "2028-01-31"],
        ["MED-008", "MET-2602", "2028-07-31"],
      ],
    },
    {
      codigo: "CAJA-AURO-005",
      productos: [
        ["MED-001", "PAR-2603", "2028-08-31"],
        ["MED-002", "IBU-2603", "2028-09-30"],
        ["MED-005", "LOR-2603", "2028-06-30"],
        ["MED-008", "MET-2603", "2028-10-31"],
      ],
    },
    {
      codigo: "CAJA-AURO-006",
      productos: [
        ["MED-003", "OME-2603", "2028-11-30"],
        ["MED-004", "AMO-2603", "2028-03-31"],
        ["MED-006", "AZI-2603", "2028-07-31"],
        ["MED-007", "DIC-2603", "2028-12-31"],
      ],
    },
  ];

  for (const caja of cajas) {
    const abastecimiento = await prisma.abastecimiento.upsert({
      where: {
        codigoScan: caja.codigo,
      },
      update: {
        idUsuario: almacenero.idUsuario,
        procesado: false,
        procesadoEn: null,
        observacion: "Caja preparada para demostración académica",
      },
      create: {
        idUsuario: almacenero.idUsuario,
        codigoScan: caja.codigo,
        procesado: false,
        observacion: "Caja preparada para demostración académica",
      },
    });

    // Evita duplicar detalles si ejecutamos el seed otra vez.
    await prisma.detalleAbastecimiento.deleteMany({
      where: {
        idAbastecimiento: abastecimiento.idAbastecimiento,
      },
    });

    for (const item of caja.productos) {
      const [codigoProducto, codigoLote, vencimiento] = item;

      const idProducto = productos.get(codigoProducto);

      if (!idProducto) {
        throw new Error(`Producto ${codigoProducto} no encontrado.`);
      }

      const lote = await prisma.lote.upsert({
        where: {
          idProducto_codigoLote: {
            idProducto,
            codigoLote,
          },
        },
        update: {
          fechaIngreso: new Date(),
          fechaVencimiento: new Date(`${vencimiento}T00:00:00.000Z`),
          cantidadInicial: 30,
          cantidadDisponible: 0,
          estado: "ACTIVO",
        },
        create: {
          idProducto,
          codigoLote,
          fechaIngreso: new Date(),
          fechaVencimiento: new Date(`${vencimiento}T00:00:00.000Z`),
          cantidadInicial: 30,
          cantidadDisponible: 0,
          estado: "ACTIVO",
        },
      });

      await prisma.detalleAbastecimiento.create({
        data: {
          idAbastecimiento: abastecimiento.idAbastecimiento,
          idLote: lote.idLote,
          cantidad: 30,
        },
      });
    }
  }

  console.log("Datos iniciales creados correctamente.");
  console.log("6 cajas de abastecimiento preparadas correctamente.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });