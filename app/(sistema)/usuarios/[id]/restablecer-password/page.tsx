import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { restablecerPassword } from "./actions";

export default async function RestablecerPasswordPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ error?: string }>;
}) {
    const session = await auth();

    const rolUsuario = (session?.user as { rol?: string })?.rol;

    if (!session?.user || rolUsuario !== "ADMINISTRADOR") {
        redirect("/usuarios");
    }

    const { id } = await params;
    const { error } = await searchParams;

    const idUsuario = Number(id);

    if (Number.isNaN(idUsuario)) {
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

    const action = restablecerPassword.bind(null, idUsuario);

    let mensajeError = "";

    if (error === "campos_requeridos") {
        mensajeError = "Complete todos los campos.";
    }

    if (error === "password_no_coincide") {
        mensajeError = "Las contraseñas no coinciden.";
    }

    if (error === "password_corta") {
        mensajeError = "La contraseña temporal debe tener al menos 8 caracteres.";
    }

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-semibold">
                Restablecer contraseña
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
                Trabajador: {usuario.nombre} {usuario.apellido}
            </p>

            {mensajeError && (
                <p className="mt-4 text-sm text-red-600">
                    {mensajeError}
                </p>
            )}

            <form action={action} className="mt-6 space-y-4">
                <div>
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium"
                    >
                        Nueva contraseña temporal
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <div>
                    <label
                        htmlFor="confirmarPassword"
                        className="mb-1 block text-sm font-medium"
                    >
                        Confirmar contraseña temporal
                    </label>

                    <input
                        id="confirmarPassword"
                        name="confirmarPassword"
                        type="password"
                        required
                        minLength={8}
                        className="w-full rounded-md border px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-md bg-black px-4 py-2 text-white"
                >
                    Restablecer contraseña
                </button>
            </form>
        </div>
    );
}