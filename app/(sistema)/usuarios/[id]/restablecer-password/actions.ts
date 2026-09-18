"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function restablecerPassword(
    idUsuario: number,
    formData: FormData
) {
    const session = await auth();

    const rolUsuario = (session?.user as { rol?: string })?.rol;

    if (!session?.user || rolUsuario !== "ADMINISTRADOR") {
        redirect("/usuarios");
    }

    const password = String(formData.get("password") ?? "");
    const confirmarPassword = String(
        formData.get("confirmarPassword") ?? ""
    );

    if (!password || !confirmarPassword) {
        redirect(
            `/usuarios/${idUsuario}/restablecer-password?error=campos_requeridos`
        );
    }

    if (password !== confirmarPassword) {
        redirect(
            `/usuarios/${idUsuario}/restablecer-password?error=password_no_coincide`
        );
    }

    if (password.length < 8) {
        redirect(
            `/usuarios/${idUsuario}/restablecer-password?error=password_corta`
        );
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

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.usuario.update({
        where: {
            idUsuario,
        },
        data: {
            passwordHash,
            debeCambiarPassword: true,
            passwordCambiadoEn: null,
            intentosFallidos: 0,
        },
    });

    redirect("/usuarios?success=password_restablecida");
}