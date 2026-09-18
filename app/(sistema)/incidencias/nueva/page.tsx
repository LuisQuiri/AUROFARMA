import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { crearIncidencia } from "./actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NuevaIncidenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {

    
  const session = await auth();

  const usuarioSesion = session?.user as
    | { rol?: string }
    | undefined;

  if (!session?.user) {
    redirect("/login");
  }

  if (
    usuarioSesion?.rol !== "ADMINISTRADOR" &&
    usuarioSesion?.rol !== "VENDEDOR" &&
    usuarioSesion?.rol !== "ALMACENERO"
  ) {
    redirect("/incidencias");
  }

  const params = await searchParams;

  let mensajeError = "";

  if (params.error === "campos_requeridos") {
    mensajeError = "Complete todos los campos.";
  }

  if (params.error === "tipo_invalido") {
    mensajeError = "El tipo de incidencia no es válido.";
  }

  if (params.error === "prioridad_invalida") {
    mensajeError = "La prioridad seleccionada no es válida.";
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Nueva incidencia</h1>

      {mensajeError && (
        <p className="mt-4 text-sm text-red-600">
          {mensajeError}
        </p>
      )}

      <form action={crearIncidencia} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="tipoIncidencia"
            className="mb-1 block text-sm font-medium"
          >
            Tipo de incidencia
          </label>

          <select
            id="tipoIncidencia"
            name="tipoIncidencia"
            required
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Seleccione una opción</option>
            <option value="ERROR_PAGO">Error de pago</option>
            <option value="CUENTA_BLOQUEADA">Cuenta bloqueada</option>
            <option value="ACCESO">Problema de acceso</option>
            <option value="SISTEMA">Problema del sistema</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="titulo"
            className="mb-1 block text-sm font-medium"
          >
            Título
          </label>

          <input
            id="titulo"
            name="titulo"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="descripcion"
            className="mb-1 block text-sm font-medium"
          >
            Descripción
          </label>

          <textarea
            id="descripcion"
            name="descripcion"
            required
            rows={5}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="prioridad"
            className="mb-1 block text-sm font-medium"
          >
            Prioridad
          </label>

          <select
            id="prioridad"
            name="prioridad"
            required
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Seleccione una opción</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white"
        >
          Registrar incidencia
        </button>
      </form>
    </div>
  );
}