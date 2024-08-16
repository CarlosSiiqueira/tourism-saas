/*
  Warnings:

  - You are about to drop the column `codigoFinanceiro` on the `Reservas` table. All the data in the column will be lost.
  - The `reserva` column on the `Reservas` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `idExcursao` to the `Reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reservas" DROP CONSTRAINT "Reservas_codigoFinanceiro_fkey";

-- AlterTable
ALTER TABLE "Reservas" DROP COLUMN "codigoFinanceiro",
ADD COLUMN     "idExcursao" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "reserva",
ADD COLUMN     "reserva" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Transacoes" ADD COLUMN     "idReserva" TEXT;

-- CreateTable
CREATE TABLE "_PessoasToReservas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PessoasToReservas_AB_unique" ON "_PessoasToReservas"("A", "B");

-- CreateIndex
CREATE INDEX "_PessoasToReservas_B_index" ON "_PessoasToReservas"("B");

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_idReserva_fkey" FOREIGN KEY ("idReserva") REFERENCES "Reservas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_idExcursao_fkey" FOREIGN KEY ("idExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoasToReservas" ADD CONSTRAINT "_PessoasToReservas_A_fkey" FOREIGN KEY ("A") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoasToReservas" ADD CONSTRAINT "_PessoasToReservas_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
