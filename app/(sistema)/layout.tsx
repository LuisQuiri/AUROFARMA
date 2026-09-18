import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function SistemaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const usuario = session.user as typeof session.user & {
    rol?: string;
  };

  async function cerrarSesion() {
    "use server";

    await signOut({
      redirectTo: "/login",
    });
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-slate-900">AuroFarma</h1>
          <p className="mt-1 text-xs text-slate-500">
            Sistema de gestión farmacéutica
          </p>
        </div>

        <nav className="space-y-2 p-4">
          {usuario.rol === "ADMINISTRADOR" && (
            <Link
              href="/"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Inicio
            </Link>
          )}

          {usuario.rol === "ADMINISTRADOR" && (
            <>
              <Link
                href="/usuarios"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Usuarios
              </Link>

              <Link
                href="/productos"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Productos
              </Link>

              <Link
                href="/inventario"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Inventario
              </Link>

              <Link
                href="/incidencias"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Incidencias
              </Link>

              <Link
                href="/dashboard"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
            </>
          )}

          {usuario.rol === "VENDEDOR" && (
            <>
              <Link
                href="/productos"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Productos
              </Link>
              <Link
                href="/ventas"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Ventas
              </Link>

              <Link
                href="/incidencias"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Incidencias
              </Link>
            </>
          )}

          {usuario.rol === "ALMACENERO" && (
            <>
              <Link
                href="/inventario"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Inventario
              </Link>
              <Link
                href="/incidencias"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Incidencias
              </Link>
            </>
          )}

          {usuario.rol === "TI" && (
            <>
              <Link
                href="/usuarios"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Usuarios
              </Link>

              <Link
                href="/incidencias"
                className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Incidencias
              </Link>
            </>
          )}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {session.user.name}
            </p>
            <p className="text-xs text-slate-500">{usuario.rol}</p>
          </div>

          <form action={cerrarSesion}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Cerrar sesión
            </button>
          </form>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}