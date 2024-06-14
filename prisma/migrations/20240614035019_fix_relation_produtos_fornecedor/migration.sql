-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_codigoFornecedor_fkey" FOREIGN KEY ("codigoFornecedor") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
