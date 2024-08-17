/*
  Warnings:

  - Added the required column `localEmbarqueId` to the `Reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservas" ADD COLUMN     "localEmbarqueId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_localEmbarqueId_fkey" FOREIGN KEY ("localEmbarqueId") REFERENCES "LocalEmbarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
