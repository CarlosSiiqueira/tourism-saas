/*
  Warnings:

  - Added the required column `desconto` to the `Reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservas" ADD COLUMN     "desconto" INTEGER NOT NULL;
