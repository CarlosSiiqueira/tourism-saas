/*
  Warnings:

  - You are about to drop the `ExcursaoEmbarque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExcursaoEmbarqueToLocalEmbarque` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ExcursaoEmbarqueToPessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcursaoEmbarque" DROP CONSTRAINT "ExcursaoEmbarque_codigoExcursao_fkey";

-- DropForeignKey
ALTER TABLE "ExcursaoEmbarque" DROP CONSTRAINT "ExcursaoEmbarque_usuarioCadastro_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoEmbarqueToLocalEmbarque" DROP CONSTRAINT "_ExcursaoEmbarqueToLocalEmbarque_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoEmbarqueToLocalEmbarque" DROP CONSTRAINT "_ExcursaoEmbarqueToLocalEmbarque_B_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoEmbarqueToPessoas" DROP CONSTRAINT "_ExcursaoEmbarqueToPessoas_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExcursaoEmbarqueToPessoas" DROP CONSTRAINT "_ExcursaoEmbarqueToPessoas_B_fkey";

-- DropTable
DROP TABLE "ExcursaoEmbarque";

-- DropTable
DROP TABLE "_ExcursaoEmbarqueToLocalEmbarque";

-- DropTable
DROP TABLE "_ExcursaoEmbarqueToPessoas";

-- CreateTable
CREATE TABLE "PassageiroEmbarque" (
    "id" TEXT NOT NULL,
    "embarcou" BOOLEAN NOT NULL DEFAULT false,
    "horaEmbarque" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoExcursao" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "PassageiroEmbarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LocalEmbarqueToPassageiroEmbarque" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PassageiroEmbarqueToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocalEmbarqueToPassageiroEmbarque_AB_unique" ON "_LocalEmbarqueToPassageiroEmbarque"("A", "B");

-- CreateIndex
CREATE INDEX "_LocalEmbarqueToPassageiroEmbarque_B_index" ON "_LocalEmbarqueToPassageiroEmbarque"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PassageiroEmbarqueToPessoas_AB_unique" ON "_PassageiroEmbarqueToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_PassageiroEmbarqueToPessoas_B_index" ON "_PassageiroEmbarqueToPessoas"("B");

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PassageiroEmbarque" ADD CONSTRAINT "PassageiroEmbarque_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocalEmbarqueToPassageiroEmbarque" ADD CONSTRAINT "_LocalEmbarqueToPassageiroEmbarque_A_fkey" FOREIGN KEY ("A") REFERENCES "LocalEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocalEmbarqueToPassageiroEmbarque" ADD CONSTRAINT "_LocalEmbarqueToPassageiroEmbarque_B_fkey" FOREIGN KEY ("B") REFERENCES "PassageiroEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassageiroEmbarqueToPessoas" ADD CONSTRAINT "_PassageiroEmbarqueToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "PassageiroEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PassageiroEmbarqueToPessoas" ADD CONSTRAINT "_PassageiroEmbarqueToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
