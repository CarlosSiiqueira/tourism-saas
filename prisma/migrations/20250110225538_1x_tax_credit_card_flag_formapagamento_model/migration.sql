-- AlterTable
ALTER TABLE "FormaPagamento" ADD COLUMN     "creditCard" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taxa1x" DOUBLE PRECISION;
