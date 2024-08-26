-- CreateTable
CREATE TABLE "CreditoClientes" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pessoasId" TEXT NOT NULL,
    "idReserva" TEXT NOT NULL,
    "usuariosId" TEXT NOT NULL,

    CONSTRAINT "CreditoClientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditoClientes" ADD CONSTRAINT "CreditoClientes_pessoasId_fkey" FOREIGN KEY ("pessoasId") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditoClientes" ADD CONSTRAINT "CreditoClientes_idReserva_fkey" FOREIGN KEY ("idReserva") REFERENCES "Reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditoClientes" ADD CONSTRAINT "CreditoClientes_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
