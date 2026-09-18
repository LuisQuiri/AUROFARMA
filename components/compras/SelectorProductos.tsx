"use client";

import { useEffect, useMemo, useState } from "react";

type ProductoCompra = {
  idProducto: number;
  codigoProducto: string;
  nombre: string;
  laboratorio: string | null;
  presentacion: string | null;
  precioVenta: number;
  stock: number;
};

type ProductoSeleccionado = ProductoCompra & {
  cantidad: number;
};

export default function SelectorProductos({
  productos,
  rol,
}: {
  productos: ProductoCompra[];
  rol: string | null;
}) {
  const [buscar, setBuscar] = useState("");
  const [seleccionados, setSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [carritoCargado, setCarritoCargado] = useState(false);
  useEffect(() => {
    try {
      const carritoGuardado = localStorage.getItem("aurofarma_carrito");

      if (carritoGuardado) {
        const datos = JSON.parse(carritoGuardado) as ProductoSeleccionado[];

        const productosValidos = datos
          .map((item) => {
            const productoActual = productos.find(
              (producto) => producto.idProducto === item.idProducto
            );

            if (!productoActual || productoActual.stock <= 0) {
              return null;
            }

            return {
              ...productoActual,
              cantidad: Math.min(item.cantidad, productoActual.stock),
            };
          })
          .filter(
            (item): item is ProductoSeleccionado =>
              item !== null && item.cantidad > 0
          );

        setSeleccionados(productosValidos);
      }
    } catch {
      localStorage.removeItem("aurofarma_carrito");
    } finally {
      setCarritoCargado(true);
    }
  }, [productos]);

  useEffect(() => {
    if (!carritoCargado) {
      return;
    }

    localStorage.setItem(
      "aurofarma_carrito",
      JSON.stringify(seleccionados)
    );
  }, [seleccionados, carritoCargado]);
  const productosFiltrados = useMemo(() => {
    const texto = buscar.toLowerCase().trim();

    if (!texto) {
      return productos;
    }

    return productos.filter((producto) =>
      [
        producto.nombre,
        producto.codigoProducto,
        producto.laboratorio ?? "",
      ].some((valor) => valor.toLowerCase().includes(texto))
    );
  }, [buscar, productos]);

  function agregarProducto(producto: ProductoCompra) {
    setSeleccionados((actuales) => {
      const existente = actuales.find(
        (item) => item.idProducto === producto.idProducto
      );

      if (existente) {
        if (existente.cantidad >= producto.stock) {
          return actuales;
        }

        return actuales.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      if (producto.stock <= 0) {
        return actuales;
      }

      return [...actuales, { ...producto, cantidad: 1 }];
    });
  }

  function disminuirProducto(idProducto: number) {
    setSeleccionados((actuales) =>
      actuales
        .map((item) =>
          item.idProducto === idProducto
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminarProducto(idProducto: number) {
    setSeleccionados((actuales) =>
      actuales.filter((item) => item.idProducto !== idProducto)
    );
  }

  const total = seleccionados.reduce(
    (acumulado, item) => acumulado + item.precioVenta * item.cantidad,
    0
  );

  return (
  <>
    <div className="mt-4 rounded-md border px-4 py-3 text-sm">
      {rol === "VENDEDOR" && (
        <span>
          Modo de operación: <strong>Venta presencial</strong>
        </span>
      )}

      {rol === "CLIENTE" && (
        <span>
          Modo de operación: <strong>Compra web</strong>
        </span>
      )}

      {!rol && (
        <span>
          Puedes seleccionar productos. Para continuar con la compra deberás
          iniciar sesión o registrarte.
        </span>
      )}

      {rol && rol !== "VENDEDOR" && rol !== "CLIENTE" && (
        <span>Este módulo no está disponible para tu rol.</span>
      )}
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
      <section>
        <input
          type="text"
          value={buscar}
          onChange={(event) => setBuscar(event.target.value)}
          placeholder="Buscar por nombre, código o laboratorio"
          className="w-full rounded-md border px-3 py-2"
        />

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border px-3 py-2 text-left">Código</th>
                <th className="border px-3 py-2 text-left">Producto</th>
                <th className="border px-3 py-2 text-left">Presentación</th>
                <th className="border px-3 py-2 text-left">Precio</th>
                <th className="border px-3 py-2 text-left">Stock</th>
                <th className="border px-3 py-2 text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              {productosFiltrados.map((producto) => (
                <tr key={producto.idProducto}>
                  <td className="border px-3 py-2">
                    {producto.codigoProducto}
                  </td>

                  <td className="border px-3 py-2">
                    <div className="font-medium">{producto.nombre}</div>
                    <div className="text-sm text-gray-500">
                      {producto.laboratorio ?? "-"}
                    </div>
                  </td>

                  <td className="border px-3 py-2">
                    {producto.presentacion ?? "-"}
                  </td>

                  <td className="border px-3 py-2">
                    S/ {producto.precioVenta.toFixed(2)}
                  </td>

                  <td className="border px-3 py-2">{producto.stock}</td>

                  <td className="border px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => agregarProducto(producto)}
                      disabled={producto.stock <= 0}
                      className="rounded-md bg-black px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Agregar
                    </button>
                  </td>
                </tr>
              ))}

              {productosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="border px-3 py-6 text-center"
                  >
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-md border p-4">
        <h2 className="text-lg font-semibold">Productos seleccionados</h2>

        {seleccionados.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            Todavía no has seleccionado productos.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {seleccionados.map((item) => (
              <div
                key={item.idProducto}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="font-medium">{item.nombre}</div>

                <div className="mt-1 text-sm text-gray-500">
                  S/ {item.precioVenta.toFixed(2)} c/u
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => disminuirProducto(item.idProducto)}
                      className="h-8 w-8 rounded-md border"
                    >
                      -
                    </button>

                    <span className="min-w-8 text-center">
                      {item.cantidad}
                    </span>

                    <button
                      type="button"
                      onClick={() => agregarProducto(item)}
                      disabled={item.cantidad >= item.stock}
                      className="h-8 w-8 rounded-md border disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => eliminarProducto(item.idProducto)}
                    className="text-sm text-red-600"
                  >
                    Quitar
                  </button>
                </div>

                <div className="mt-2 text-right font-medium">
                  Subtotal: S/{" "}
                  {(item.precioVenta * item.cantidad).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
        </div>
      </aside>
        </div>
  </>
)}