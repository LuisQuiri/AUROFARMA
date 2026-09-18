import Link from "next/link";
import { notFound } from "next/navigation";
import { actualizarTrabajador } from "./actions";
import { prisma } from "@/lib/prisma";

export default async function EditarTrabajadorPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ error?: string }>;
}) {
    const { id } = await params;
    const query = await searchParams;
    const mensajeError =
        query.error === "campos_obligatorios"
            ? "Todos los campos son obligatorios."
            : query.error === "rol_invalido"
                ? "El rol seleccionado no es válido."
                : query.error === "correo_existente"
                    ? "El correo ya está registrado por otro usuario."
                    : undefined;

    const idUsuario = Number(id);

    if (!Number.isInteger(idUsuario)) {
        notFound();
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
        notFound();
    }

    const roles = await prisma.rol.findMany({
        where: {
            activo: true,
            nombre: {
                not: "CLIENTE",
            },
        },
        orderBy: {
            nombre: "asc",
        },
    });
    const actualizarTrabajadorConId = actualizarTrabajador.bind(
        null,
        usuario.idUsuario
    );

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <Link
                    href="/usuarios"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Volver a usuarios
                </Link>

                <h1 className="mt-3 text-2xl font-semibold">
                    Editar trabajador
                </h1>

                <p className="text-sm text-muted-foreground">
                    Modifica la información del trabajador seleccionado.
                </p>
            </div>

            {mensajeError && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {mensajeError}
                </div>
            )}
            

            <form action={actualizarTrabajadorConId}>
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label htmlFor="nombre" className="text-sm font-medium">
                            Nombre
                        </label>

                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            defaultValue={usuario.nombre}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="apellido" className="text-sm font-medium">
                            Apellido
                        </label>

                        <input
                            id="apellido"
                            name="apellido"
                            type="text"
                            defaultValue={usuario.apellido}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="correo" className="text-sm font-medium">
                        Correo
                    </label>

                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        defaultValue={usuario.correo}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="idRol" className="text-sm font-medium">
                        Rol
                    </label>

                    <select
                        id="idRol"
                        name="idRol"
                        defaultValue={usuario.idRol}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    >
                        {roles.map((rol) => (
                            <option key={rol.idRol} value={rol.idRol}>
                                {rol.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Estado de cuenta
                    </label>

                    <input
                        type="text"
                        value={usuario.estadoCuenta}
                        disabled
                        className="w-full rounded-md border bg-muted px-3 py-2 text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
}