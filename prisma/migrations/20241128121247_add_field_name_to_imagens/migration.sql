/*
  Warnings:

  - Added the required column `nome` to the `Imagens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Imagens" ADD COLUMN     "nome" TEXT NOT NULL;
