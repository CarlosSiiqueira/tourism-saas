/*
  Warnings:

  - Added the required column `rotina` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "rotina" TEXT NOT NULL;
