/*
  Warnings:

  - The values [BLOQUEADA] on the enum `EstadoCuenta` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EstadoCuenta_new" AS ENUM ('ACTIVA', 'INACTIVA');
ALTER TABLE "public"."Usuario" ALTER COLUMN "estadoCuenta" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "estadoCuenta" TYPE "EstadoCuenta_new" USING ("estadoCuenta"::text::"EstadoCuenta_new");
ALTER TYPE "EstadoCuenta" RENAME TO "EstadoCuenta_old";
ALTER TYPE "EstadoCuenta_new" RENAME TO "EstadoCuenta";
DROP TYPE "public"."EstadoCuenta_old";
ALTER TABLE "Usuario" ALTER COLUMN "estadoCuenta" SET DEFAULT 'ACTIVA';
COMMIT;
