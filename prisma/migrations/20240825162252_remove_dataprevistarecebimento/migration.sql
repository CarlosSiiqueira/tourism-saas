/*
  Warnings:

  - You are about to drop the column `codigoDestino` on the `Pacotes` table. All the data in the column will be lost.
  - You are about to drop the column `dataPrevistaRecebimento` on the `Transacoes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pacotes" DROP CONSTRAINT "Pacotes_codigoDestino_fkey";

-- AlterTable
ALTER TABLE "Excursao" ADD COLUMN     "concluida" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pacotes" DROP COLUMN "codigoDestino";

-- AlterTable
ALTER TABLE "Transacoes" DROP COLUMN "dataPrevistaRecebimento";
