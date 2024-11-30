/*
  Warnings:

  - You are about to drop the column `excursaoLocalEmbarqueId` on the `LocalEmbarque` table. All the data in the column will be lost.
  - You are about to drop the `ExcursaoLocalEmbarque` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcursaoLocalEmbarque" DROP CONSTRAINT "ExcursaoLocalEmbarque_idExcursao_fkey";

-- DropForeignKey
ALTER TABLE "LocalEmbarque" DROP CONSTRAINT "LocalEmbarque_excursaoLocalEmbarqueId_fkey";

-- AlterTable
ALTER TABLE "Excursao" ADD COLUMN     "qtdMinVendas" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "LocalEmbarque" DROP COLUMN "excursaoLocalEmbarqueId";

-- DropTable
DROP TABLE "ExcursaoLocalEmbarque";
