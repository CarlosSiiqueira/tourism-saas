/*
  Warnings:

  - You are about to drop the column `codigoEndereco` on the `Destinos` table. All the data in the column will be lost.
  - You are about to drop the column `usuarioCadastro` on the `Destinos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Destinos" DROP CONSTRAINT "Destinos_codigoEndereco_fkey";

-- DropForeignKey
ALTER TABLE "Destinos" DROP CONSTRAINT "Destinos_usuarioCadastro_fkey";

-- DropForeignKey
ALTER TABLE "Pacotes" DROP CONSTRAINT "Pacotes_codigoDestino_fkey";

-- AlterTable
ALTER TABLE "Destinos" DROP COLUMN "codigoEndereco",
DROP COLUMN "usuarioCadastro";

-- AlterTable
ALTER TABLE "Pacotes" ALTER COLUMN "codigoDestino" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_codigoDestino_fkey" FOREIGN KEY ("codigoDestino") REFERENCES "Destinos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
