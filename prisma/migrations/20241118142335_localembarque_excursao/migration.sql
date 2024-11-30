-- AlterTable
ALTER TABLE "LocalEmbarque" ADD COLUMN     "excursaoId" TEXT;

-- AddForeignKey
ALTER TABLE "LocalEmbarque" ADD CONSTRAINT "LocalEmbarque_excursaoId_fkey" FOREIGN KEY ("excursaoId") REFERENCES "Excursao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
