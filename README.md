This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Ejecución en local (Windows)

Requisitos: Node.js LTS, Git y PostgreSQL instalados.

1. Clonar el repositorio e instalar dependencias: `npm install`
2. Crear la base de datos `aurafarma` en PostgreSQL.
3. Crear un archivo `.env` en la raíz con:
   - `DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@localhost:5432/aurafarma"`
   - `AUTH_SECRET="<clave aleatoria larga>"`
4. Aplicar las migraciones: `npx prisma migrate dev --config prisma7.config.ts`
5. Generar el cliente de Prisma: `npx prisma generate --config prisma7.config.ts`
6. Cargar los usuarios iniciales: `npx prisma db seed --config prisma7.config.ts`
7. Levantar el sistema: `npm run dev` y abrir http://localhost:3000

Nota: el proyecto usa `prisma7.config.ts`, por eso los comandos de Prisma llevan `--config prisma7.config.ts`. Las cuentas de prueba están definidas en `prisma/seed.ts`.