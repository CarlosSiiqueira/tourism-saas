-- DropForeignKey
ALTER TABLE "Transacoes" DROP CONSTRAINT "Transacoes_codigoFornecedor_fkey";

-- AlterTable
ALTER TABLE "Transacoes" ALTER COLUMN "codigoFornecedor" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoFornecedor_fkey" FOREIGN KEY ("codigoFornecedor") REFERENCES "Fornecedor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
