-- CreateTable
CREATE TABLE "ExcursaoPassageiros" (
    "id" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idExcursao" TEXT NOT NULL,
    "idPassageiro" TEXT NOT NULL,
    "localEmbarque" TEXT NOT NULL,

    CONSTRAINT "ExcursaoPassageiros_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExcursaoPassageiros" ADD CONSTRAINT "ExcursaoPassageiros_idExcursao_fkey" FOREIGN KEY ("idExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoPassageiros" ADD CONSTRAINT "ExcursaoPassageiros_idPassageiro_fkey" FOREIGN KEY ("idPassageiro") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoPassageiros" ADD CONSTRAINT "ExcursaoPassageiros_localEmbarque_fkey" FOREIGN KEY ("localEmbarque") REFERENCES "LocalEmbarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
