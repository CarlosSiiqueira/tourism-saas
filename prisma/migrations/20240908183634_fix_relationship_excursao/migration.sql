/*
  Warnings:

  - You are about to drop the column `pessoasId` on the `ExcursaoOnibus` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcursaoOnibus" DROP CONSTRAINT "ExcursaoOnibus_pessoasId_fkey";

-- AlterTable
ALTER TABLE "ExcursaoOnibus" DROP COLUMN "pessoasId";
