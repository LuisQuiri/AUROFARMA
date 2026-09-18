import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function InicioPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900">
        Inicio
      </h2>

      <p className="mt-2 text-slate-600">
        Bienvenido, {session.user.name}.
      </p>
    </div>
  );
}