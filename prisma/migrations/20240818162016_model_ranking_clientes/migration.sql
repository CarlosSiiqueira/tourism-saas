-- AlterTable
ALTER TABLE "Pessoas" ADD COLUMN     "rankingClientesId" TEXT;

-- CreateTable
CREATE TABLE "RankingClientes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "qtdMinViagens" INTEGER NOT NULL,
    "qtdMaxViagens" INTEGER NOT NULL,
    "usuariosId" TEXT NOT NULL,

    CONSTRAINT "RankingClientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pessoas" ADD CONSTRAINT "Pessoas_rankingClientesId_fkey" FOREIGN KEY ("rankingClientesId") REFERENCES "RankingClientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingClientes" ADD CONSTRAINT "RankingClientes_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
