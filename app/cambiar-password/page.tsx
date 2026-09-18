import bcrypt from "bcryptjs";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function cambiarPassword(formData: FormData) {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const nuevaPassword = String(formData.get("nuevaPassword") ?? "");
  const confirmarPassword = String(formData.get("confirmarPassword") ?? "");

  if (nuevaPassword.length < 8) {
    redirect("/cambiar-password?error=longitud");
  }

  if (nuevaPassword !== confirmarPassword) {
    redirect("/cambiar-password?error=no-coinciden");
  }

  const passwordHash = await bcrypt.hash(nuevaPassword, 10);

  await prisma.usuario.update({
    where: {
      correo: session.user.email,
    },
    data: {
      passwordHash,
      debeCambiarPassword: false,
      passwordCambiadoEn: new Date(),
      intentosFallidos: 0,
    },
  });

  await signOut({
    redirectTo: "/login?passwordActualizada=1",
  });
}

type Props = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function CambiarPasswordPage({
  searchParams,
}: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const usuarioSesion = session.user as typeof session.user & {
    debeCambiarPassword?: boolean;
  };

  if (!usuarioSesion.debeCambiarPassword) {
    redirect("/");
  }

  const params = await searchParams;

  let mensajeError = "";

  if (params.error === "longitud") {
    mensajeError = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (params.error === "no-coinciden") {
    mensajeError = "Las contraseñas no coinciden.";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Cambiar contraseña
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Debes establecer una nueva contraseña antes de continuar en
            AuroFarma.
          </p>
        </div>

        <form action={cambiarPassword} className="space-y-5">
          <div>
            <label
              htmlFor="nuevaPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nueva contraseña
            </label>

            <input
              id="nuevaPassword"
              name="nuevaPassword"
              type="password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="confirmarPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirmar contraseña
            </label>

            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              minLength={8}
              required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {mensajeError && (
            <p className="text-sm font-medium text-red-600">
              {mensajeError}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            Guardar nueva contraseña
          </button>
        </form>
      </div>
    </main>
  );
}