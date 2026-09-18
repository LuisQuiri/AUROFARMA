/*
  Warnings:

  - A unique constraint covering the columns `[codigoScan]` on the table `Abastecimiento` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Abastecimiento" ADD COLUMN     "procesado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "procesadoEn" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Abastecimiento_codigoScan_key" ON "Abastecimiento"("codigoScan");
