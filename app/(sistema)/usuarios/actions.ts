"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function cambiarEstadoTrabajador(
    idUsuario: number,
    nuevoEstado: "ACTIVA" | "INACTIVA"
) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const rolSesion = (session.user as { rol?: string }).rol;

    if (rolSesion !== "TI") {
        redirect("/usuarios");
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            idUsuario,
        },
        include: {
            rol: true,
        },
    });

    if (!usuario || usuario.rol.nombre === "CLIENTE") {
        redirect("/usuarios");
    }


    await prisma.usuario.update({
        where: {
            idUsuario,
        },
        data: {
            estadoCuenta: nuevoEstado,
        },
    });

    redirect("/usuarios?success=estado_actualizado");
}