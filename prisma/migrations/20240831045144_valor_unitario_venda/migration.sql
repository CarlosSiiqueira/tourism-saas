/*
  Warnings:

  - You are about to drop the column `valor` on the `Vendas` table. All the data in the column will be lost.
  - Added the required column `valorTotal` to the `Vendas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorUnitario` to the `Vendas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendas" DROP COLUMN "valor",
ADD COLUMN     "valorTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valorUnitario" DOUBLE PRECISION NOT NULL;
