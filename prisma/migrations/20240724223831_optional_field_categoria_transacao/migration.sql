-- DropForeignKey
ALTER TABLE "Transacoes" DROP CONSTRAINT "Transacoes_codigoCategoria_fkey";

-- AlterTable
ALTER TABLE "Transacoes" ALTER COLUMN "codigoCategoria" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoCategoria_fkey" FOREIGN KEY ("codigoCategoria") REFERENCES "CategoriaTransacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
