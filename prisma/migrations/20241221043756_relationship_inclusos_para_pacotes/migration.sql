-- CreateTable
CREATE TABLE "_inclusos" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_inclusos_AB_unique" ON "_inclusos"("A", "B");

-- CreateIndex
CREATE INDEX "_inclusos_B_index" ON "_inclusos"("B");

-- AddForeignKey
ALTER TABLE "_inclusos" ADD CONSTRAINT "_inclusos_A_fkey" FOREIGN KEY ("A") REFERENCES "Pacotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_inclusos" ADD CONSTRAINT "_inclusos_B_fkey" FOREIGN KEY ("B") REFERENCES "Produtos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
