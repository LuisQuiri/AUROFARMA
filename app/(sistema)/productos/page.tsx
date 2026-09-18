import { prisma } from "@/lib/prisma";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ buscar?: string }>;
}) {
  const params = await searchParams;

  const buscar = params.buscar?.trim() ?? "";

  const productos = await prisma.producto.findMany({
    where: {
      activo: true,
      ...(buscar
        ? {
            OR: [
              {
                nombre: {
                  contains: buscar,
                  mode: "insensitive",
                },
              },
              {
                codigoProducto: {
                  contains: buscar,
                  mode: "insensitive",
                },
              },
              {
                laboratorio: {
                  contains: buscar,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    include: {
      categoria: true,
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

  return (
    <div>
      <h1 className="text-2xl font-semibold">Productos</h1>

      <form method="GET" className="mt-6 flex gap-3">
        <input
          type="text"
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por nombre, código o laboratorio"
          className="w-full max-w-xl rounded-md border px-3 py-2"
        />

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Buscar
        </button>
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-3 py-2 text-left">Código</th>
              <th className="border px-3 py-2 text-left">Producto</th>
              <th className="border px-3 py-2 text-left">Categoría</th>
              <th className="border px-3 py-2 text-left">Laboratorio</th>
              <th className="border px-3 py-2 text-left">Presentación</th>
              <th className="border px-3 py-2 text-left">Precio</th>
              <th className="border px-3 py-2 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto) => {
              const stockTotal = producto.lotes.reduce(
                (total, lote) => total + lote.cantidadDisponible,
                0
              );

              return (
                <tr key={producto.idProducto}>
                  <td className="border px-3 py-2">
                    {producto.codigoProducto}
                  </td>

                  <td className="border px-3 py-2">
                    {producto.nombre}
                  </td>

                  <td className="border px-3 py-2">
                    {producto.categoria.nombre}
                  </td>

                  <td className="border px-3 py-2">
                    {producto.laboratorio ?? "-"}
                  </td>

                  <td className="border px-3 py-2">
                    {producto.presentacion ?? "-"}
                  </td>

                  <td className="border px-3 py-2">
                    S/ {Number(producto.precioVenta).toFixed(2)}
                  </td>

                  <td className="border px-3 py-2">
                    {stockTotal}
                  </td>
                </tr>
              );
            })}

            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="border px-3 py-6 text-center"
                >
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}