import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        correo: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },

      async authorize(credentials) {
        const correo = credentials?.correo as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!correo || !password) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({
          where: { correo },
          include: { rol: true },
        });

        if (!usuario) {
          return null;
        }

        if (usuario.estadoCuenta !== "ACTIVA") {
          return null;
        }

        const passwordCorrecta = await bcrypt.compare(
          password,
          usuario.passwordHash
        );

        if (!passwordCorrecta) {
          return null;
        }

        return {
          id: usuario.idUsuario.toString(),
          name: `${usuario.nombre} ${usuario.apellido}`,
          email: usuario.correo,
          rol: usuario.rol.nombre,
          debeCambiarPassword: usuario.debeCambiarPassword,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = (user as typeof user & { rol: string }).rol;
        token.debeCambiarPassword = (
          user as typeof user & { debeCambiarPassword: boolean }
        ).debeCambiarPassword;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { rol: string }).rol =
          token.rol as string;

        (
          session.user as typeof session.user & {
            debeCambiarPassword: boolean;
          }
        ).debeCambiarPassword = token.debeCambiarPassword as boolean;
      }

      return session;
    },
  },

});