-- CreateTable
CREATE TABLE "Configuracoes" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "configuracao" JSONB NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUsuario" TEXT NOT NULL,

    CONSTRAINT "Configuracoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comissao" (
    "id" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idTransacao" TEXT NOT NULL,
    "usuariosId" TEXT NOT NULL,

    CONSTRAINT "Comissao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Configuracoes" ADD CONSTRAINT "Configuracoes_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comissao" ADD CONSTRAINT "Comissao_idTransacao_fkey" FOREIGN KEY ("idTransacao") REFERENCES "Transacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comissao" ADD CONSTRAINT "Comissao_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
