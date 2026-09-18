import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { actualizarEstadoIncidencia } from "./actions";

export default async function DetalleIncidenciaPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ success?: string; error?: string }>;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const usuarioSesion = session.user as {
        rol?: string;
    };

    const { id } = await params;
    const query = await searchParams;

    const idIncidencia = Number(id);

    if (Number.isNaN(idIncidencia)) {
        redirect("/incidencias");
    }

    const incidencia = await prisma.incidencia.findUnique({
        where: {
            idIncidencia,
        },
        include: {
            creador: true,
        },
    });

    if (!incidencia) {
        redirect("/incidencias");
    }

    const puedeGestionar = usuarioSesion.rol === "TI";

    const action = actualizarEstadoIncidencia.bind(
        null,
        idIncidencia
    );

    const mensajeExito =
        query.success === "estado_actualizado"
            ? "Estado de la incidencia actualizado correctamente."
            : undefined;

    const mensajeError =
        query.error === "estado_invalido"
            ? "El estado seleccionado no es válido."
            : query.error === "solucion_requerida"
                ? "Debe ingresar la respuesta o solución final antes de resolver o cerrar la incidencia."
                : undefined;

    return (
        <div className="max-w-3xl">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">
                    Incidencia #{incidencia.idIncidencia}
                </h1>

                <Link
                    href="/incidencias"
                    className="text-sm underline"
                >
                    Volver
                </Link>
            </div>

            {mensajeExito && (
                <p className="mt-4 text-sm text-green-600">
                    {mensajeExito}
                </p>
            )}

            {mensajeError && (
                <p className="mt-4 text-sm text-red-600">
                    {mensajeError}
                </p>
            )}

            <div className="mt-6 space-y-3">
                <p>
                    <strong>Título:</strong> {incidencia.titulo}
                </p>

                <p>
                    <strong>Tipo:</strong> {incidencia.tipoIncidencia}
                </p>

                <p>
                    <strong>Prioridad:</strong> {incidencia.prioridad}
                </p>

                <p>
                    <strong>Estado:</strong> {incidencia.estado}
                </p>

                <p>
                    <strong>Creado por:</strong>{" "}
                    {incidencia.creador.nombre}{" "}
                    {incidencia.creador.apellido}
                </p>

                <p>
                    <strong>Descripción:</strong>
                </p>

                <p className="whitespace-pre-wrap">
                    {incidencia.descripcion}
                </p>
                {incidencia.solucionFinal && (
                    <div className="mt-4">
                        <p>
                            <strong>Respuesta de TI:</strong>
                        </p>

                        <p className="whitespace-pre-wrap">
                            {incidencia.solucionFinal}
                        </p>
                    </div>
                )}
            </div>

            {puedeGestionar && (
                <form
                    action={action}
                    className="mt-8 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="estado"
                            className="mb-1 block text-sm font-medium"
                        >
                            Cambiar estado
                        </label>

                        <select
                            id="estado"
                            name="estado"
                            defaultValue={incidencia.estado}
                            className="w-full rounded-md border px-3 py-2"
                        >
                            <option value="PENDIENTE">
                                Pendiente
                            </option>

                            <option value="EN_REVISION">
                                En revisión
                            </option>

                            <option value="RESUELTA">
                                Resuelta
                            </option>

                            <option value="CERRADA">
                                Cerrada
                            </option>
                        </select>

                    </div>
                    <div>
                        <label
                            htmlFor="solucionFinal"
                            className="mb-1 block text-sm font-medium"
                        >
                            Respuesta / solución final
                        </label>

                        <textarea
                            id="solucionFinal"
                            name="solucionFinal"
                            rows={5}
                            defaultValue={incidencia.solucionFinal ?? ""}
                            placeholder="Describa la solución aplicada o la respuesta brindada al usuario."
                            className="w-full rounded-md border px-3 py-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-md bg-black px-4 py-2 text-white"
                    >
                        Actualizar estado
                    </button>
                </form>
            )}
        </div>
    );
}
