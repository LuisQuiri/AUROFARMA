"use client";

import { useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";

export default function LoginPage() {
    const [error, setError] = useState("");
    useEffect(() => {
        async function verificarSesion() {
            const session = await getSession();

            if (session?.user) {
                window.location.href = "/";
            }
        }

        verificarSesion();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        const formData = new FormData(event.currentTarget);

        const correo = formData.get("correo") as string;
        const password = formData.get("password") as string;
        const estadoResponse = await fetch("/api/usuarios/estado", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ correo }),
        });

        const estadoData = await estadoResponse.json();

        if (estadoData.estadoCuenta === "INACTIVA") {
            setError("Cuenta inactiva, comunícate con tu administrador.");
            return;
        }
        const result = await signIn("credentials", {
            correo,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Correo o contraseña incorrectos.");
            return;
        }

        const sessionResponse = await fetch("/api/auth/session");
        const session = await sessionResponse.json();

        if (session?.user?.debeCambiarPassword) {
            window.location.href = "/cambiar-password";
            return;
        }

        window.location.href = "/";
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900">AuroFarma</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Inicia sesión para acceder al sistema
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="correo"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="correo"
                            name="correo"
                            type="email"
                            placeholder="correo@aurofarma.com"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Ingresa tu contraseña"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />
                    </div>
                    {error && (
                        <p className="text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
                    >
                        Iniciar sesión
                    </button>

                    <a
                        href="/compras"
                        className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        🛒 Realizar compra
                    </a>
                </form>
            </div>
        </main>
    );
}