"use server";

import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function crearTrabajador(formData: FormData) {
    const session = await auth();

    if (!session?.user) {
        redirect("/usuarios/nuevo?error=sin_permiso");
    }

    const rolSesion = (session.user as { rol?: string }).rol;

    if (rolSesion !== "ADMINISTRADOR") {
        
    redirect("/usuarios/nuevo?error=sin_permiso");
}

const nombre = formData.get("nombre")?.toString().trim();
const apellido = formData.get("apellido")?.toString().trim();
const correo = formData.get("correo")?.toString().trim().toLowerCase();
const idRol = Number(formData.get("idRol"));
const passwordTemporal = formData
    .get("passwordTemporal")
    ?.toString();

if (
    !nombre ||
    !apellido ||
    !correo ||
    !idRol ||
    !passwordTemporal
) {
    redirect("/usuarios/nuevo?error=campos_obligatorios");
}

const passwordValida =
  passwordTemporal.length >= 8 &&
  /[A-Z]/.test(passwordTemporal) &&
  /[a-z]/.test(passwordTemporal) &&
  /[0-9]/.test(passwordTemporal) &&
  /[^A-Za-z0-9]/.test(passwordTemporal);

if (!passwordValida) {
  redirect("/usuarios/nuevo?error=password_invalida");
}

const rol = await prisma.rol.findUnique({
    where: {
        idRol,
    },
});

if (!rol || !rol.activo || rol.nombre === "CLIENTE") {
    redirect("/usuarios/nuevo?error=rol_invalido");
}

const usuarioExistente = await prisma.usuario.findUnique({
    where: {
        correo,
    },
});

if (usuarioExistente) {
    redirect("/usuarios/nuevo?error=correo_existente");
}

const passwordHash = await bcrypt.hash(passwordTemporal, 12);

await prisma.usuario.create({
    data: {
        nombre,
        apellido,
        correo,
        idRol,
        passwordHash,
        estadoCuenta: "ACTIVA",
        intentosFallidos: 0,
        debeCambiarPassword: true,
    },
});

redirect("/usuarios?success=trabajador_creado");
}