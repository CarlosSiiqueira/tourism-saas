/*
  Warnings:

  - Added the required column `horaPrevista` to the `LocalEmbarque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocalEmbarque" ADD COLUMN     "horaPrevista" TEXT NOT NULL,
ALTER COLUMN "horaEmbarque" DROP NOT NULL;
