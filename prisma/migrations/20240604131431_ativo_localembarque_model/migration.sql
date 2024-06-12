/*
  Warnings:

  - Added the required column `ativo` to the `LocalEmbarque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocalEmbarque" ADD COLUMN     "ativo" BOOLEAN NOT NULL;
