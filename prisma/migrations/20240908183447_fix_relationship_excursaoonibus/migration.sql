-- DropForeignKey
ALTER TABLE "ExcursaoOnibus" DROP CONSTRAINT "ExcursaoOnibus_codigoPassageiro_fkey";

-- AlterTable
ALTER TABLE "ExcursaoOnibus" ADD COLUMN     "pessoasId" TEXT;

-- AddForeignKey
ALTER TABLE "ExcursaoOnibus" ADD CONSTRAINT "ExcursaoOnibus_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "ExcursaoPassageiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoOnibus" ADD CONSTRAINT "ExcursaoOnibus_pessoasId_fkey" FOREIGN KEY ("pessoasId") REFERENCES "Pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
