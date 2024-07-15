/*
  Warnings:

  - You are about to drop the column `horaPrevista` on the `LocalEmbarque` table. All the data in the column will be lost.
  - Made the column `horaEmbarque` on table `LocalEmbarque` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LocalEmbarque" DROP COLUMN "horaPrevista",
ALTER COLUMN "horaEmbarque" SET NOT NULL;
