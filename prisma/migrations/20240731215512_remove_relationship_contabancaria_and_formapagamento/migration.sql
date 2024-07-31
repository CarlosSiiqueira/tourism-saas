/*
  Warnings:

  - You are about to drop the column `contaBancariaId` on the `FormaPagamento` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormaPagamento" DROP CONSTRAINT "FormaPagamento_contaBancariaId_fkey";

-- AlterTable
ALTER TABLE "FormaPagamento" DROP COLUMN "contaBancariaId";
