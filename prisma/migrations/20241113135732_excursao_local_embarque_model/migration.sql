-- AlterTable
ALTER TABLE "LocalEmbarque" ADD COLUMN     "excursaoLocalEmbarqueId" TEXT;

-- CreateTable
CREATE TABLE "ExcursaoLocalEmbarque" (
    "id" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idExcursao" TEXT NOT NULL,

    CONSTRAINT "ExcursaoLocalEmbarque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LocalEmbarque" ADD CONSTRAINT "LocalEmbarque_excursaoLocalEmbarqueId_fkey" FOREIGN KEY ("excursaoLocalEmbarqueId") REFERENCES "ExcursaoLocalEmbarque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoLocalEmbarque" ADD CONSTRAINT "ExcursaoLocalEmbarque_idExcursao_fkey" FOREIGN KEY ("idExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
