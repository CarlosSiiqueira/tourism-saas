-- DropForeignKey
ALTER TABLE "PassageiroEmbarque" DROP CONSTRAINT "PassageiroEmbarque_codigoPassageiro_fkey";

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "ExcursaoPassageiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
