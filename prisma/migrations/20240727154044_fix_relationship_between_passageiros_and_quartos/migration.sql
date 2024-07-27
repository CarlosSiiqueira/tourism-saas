/*
  Warnings:

  - You are about to drop the `_ExcursaoQuartosToPessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" DROP CONSTRAINT "_ExcursaoQuartosToPessoas_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" DROP CONSTRAINT "_ExcursaoQuartosToPessoas_B_fkey";

-- DropTable
DROP TABLE "_ExcursaoQuartosToPessoas";

-- CreateTable
CREATE TABLE "_ExcursaoPassageirosToExcursaoQuartos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoPassageirosToExcursaoQuartos_AB_unique" ON "_ExcursaoPassageirosToExcursaoQuartos"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoPassageirosToExcursaoQuartos_B_index" ON "_ExcursaoPassageirosToExcursaoQuartos"("B");

-- AddForeignKey
ALTER TABLE "_ExcursaoPassageirosToExcursaoQuartos" ADD CONSTRAINT "_ExcursaoPassageirosToExcursaoQuartos_A_fkey" FOREIGN KEY ("A") REFERENCES "ExcursaoPassageiros"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoPassageirosToExcursaoQuartos" ADD CONSTRAINT "_ExcursaoPassageirosToExcursaoQuartos_B_fkey" FOREIGN KEY ("B") REFERENCES "ExcursaoQuartos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
