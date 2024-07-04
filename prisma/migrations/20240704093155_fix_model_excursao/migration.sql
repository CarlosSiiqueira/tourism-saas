/*
  Warnings:

  - You are about to drop the `_ExcursaoToPessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ExcursaoToPessoas" DROP CONSTRAINT "_ExcursaoToPessoas_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoToPessoas" DROP CONSTRAINT "_ExcursaoToPessoas_B_fkey";

-- DropTable
DROP TABLE "_ExcursaoToPessoas";
