/*
  Warnings:

  - You are about to drop the `_ExcursaoQuartosToPessoas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `codigoPassageiro` to the `ExcursaoQuartos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" DROP CONSTRAINT "_ExcursaoQuartosToPessoas_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" DROP CONSTRAINT "_ExcursaoQuartosToPessoas_B_fkey";

-- AlterTable
ALTER TABLE "ExcursaoQuartos" ADD COLUMN     "codigoPassageiro" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ExcursaoQuartosToPessoas";

-- AddForeignKey
ALTER TABLE "ExcursaoQuartos" ADD CONSTRAINT "ExcursaoQuartos_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
