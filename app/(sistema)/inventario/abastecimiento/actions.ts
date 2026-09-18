"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function buscarCaja(formData: FormData) {
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

  const codigo = String(formData.get("codigo") ?? "")
    .trim()
    .toUpperCase();

  if (!codigo) {
    redirect("/inventario/abastecimiento?error=codigo_requerido");
  }

  const abastecimiento = await prisma.abastecimiento.findUnique({
    where: {
      codigoScan: codigo,
    },
  });

  if (!abastecimiento) {
    redirect("/inventario/abastecimiento?error=codigo_no_encontrado");
  }

  redirect(
    `/inventario/abastecimiento?codigo=${encodeURIComponent(codigo)}`
  );
}

export async function reponerInventario(
  idAbastecimiento: number,
  formData: FormData
) {
  const session = await auth();

  const usuarioSesion = session?.user as
    | { email?: string | null; rol?: string }
    | undefined;

  if (!usuarioSesion?.email) {
    redirect("/login");
  }

  if (usuarioSesion.rol !== "ALMACENERO") {
    redirect("/");
  }

  const usuario = await prisma.usuario.findUnique({
    where: {
      correo: usuarioSesion.email,
    },
  });

  if (!usuario) {
    redirect("/login");
  }

  const abastecimiento = await prisma.abastecimiento.findUnique({
    where: {
      idAbastecimiento,
    },
    include: {
      detalles: {
        include: {
          lote: true,
        },
      },
    },
  });

  if (!abastecimiento) {
    redirect("/inventario/abastecimiento?error=caja_no_encontrada");
  }

  if (abastecimiento.procesado) {
    redirect(
      `/inventario/abastecimiento?codigo=${encodeURIComponent(
        abastecimiento.codigoScan
      )}&error=caja_procesada`
    );
  }

  await prisma.$transaction(async (tx) => {
    for (const detalle of abastecimiento.detalles) {
      await tx.lote.update({
        where: {
          idLote: detalle.idLote,
        },
        data: {
          cantidadDisponible: {
            increment: detalle.cantidad,
          },
        },
      });

      await tx.movimientoInventario.create({
        data: {
          idLote: detalle.idLote,
          idUsuario: usuario.idUsuario,
          tipoMovimiento: "ENTRADA",
          cantidad: detalle.cantidad,
          motivo: "Reposición por abastecimiento",
          referencia: abastecimiento.codigoScan,
          observacion: `Ingreso correspondiente a ${abastecimiento.codigoScan}`,
        },
      });
    }

    await tx.abastecimiento.update({
      where: {
        idAbastecimiento,
      },
      data: {
        procesado: true,
        procesadoEn: new Date(),
      },
    });
  });

  redirect(
    `/inventario/abastecimiento?codigo=${encodeURIComponent(
      abastecimiento.codigoScan
    )}&success=reposicion_correcta`
  );
}