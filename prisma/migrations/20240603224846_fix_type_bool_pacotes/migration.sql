/*
  Warnings:

  - The `ativo` column on the `Pacotes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Pacotes" DROP COLUMN "ativo",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
