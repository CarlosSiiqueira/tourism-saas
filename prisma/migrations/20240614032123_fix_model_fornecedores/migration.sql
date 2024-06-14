/*
  Warnings:

  - You are about to drop the column `codigoPessoa` on the `Fornecedor` table. All the data in the column will be lost.
  - You are about to drop the column `produtosId` on the `Fornecedor` table. All the data in the column will be lost.
  - Added the required column `email` to the `Fornecedor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fornecedor" DROP CONSTRAINT "Fornecedor_codigoPessoa_fkey";

-- DropForeignKey
ALTER TABLE "Fornecedor" DROP CONSTRAINT "Fornecedor_produtosId_fkey";

-- AlterTable
ALTER TABLE "Fornecedor" DROP COLUMN "codigoPessoa",
DROP COLUMN "produtosId",
ADD COLUMN     "contato" TEXT,
ADD COLUMN     "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "observacoes" TEXT,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "telefoneContato" TEXT;
