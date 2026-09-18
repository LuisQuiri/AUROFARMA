import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { crearTrabajador } from "./actions";


export default async function NuevoUsuarioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const mensajesError: Record<string, string> = {
    password_invalida:
      "La contraseña temporal debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.",
    sin_permiso: "No tienes permisos para registrar trabajadores.",
    campos_obligatorios: "Todos los campos son obligatorios.",
    rol_invalido: "El rol seleccionado no es válido.",
    correo_existente: "Ya existe un usuario registrado con ese correo.",
  };

  const mensajeError = params.error
    ? mensajesError[params.error]
    : undefined;

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
          Nuevo trabajador
        </h1>

        <p className="text-sm text-muted-foreground">
          Registra un nuevo trabajador en AuroFarma.
        </p>
      </div>

      <form
        action={crearTrabajador}
        className="space-y-5 rounded-lg border p-6"
      >
        {mensajeError && (
          <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {mensajeError}
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
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
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="idRol" className="text-sm font-medium">
            Rol
          </label>

          <div className="space-y-2">
            <label htmlFor="passwordTemporal" className="text-sm font-medium">
              Contraseña temporal
            </label>

            <input
              id="passwordTemporal"
              name="passwordTemporal"
              type="password"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>

          <select
            id="idRol"
            name="idRol"
            defaultValue=""
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Selecciona un rol
            </option>

            {roles.map((rol) => (
              <option key={rol.idRol} value={rol.idRol}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Registrar trabajador
          </button>
        </div>
      </form>
    </div>
  );
}