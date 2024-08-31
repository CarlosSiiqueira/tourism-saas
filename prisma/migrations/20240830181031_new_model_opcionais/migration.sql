/*
  Warnings:

  - You are about to drop the `_ProdutosToReservas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProdutosToReservas" DROP CONSTRAINT "_ProdutosToReservas_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProdutosToReservas" DROP CONSTRAINT "_ProdutosToReservas_B_fkey";

-- DropTable
DROP TABLE "_ProdutosToReservas";

-- CreateTable
CREATE TABLE "Opcionais" (
    "id" TEXT NOT NULL,
    "qtd" INTEGER NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idReserva" TEXT NOT NULL,
    "idProduto" TEXT NOT NULL,
    "codigoUsuario" TEXT NOT NULL,

    CONSTRAINT "Opcionais_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opcionais" ADD CONSTRAINT "Opcionais_idReserva_fkey" FOREIGN KEY ("idReserva") REFERENCES "Reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcionais" ADD CONSTRAINT "Opcionais_idProduto_fkey" FOREIGN KEY ("idProduto") REFERENCES "Produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opcionais" ADD CONSTRAINT "Opcionais_codigoUsuario_fkey" FOREIGN KEY ("codigoUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
