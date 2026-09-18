import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";

export default async function IncidenciasPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    const session = await auth();

    const usuarioSesion = session?.user as
        | { rol?: string }
        | undefined;

    const params = await searchParams;

    const puedeCrearIncidencia =
        usuarioSesion?.rol === "ADMINISTRADOR" ||
        usuarioSesion?.rol === "VENDEDOR" ||
        usuarioSesion?.rol === "ALMACENERO";

    const mensajeExito =
        params.success === "incidencia_creada"
            ? "Incidencia registrada correctamente."
            : undefined;
    const incidencias = await prisma.incidencia.findMany({
        include: {
            creador: true,
        },
        orderBy: {
            creadoEn: "desc",
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Incidencias</h1>

                {puedeCrearIncidencia && (
                    <Link
                        href="/incidencias/nueva"
                        className="rounded-md bg-black px-4 py-2 text-sm text-white"
                    >
                        Nueva incidencia
                    </Link>
                )}
            </div>
            {mensajeExito && (
                <p className="mt-4 text-sm text-green-600">
                    {mensajeExito}
                </p>
            )}

            <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse border">
                    <thead>
                        <tr>
                            <th className="border px-3 py-2 text-left">ID</th>
                            <th className="border px-3 py-2 text-left">Tipo</th>
                            <th className="border px-3 py-2 text-left">Título</th>
                            <th className="border px-3 py-2 text-left">Usuario</th>
                            <th className="border px-3 py-2 text-left">Prioridad</th>
                            <th className="border px-3 py-2 text-left">Estado</th>
                            <th className="border px-3 py-2 text-left">Fecha</th>
                            <th className="border px-3 py-2 text-left">Acción</th>
                        </tr>
                    </thead>

                    <tbody>
                        {incidencias.map((incidencia) => (
                            <tr key={incidencia.idIncidencia}>
                                <td className="border px-3 py-2">
                                    {incidencia.idIncidencia}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.tipoIncidencia}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.titulo}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.creador.nombre} {incidencia.creador.apellido}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.prioridad}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.estado}
                                </td>

                                <td className="border px-3 py-2">
                                    {incidencia.creadoEn.toLocaleDateString("es-PE")}
                                </td>

                                <td className="border px-3 py-2">
                                    <Link
                                        href={`/incidencias/${incidencia.idIncidencia}`}
                                        className="underline"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}


                        {incidencias.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="border px-3 py-6 text-center text-sm text-muted-foreground"
                                >
                                    No hay incidencias registradas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}