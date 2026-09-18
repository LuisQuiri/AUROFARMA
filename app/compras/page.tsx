import { auth } from "@/auth";
import SelectorProductos from "@/components/compras/SelectorProductos";
import { prisma } from "@/lib/prisma";

export default async function ComprasPage() {
  const session = await auth();

  const usuarioSesion = session?.user as
    | {
      rol?: string;
    }
    | undefined;

  const rol = usuarioSesion?.rol ?? null;

  const productosDb = await prisma.producto.findMany({
    where: {
      activo: true,
    },
    include: {
      lotes: {
        where: {
          estado: "ACTIVO",
        },
      },
    },
    orderBy: {
      nombre: "asc",
    },
  });

  const productos = productosDb.map((producto) => {
    const stock = producto.lotes.reduce(
      (total, lote) => total + lote.cantidadDisponible,
      0
    );

    return {
      idProducto: producto.idProducto,
      codigoProducto: producto.codigoProducto,
      nombre: producto.nombre,
      laboratorio: producto.laboratorio,
      presentacion: producto.presentacion,
      precioVenta: Number(producto.precioVenta),
      stock,
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Compras</h1>

      <p className="mt-2 text-sm text-gray-600">
        Busca medicamentos y selecciona las unidades que deseas comprar.
      </p>

      <SelectorProductos productos={productos} rol={rol} />
    </div>
  );
}