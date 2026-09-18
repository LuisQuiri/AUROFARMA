"use server";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function actualizarTrabajador(
  idUsuario: number,
  formData: FormData
) {
  const session = await auth();

  if (!session?.user) {
    redirect("/usuarios");
  }

  const rolSesion = (session.user as { rol?: string }).rol;

  if (rolSesion !== "ADMINISTRADOR") {
    redirect("/usuarios");
  }

  const nombre = formData.get("nombre")?.toString().trim();
  const apellido = formData.get("apellido")?.toString().trim();
  const correo = formData.get("correo")?.toString().trim().toLowerCase();
  const idRol = Number(formData.get("idRol"));

  if (!nombre || !apellido || !correo || !idRol) {
    redirect(`/usuarios/${idUsuario}/editar?error=campos_obligatorios`);
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

  const rol = await prisma.rol.findUnique({
    where: {
      idRol,
    },
  });

  if (!rol || !rol.activo || rol.nombre === "CLIENTE") {
    redirect(`/usuarios/${idUsuario}/editar?error=rol_invalido`);
  }

  const correoExistente = await prisma.usuario.findFirst({
    where: {
      correo,
      NOT: {
        idUsuario,
      },
    },
  });

  if (correoExistente) {
    redirect(`/usuarios/${idUsuario}/editar?error=correo_existente`);
  }

  await prisma.usuario.update({
    where: {
      idUsuario,
    },
    data: {
      nombre,
      apellido,
      correo,
      idRol,
    },
  });

  redirect("/usuarios?success=trabajador_actualizado");
}