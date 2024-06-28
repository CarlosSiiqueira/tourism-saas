/*
  Warnings:

  - Added the required column `dataPrevistaRecebimento` to the `Transacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transacoes" ADD COLUMN     "dataPrevistaRecebimento" TIMESTAMP(3) NOT NULL;
