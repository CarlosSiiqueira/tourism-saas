-- AlterTable
ALTER TABLE "Pessoas" ADD COLUMN     "emissor" TEXT;

-- CreateTable
CREATE TABLE "_ProdutosToReservas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProdutosToReservas_AB_unique" ON "_ProdutosToReservas"("A", "B");

-- CreateIndex
CREATE INDEX "_ProdutosToReservas_B_index" ON "_ProdutosToReservas"("B");

-- AddForeignKey
ALTER TABLE "_ProdutosToReservas" ADD CONSTRAINT "_ProdutosToReservas_A_fkey" FOREIGN KEY ("A") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutosToReservas" ADD CONSTRAINT "_ProdutosToReservas_B_fkey" FOREIGN KEY ("B") REFERENCES "Reservas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
