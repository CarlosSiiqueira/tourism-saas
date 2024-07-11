/*
  Warnings:

  - You are about to drop the column `urlImgESgotado` on the `Pacotes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pacotes" DROP COLUMN "urlImgESgotado",
ADD COLUMN     "urlImgEsgotado" TEXT;
