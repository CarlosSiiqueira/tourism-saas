/*
  Warnings:

  - You are about to drop the column `codigoPassageiro` on the `ExcursaoQuartos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcursaoQuartos" DROP CONSTRAINT "ExcursaoQuartos_codigoPassageiro_fkey";

-- AlterTable
ALTER TABLE "ExcursaoQuartos" DROP COLUMN "codigoPassageiro";

-- CreateTable
CREATE TABLE "_ExcursaoQuartosToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoQuartosToPessoas_AB_unique" ON "_ExcursaoQuartosToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoQuartosToPessoas_B_index" ON "_ExcursaoQuartosToPessoas"("B");

-- AddForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" ADD CONSTRAINT "_ExcursaoQuartosToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "ExcursaoQuartos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" ADD CONSTRAINT "_ExcursaoQuartosToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
