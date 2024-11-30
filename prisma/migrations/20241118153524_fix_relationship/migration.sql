/*
  Warnings:

  - You are about to drop the column `excursaoId` on the `LocalEmbarque` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LocalEmbarque" DROP CONSTRAINT "LocalEmbarque_excursaoId_fkey";

-- AlterTable
ALTER TABLE "LocalEmbarque" DROP COLUMN "excursaoId";

-- CreateTable
CREATE TABLE "_ExcursaoToLocalEmbarque" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoToLocalEmbarque_AB_unique" ON "_ExcursaoToLocalEmbarque"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoToLocalEmbarque_B_index" ON "_ExcursaoToLocalEmbarque"("B");

-- AddForeignKey
ALTER TABLE "_ExcursaoToLocalEmbarque" ADD CONSTRAINT "_ExcursaoToLocalEmbarque_A_fkey" FOREIGN KEY ("A") REFERENCES "Excursao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoToLocalEmbarque" ADD CONSTRAINT "_ExcursaoToLocalEmbarque_B_fkey" FOREIGN KEY ("B") REFERENCES "LocalEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;
