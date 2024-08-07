/*
  Warnings:

  - Added the required column `codigoSubCategoria` to the `CategoriaTransacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CategoriaTransacao" ADD COLUMN     "codigoSubCategoria" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SubCategoriaTransacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoUsuario" TEXT NOT NULL,

    CONSTRAINT "SubCategoriaTransacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservas" (
    "id" TEXT NOT NULL,
    "reserva" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoUsuario" TEXT,
    "codigoFinanceiro" TEXT NOT NULL,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CategoriaTransacao" ADD CONSTRAINT "CategoriaTransacao_codigoSubCategoria_fkey" FOREIGN KEY ("codigoSubCategoria") REFERENCES "SubCategoriaTransacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubCategoriaTransacao" ADD CONSTRAINT "SubCategoriaTransacao_codigoUsuario_fkey" FOREIGN KEY ("codigoUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_codigoUsuario_fkey" FOREIGN KEY ("codigoUsuario") REFERENCES "Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_codigoFinanceiro_fkey" FOREIGN KEY ("codigoFinanceiro") REFERENCES "Transacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
