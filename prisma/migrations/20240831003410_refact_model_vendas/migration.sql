/*
  Warnings:

  - You are about to drop the column `codigoPacote` on the `Vendas` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Vendas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Vendas" DROP CONSTRAINT "Vendas_codigoPacote_fkey";

-- AlterTable
ALTER TABLE "Vendas" DROP COLUMN "codigoPacote",
DROP COLUMN "tipo",
ADD COLUMN     "codigoExcursao" TEXT;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
