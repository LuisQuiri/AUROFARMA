import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { cambiarEstadoTrabajador } from "./actions";
import EstadoUsuarioButton from "./EstadoUsuarioButton";

export default async function UsuariosPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string }>;
}) {
    const session = await auth();

    const rolSesion = (session?.user as { rol?: string } | undefined)?.rol;
    const params = await searchParams;



    const mensajeExito =
    params.success === "trabajador_creado"
        ? "Trabajador registrado correctamente."
        : params.success === "trabajador_actualizado"
            ? "Trabajador actualizado correctamente."
            : params.success === "password_restablecida"
                ? "Contraseña temporal restablecida correctamente."
                : undefined;  
    const usuarios = await prisma.usuario.findMany({
        where: {
            rol: {
                nombre: {
                    not: "CLIENTE",
                },
            },
        },
        include: {
            rol: true,
        },
        orderBy: {
            creadoEn: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Gestión de usuarios</h1>
                    <p className="text-sm text-muted-foreground">
                        Trabajadores registrados en AuroFarma.
                    </p>
                </div>

                {rolSesion === "ADMINISTRADOR" && (
                    <a
                        href="/usuarios/nuevo"
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                    >
                        Nuevo trabajador
                    </a>
                )}

            </div>

            {mensajeExito && (
                <div className="rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {mensajeExito}
                </div>
            )}

            <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr className="border-b text-left">
                            <th className="px-4 py-3 font-medium">Nombre</th>
                            <th className="px-4 py-3 font-medium">Apellido</th>
                            <th className="px-4 py-3 font-medium">Correo</th>
                            <th className="px-4 py-3 font-medium">Rol</th>
                            <th className="px-4 py-3 font-medium">Estado</th>
                            <th className="px-4 py-3 font-medium">Fecha de creación</th>
                            <th className="px-4 py-3 font-medium">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr
                                key={usuario.idUsuario}
                                className="border-b last:border-b-0"
                            >
                                <td className="px-4 py-3">{usuario.nombre}</td>
                                <td className="px-4 py-3">{usuario.apellido}</td>
                                <td className="px-4 py-3">{usuario.correo}</td>
                                <td className="px-4 py-3">{usuario.rol.nombre}</td>
                                <td className="px-4 py-3">{usuario.estadoCuenta}</td>
                                <td className="px-4 py-3">
                                    {usuario.creadoEn.toLocaleDateString("es-PE")}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {rolSesion === "ADMINISTRADOR" && (
                                            <>
                                                <Link
                                                    href={`/usuarios/${usuario.idUsuario}/editar`}
                                                    className="text-sm font-medium text-primary hover:underline"
                                                >
                                                    Editar
                                                </Link>
                                                <Link href={`/usuarios/${usuario.idUsuario}/restablecer-password`}>
                                                    Restablecer contraseña
                                                </Link>
                                            </>
                                        )}

                                        {rolSesion === "TI" && (
                                            <form
                                                action={cambiarEstadoTrabajador.bind(
                                                    null,
                                                    usuario.idUsuario,
                                                    usuario.estadoCuenta === "ACTIVA" ? "INACTIVA" : "ACTIVA"
                                                )}
                                            >
                                                <EstadoUsuarioButton estadoCuenta={usuario.estadoCuenta} />
                                            </form>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {usuarios.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    No hay trabajadores registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}