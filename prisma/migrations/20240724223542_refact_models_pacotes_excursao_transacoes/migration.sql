/*
  Warnings:

  - You are about to drop the column `codigoContaBancaria` on the `FormaPagamento` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Pacotes` table. All the data in the column will be lost.
  - Added the required column `valor` to the `Excursao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoCategoria` to the `Transacoes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormaPagamento" DROP CONSTRAINT "FormaPagamento_codigoContaBancaria_fkey";

-- AlterTable
ALTER TABLE "Excursao" ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ExcursaoQuartos" ADD COLUMN     "idTipoQuarto" TEXT;

-- AlterTable
ALTER TABLE "FormaPagamento" DROP COLUMN "codigoContaBancaria",
ADD COLUMN     "contaBancariaId" TEXT;

-- AlterTable
ALTER TABLE "Pacotes" DROP COLUMN "valor";

-- AlterTable
ALTER TABLE "Transacoes" ADD COLUMN     "codigoCategoria" TEXT NOT NULL,
ADD COLUMN     "codigoContaBancaria" TEXT,
ALTER COLUMN "data" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "CategoriaTransacao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoUsuario" TEXT NOT NULL,

    CONSTRAINT "CategoriaTransacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoQuarto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoUsuario" TEXT NOT NULL,

    CONSTRAINT "TipoQuarto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormaPagamento" ADD CONSTRAINT "FormaPagamento_contaBancariaId_fkey" FOREIGN KEY ("contaBancariaId") REFERENCES "ContaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoQuartos" ADD CONSTRAINT "ExcursaoQuartos_idTipoQuarto_fkey" FOREIGN KEY ("idTipoQuarto") REFERENCES "TipoQuarto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoCategoria_fkey" FOREIGN KEY ("codigoCategoria") REFERENCES "CategoriaTransacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoContaBancaria_fkey" FOREIGN KEY ("codigoContaBancaria") REFERENCES "ContaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriaTransacao" ADD CONSTRAINT "CategoriaTransacao_codigoUsuario_fkey" FOREIGN KEY ("codigoUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoQuarto" ADD CONSTRAINT "TipoQuarto_codigoUsuario_fkey" FOREIGN KEY ("codigoUsuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
