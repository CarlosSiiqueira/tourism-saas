/*
  Warnings:

  - You are about to drop the column `codigoPassageiro` on the `Excursao` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Excursao" DROP CONSTRAINT "Excursao_codigoPassageiro_fkey";

-- AlterTable
ALTER TABLE "Excursao" DROP COLUMN "codigoPassageiro";

-- AlterTable
ALTER TABLE "Vendas" ADD COLUMN     "origem" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "_ExcursaoToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoToPessoas_AB_unique" ON "_ExcursaoToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoToPessoas_B_index" ON "_ExcursaoToPessoas"("B");

-- AddForeignKey
ALTER TABLE "_ExcursaoToPessoas" ADD CONSTRAINT "_ExcursaoToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "Excursao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoToPessoas" ADD CONSTRAINT "_ExcursaoToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
