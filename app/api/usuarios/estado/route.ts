import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { correo } = await request.json();

    if (!correo) {
        return NextResponse.json(
            { estadoCuenta: null },
            { status: 400 }
        );
    }

    const usuario = await prisma.usuario.findUnique({
        where: {
            correo: correo.toLowerCase().trim(),
        },
        select: {
            estadoCuenta: true,
        },
    });

    return NextResponse.json({
        estadoCuenta: usuario?.estadoCuenta ?? null,
    });
}