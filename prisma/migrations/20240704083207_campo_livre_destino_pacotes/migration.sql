/*
  Warnings:

  - Added the required column `destino` to the `Pacotes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pacotes" ADD COLUMN     "destino" TEXT NOT NULL;
