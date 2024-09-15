-- CreateTable
CREATE TABLE "OpcionaisEmbarque" (
    "id" TEXT NOT NULL,
    "embarcou" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) NOT NULL,
    "idOpcional" TEXT NOT NULL,
    "idPassageiro" TEXT NOT NULL,

    CONSTRAINT "OpcionaisEmbarque_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OpcionaisEmbarque" ADD CONSTRAINT "OpcionaisEmbarque_idOpcional_fkey" FOREIGN KEY ("idOpcional") REFERENCES "Opcionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpcionaisEmbarque" ADD CONSTRAINT "OpcionaisEmbarque_idPassageiro_fkey" FOREIGN KEY ("idPassageiro") REFERENCES "ExcursaoPassageiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
