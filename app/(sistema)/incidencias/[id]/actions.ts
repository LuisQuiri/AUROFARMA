"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function actualizarEstadoIncidencia(
    idIncidencia: number,
    formData: FormData
) {
    const session = await auth();

    const usuarioSesion = session?.user as
        | { rol?: string }
        | undefined;

    if (!session?.user) {
        redirect("/login");
    }

    if (usuarioSesion?.rol !== "TI") {
        redirect("/incidencias");
    }

    const estado = String(formData.get("estado") ?? "");
    const solucionFinal = String(
        formData.get("solucionFinal") ?? ""
    ).trim();
    if (
        (estado === "RESUELTA" || estado === "CERRADA") &&
        !solucionFinal
    ) {
        redirect(
            `/incidencias/${idIncidencia}?error=solucion_requerida`
        );
    }
    const estadosValidos = [
        "PENDIENTE",
        "EN_REVISION",
        "RESUELTA",
        "CERRADA",
    ];

    if (!estadosValidos.includes(estado)) {
        redirect(`/incidencias/${idIncidencia}?error=estado_invalido`);
    }

    await prisma.incidencia.update({
        where: {
            idIncidencia,
        },
        data: {
            estado: estado as
                | "PENDIENTE"
                | "EN_REVISION"
                | "RESUELTA"
                | "CERRADA",

            solucionFinal:
                estado === "RESUELTA" || estado === "CERRADA"
                    ? solucionFinal
                    : null,

            resueltoEn:
                estado === "RESUELTA" || estado === "CERRADA"
                    ? new Date()
                    : null,
        },
    });

    redirect(`/incidencias/${idIncidencia}?success=estado_actualizado`);
}