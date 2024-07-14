/*
  Warnings:

  - Added the required column `reserva` to the `ExcursaoPassageiros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExcursaoPassageiros" ADD COLUMN     "reserva" TEXT NOT NULL;
