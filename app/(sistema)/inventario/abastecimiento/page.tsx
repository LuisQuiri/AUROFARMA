import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
    buscarCaja,
    reponerInventario,
} from "./actions";

export default async function AbastecimientoPage({
    searchParams,
}: {
    searchParams: Promise<{
        codigo?: string;
        error?: string;
        success?: string;
    }>;
}) {
    const session = await auth();

    const usuarioSesion = session?.user as
        | { rol?: string }
        | undefined;

    if (!session?.user) {
        redirect("/login");
    }

    if (usuarioSesion?.rol !== "ALMACENERO") {
        redirect("/");
    }

    const params = await searchParams;

    let mensajeError = "";

    if (params.error === "codigo_requerido") {
        mensajeError = "Ingrese un código de abastecimiento.";
    }

    if (params.error === "codigo_no_encontrado") {
        mensajeError = "No se encontró una caja con ese código.";
    }

    if (params.error === "caja_procesada") {
        mensajeError = "Esta caja ya fue procesada anteriormente.";
    }

    if (params.error === "caja_no_encontrada") {
        mensajeError = "No se encontró el abastecimiento.";
    }

    const mensajeExito =
        params.success === "reposicion_correcta"
            ? "Inventario repuesto correctamente."
            : undefined;

    const abastecimiento = params.codigo
        ? await prisma.abastecimiento.findUnique({
            where: {
                codigoScan: params.codigo,
            },
            include: {
                detalles: {
                    include: {
                        lote: {
                            include: {
                                producto: true,
                            },
                        },
                    },
                },
            },
        })
        : null;

    return (
        <div className="max-w-5xl">
            <h1 className="text-2xl font-semibold">
                Abastecimiento de inventario
            </h1>

            <form action={buscarCaja} className="mt-6 flex gap-3">
                <input
                    type="text"
                    name="codigo"
                    placeholder="Ejemplo: CAJA-AURO-001"
                    className="w-full rounded-md border px-3 py-2"
                />

                <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-white"
                >
                    Buscar
                </button>
            </form>

            {mensajeError && (
                <p className="mt-4 text-sm text-red-600">
                    {mensajeError}
                </p>
            )}

            {mensajeExito && (
                <p className="mt-4 text-sm text-green-600">
                    {mensajeExito}
                </p>
            )}

            {abastecimiento && (
                <div className="mt-8">
                    <div className="mb-4">
                        <p>
                            <strong>Código:</strong>{" "}
                            {abastecimiento.codigoScan}
                        </p>

                        <p>
                            <strong>Estado:</strong>{" "}
                            {abastecimiento.procesado
                                ? "Procesado"
                                : "Pendiente de reposición"}
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border">
                            <thead>
                                <tr>
                                    <th className="border px-3 py-2 text-left">
                                        Producto
                                    </th>

                                    <th className="border px-3 py-2 text-left">
                                        Laboratorio
                                    </th>

                                    <th className="border px-3 py-2 text-left">
                                        Presentación
                                    </th>

                                    <th className="border px-3 py-2 text-left">
                                        Lote
                                    </th>

                                    <th className="border px-3 py-2 text-left">
                                        Vencimiento
                                    </th>

                                    <th className="border px-3 py-2 text-left">
                                        Cantidad a reponer
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {abastecimiento.detalles.map((detalle) => (
                                    <tr key={detalle.idDetalleAbastecimiento}>
                                        <td className="border px-3 py-2">
                                            {detalle.lote.producto.nombre}
                                        </td>

                                        <td className="border px-3 py-2">
                                            {detalle.lote.producto.laboratorio ?? "-"}
                                        </td>

                                        <td className="border px-3 py-2">
                                            {detalle.lote.producto.presentacion ?? "-"}
                                        </td>

                                        <td className="border px-3 py-2">
                                            {detalle.lote.codigoLote}
                                        </td>

                                        <td className="border px-3 py-2">
                                            {detalle.lote.fechaVencimiento.toLocaleDateString("es-PE")}
                                        </td>

                                        <td className="border px-3 py-2">
                                            {detalle.cantidad}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!abastecimiento.procesado && (
                        <form
                            action={reponerInventario.bind(
                                null,
                                abastecimiento.idAbastecimiento
                            )}
                            className="mt-6"
                        >
                            <button
                                type="submit"
                                className="rounded-md bg-black px-4 py-2 text-white"
                            >
                                Reponer inventario
                            </button>
                        </form>
                    )}

                    {abastecimiento.procesado && (
                        <p className="mt-6 text-sm font-medium">
                            Esta caja ya fue repuesta en el inventario.
                        </p>
                    )}
                </div>
            )}

        </div>
    );
}