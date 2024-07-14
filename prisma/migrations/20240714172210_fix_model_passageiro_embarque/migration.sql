/*
  Warnings:

  - You are about to drop the `_LocalEmbarqueToPassageiroEmbarque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PassageiroEmbarqueToPessoas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `codigoPassageiro` to the `PassageiroEmbarque` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_LocalEmbarqueToPassageiroEmbarque" DROP CONSTRAINT "_LocalEmbarqueToPassageiroEmbarque_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocalEmbarqueToPassageiroEmbarque" DROP CONSTRAINT "_LocalEmbarqueToPassageiroEmbarque_B_fkey";

-- DropForeignKey
ALTER TABLE "_PassageiroEmbarqueToPessoas" DROP CONSTRAINT "_PassageiroEmbarqueToPessoas_A_fkey";

-- DropForeignKey
ALTER TABLE "_PassageiroEmbarqueToPessoas" DROP CONSTRAINT "_PassageiroEmbarqueToPessoas_B_fkey";

-- AlterTable
ALTER TABLE "PassageiroEmbarque" ADD COLUMN     "codigoLocalEmbarque" TEXT,
ADD COLUMN     "codigoPassageiro" TEXT NOT NULL;

-- DropTable
DROP TABLE "_LocalEmbarqueToPassageiroEmbarque";

-- DropTable
DROP TABLE "_PassageiroEmbarqueToPessoas";

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_codigoLocalEmbarque_fkey" FOREIGN KEY ("codigoLocalEmbarque") REFERENCES "LocalEmbarque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
