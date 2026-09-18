"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function crearIncidencia(formData: FormData) {
    const session = await auth();

    const usuarioSesion = session?.user as
        | { email?: string | null; rol?: string }
        | undefined;

    if (!usuarioSesion?.email) {
        redirect("/login");
    }

    if (
        usuarioSesion.rol !== "ADMINISTRADOR" &&
        usuarioSesion.rol !== "VENDEDOR" &&
        usuarioSesion.rol !== "ALMACENERO"
    ) {
        redirect("/incidencias");
    }

    const tipoIncidencia = String(formData.get("tipoIncidencia") ?? "");
    const titulo = String(formData.get("titulo") ?? "").trim();
    const descripcion = String(formData.get("descripcion") ?? "").trim();
    const prioridad = String(formData.get("prioridad") ?? "");

    if (!tipoIncidencia || !titulo || !descripcion || !prioridad) {
        redirect("/incidencias/nueva?error=campos_requeridos");
    }

    const tiposValidos = [
        "ERROR_PAGO",
        "CUENTA_BLOQUEADA",
        "ACCESO",
        "SISTEMA",
        "OTRO",
    ];

    const prioridadesValidas = ["BAJA", "MEDIA", "ALTA"];

    if (!tiposValidos.includes(tipoIncidencia)) {
        redirect("/incidencias/nueva?error=tipo_invalido");
    }

    if (!prioridadesValidas.includes(prioridad)) {
        redirect("/incidencias/nueva?error=prioridad_invalida");
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            correo: usuarioSesion.email,
        },
    });

    if (!usuario) {
        redirect("/login");
    }
    await prisma.incidencia.create({
        data: {
            idCreador: usuario.idUsuario,
            tipoIncidencia: tipoIncidencia as
                | "ERROR_PAGO"
                | "CUENTA_BLOQUEADA"
                | "ACCESO"
                | "SISTEMA"
                | "OTRO",
            titulo,
            descripcion,
            prioridad: prioridad as "BAJA" | "MEDIA" | "ALTA",
        },
    });

    redirect("/incidencias?success=incidencia_creada");
}