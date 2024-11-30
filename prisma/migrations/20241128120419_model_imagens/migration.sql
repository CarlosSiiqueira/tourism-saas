-- CreateTable
CREATE TABLE "Imagens" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dataUpload" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Imagens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_urlImagem_fkey" FOREIGN KEY ("urlImagem") REFERENCES "Imagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_urlImgEsgotado_fkey" FOREIGN KEY ("urlImgEsgotado") REFERENCES "Imagens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imagens" ADD CONSTRAINT "Imagens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
