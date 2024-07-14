/*
  Warnings:

  - Made the column `codigoLocalEmbarque` on table `PassageiroEmbarque` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PassageiroEmbarque" DROP CONSTRAINT "PassageiroEmbarque_codigoLocalEmbarque_fkey";

-- AlterTable
ALTER TABLE "PassageiroEmbarque" ALTER COLUMN "codigoLocalEmbarque" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_codigoLocalEmbarque_fkey" FOREIGN KEY ("codigoLocalEmbarque") REFERENCES "LocalEmbarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
