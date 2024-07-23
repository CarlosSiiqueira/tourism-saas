-- DropForeignKey
ALTER TABLE "Transacoes" DROP CONSTRAINT "Transacoes_codigoPessoa_fkey";

-- AlterTable
ALTER TABLE "Transacoes" ALTER COLUMN "codigoPessoa" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoPessoa_fkey" FOREIGN KEY ("codigoPessoa") REFERENCES "Pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
