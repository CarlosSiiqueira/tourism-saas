/*
  Warnings:

  - You are about to drop the column `status` on the `Usuarios` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "status",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;
