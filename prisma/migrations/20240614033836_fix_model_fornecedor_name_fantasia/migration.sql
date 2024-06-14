/*
  Warnings:

  - Added the required column `fantasia` to the `Fornecedor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Fornecedor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fornecedor" ADD COLUMN     "fantasia" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL;
