/*
  Warnings:

  - Made the column `idTipoQuarto` on table `ExcursaoQuartos` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ExcursaoQuartos" DROP CONSTRAINT "ExcursaoQuartos_idTipoQuarto_fkey";

-- AlterTable
ALTER TABLE "ExcursaoQuartos" ALTER COLUMN "idTipoQuarto" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ExcursaoQuartos" ADD CONSTRAINT "ExcursaoQuartos_idTipoQuarto_fkey" FOREIGN KEY ("idTipoQuarto") REFERENCES "TipoQuarto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
