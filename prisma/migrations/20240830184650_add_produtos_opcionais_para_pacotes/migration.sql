-- CreateTable
CREATE TABLE "_PacotesToProdutos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PacotesToProdutos_AB_unique" ON "_PacotesToProdutos"("A", "B");

-- CreateIndex
CREATE INDEX "_PacotesToProdutos_B_index" ON "_PacotesToProdutos"("B");

-- AddForeignKey
ALTER TABLE "_PacotesToProdutos" ADD CONSTRAINT "_PacotesToProdutos_A_fkey" FOREIGN KEY ("A") REFERENCES "Pacotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PacotesToProdutos" ADD CONSTRAINT "_PacotesToProdutos_B_fkey" FOREIGN KEY ("B") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
