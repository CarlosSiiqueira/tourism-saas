-- AlterTable
ALTER TABLE "Imagens" ADD COLUMN     "pacotesId" TEXT;

-- AddForeignKey
ALTER TABLE "Imagens" ADD CONSTRAINT "Imagens_pacotesId_fkey" FOREIGN KEY ("pacotesId") REFERENCES "Pacotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
