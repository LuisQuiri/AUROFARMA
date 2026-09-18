"use client";

type Props = {
    estadoCuenta: "ACTIVA" | "INACTIVA";
};

export default function EstadoUsuarioButton({ estadoCuenta }: Props) {
    const mensaje =
        estadoCuenta === "ACTIVA"
            ? "¿Está seguro de que desea inactivar este usuario?"
            : "¿Está seguro de que desea activar este usuario?";

    return (
        <button
            type="submit"
            onClick={(event) => {
                if (!window.confirm(mensaje)) {
                    event.preventDefault();
                }
            }}
            className="text-sm font-medium text-primary hover:underline"
        >
            {estadoCuenta === "ACTIVA" ? "Inactivar" : "Activar"}
        </button>
    );
}