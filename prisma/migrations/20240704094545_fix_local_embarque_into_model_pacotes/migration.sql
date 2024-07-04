/*
  Warnings:

  - You are about to drop the column `codigoLocalEmbarque` on the `Pacotes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pacotes" DROP CONSTRAINT "Pacotes_codigoLocalEmbarque_fkey";

-- AlterTable
ALTER TABLE "Pacotes" DROP COLUMN "codigoLocalEmbarque";
