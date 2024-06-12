/*
  Warnings:

  - You are about to drop the column `status` on the `Transacoes` table. All the data in the column will be lost.
  - Added the required column `ativo` to the `Transacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transacoes" DROP COLUMN "status",
ADD COLUMN     "ativo" BOOLEAN NOT NULL;
