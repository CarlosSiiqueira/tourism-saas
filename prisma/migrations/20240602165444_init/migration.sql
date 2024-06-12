-- CreateTable
CREATE TABLE "Pessoas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "telefone" TEXT,
    "telefoneWpp" TEXT,
    "email" TEXT NOT NULL,
    "contato" TEXT,
    "telefoneContato" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataNascimento" TIMESTAMP(3),
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCadastro" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "comissao" DOUBLE PRECISION,
    "meta" DOUBLE PRECISION,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pacotes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" INTEGER NOT NULL DEFAULT 1,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" INTEGER NOT NULL DEFAULT 1,
    "codigoLocalEmbarque" TEXT NOT NULL,
    "codigoDestino" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Pacotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormaPagamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "taxa" DOUBLE PRECISION NOT NULL,
    "qtdDiasRecebimento" INTEGER NOT NULL,
    "ativo" INTEGER NOT NULL DEFAULT 1,
    "codigoContaBancaria" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "FormaPagamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContaBancaria" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" INTEGER NOT NULL DEFAULT 1,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "ContaBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "estoque" INTEGER NOT NULL,
    "dataCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataCadastro" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "codigoFornecedor" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcursaoQuartos" (
    "id" TEXT NOT NULL,
    "numeroQuarto" INTEGER NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoExcursao" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "ExcursaoQuartos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcursaoOnibus" (
    "id" TEXT NOT NULL,
    "numeroCadeira" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoPassageiro" TEXT NOT NULL,
    "codigoExcursao" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "ExcursaoOnibus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocalEmbarque" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "horaEmbarque" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoEndereco" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "LocalEmbarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcursaoEmbarque" (
    "id" TEXT NOT NULL,
    "embarcou" BOOLEAN NOT NULL DEFAULT false,
    "horaEmbarque" TEXT NOT NULL,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigoExcursao" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "ExcursaoEmbarque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Excursao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "gerouFinanceiro" BOOLEAN NOT NULL DEFAULT false,
    "vagas" INTEGER NOT NULL,
    "codigoPassageiro" TEXT NOT NULL,
    "codigoPacote" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Excursao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendas" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "tipo" INTEGER NOT NULL,
    "qtd" INTEGER NOT NULL,
    "codigoCliente" TEXT NOT NULL,
    "codigoFormaPagamento" TEXT NOT NULL,
    "codigoProduto" TEXT,
    "codigoPacote" TEXT,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Vendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destinos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataCadastro" TIMESTAMP(3) NOT NULL,
    "codigoEndereco" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Destinos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transacoes" (
    "id" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "vistoAdmin" BOOLEAN NOT NULL DEFAULT false,
    "data" TIMESTAMP(3) NOT NULL,
    "efetivado" BOOLEAN NOT NULL DEFAULT false,
    "observacao" TEXT,
    "status" BOOLEAN NOT NULL,
    "numeroComprovanteBancario" TEXT,
    "codigoPessoa" TEXT NOT NULL,
    "codigoFornecedor" TEXT NOT NULL,
    "codigoExcursao" TEXT,
    "codigoProduto" TEXT,
    "codigoPacote" TEXT,
    "codigoFormaPagamento" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,

    CONSTRAINT "Transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fornecedor" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "site" TEXT,
    "codigoPessoa" TEXT NOT NULL,
    "codigoEndereco" TEXT NOT NULL,
    "usuarioCadastro" TEXT NOT NULL,
    "produtosId" TEXT,

    CONSTRAINT "Fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnderecoToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcursaoQuartosToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcursaoEmbarqueToLocalEmbarque" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExcursaoEmbarqueToPessoas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EnderecoToPessoas_AB_unique" ON "_EnderecoToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_EnderecoToPessoas_B_index" ON "_EnderecoToPessoas"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoQuartosToPessoas_AB_unique" ON "_ExcursaoQuartosToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoQuartosToPessoas_B_index" ON "_ExcursaoQuartosToPessoas"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoEmbarqueToLocalEmbarque_AB_unique" ON "_ExcursaoEmbarqueToLocalEmbarque"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoEmbarqueToLocalEmbarque_B_index" ON "_ExcursaoEmbarqueToLocalEmbarque"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExcursaoEmbarqueToPessoas_AB_unique" ON "_ExcursaoEmbarqueToPessoas"("A", "B");

-- CreateIndex
CREATE INDEX "_ExcursaoEmbarqueToPessoas_B_index" ON "_ExcursaoEmbarqueToPessoas"("B");

-- AddForeignKey
ALTER TABLE "Pessoas" ADD CONSTRAINT "Pessoas_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_codigoLocalEmbarque_fkey" FOREIGN KEY ("codigoLocalEmbarque") REFERENCES "LocalEmbarque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_codigoDestino_fkey" FOREIGN KEY ("codigoDestino") REFERENCES "Destinos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pacotes" ADD CONSTRAINT "Pacotes_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormaPagamento" ADD CONSTRAINT "FormaPagamento_codigoContaBancaria_fkey" FOREIGN KEY ("codigoContaBancaria") REFERENCES "ContaBancaria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormaPagamento" ADD CONSTRAINT "FormaPagamento_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContaBancaria" ADD CONSTRAINT "ContaBancaria_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoQuartos" ADD CONSTRAINT "ExcursaoQuartos_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoQuartos" ADD CONSTRAINT "ExcursaoQuartos_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoOnibus" ADD CONSTRAINT "ExcursaoOnibus_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoOnibus" ADD CONSTRAINT "ExcursaoOnibus_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoOnibus" ADD CONSTRAINT "ExcursaoOnibus_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalEmbarque" ADD CONSTRAINT "LocalEmbarque_codigoEndereco_fkey" FOREIGN KEY ("codigoEndereco") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalEmbarque" ADD CONSTRAINT "LocalEmbarque_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoEmbarque" ADD CONSTRAINT "ExcursaoEmbarque_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcursaoEmbarque" ADD CONSTRAINT "ExcursaoEmbarque_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excursao" ADD CONSTRAINT "Excursao_codigoPassageiro_fkey" FOREIGN KEY ("codigoPassageiro") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excursao" ADD CONSTRAINT "Excursao_codigoPacote_fkey" FOREIGN KEY ("codigoPacote") REFERENCES "Pacotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Excursao" ADD CONSTRAINT "Excursao_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_codigoCliente_fkey" FOREIGN KEY ("codigoCliente") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_codigoFormaPagamento_fkey" FOREIGN KEY ("codigoFormaPagamento") REFERENCES "FormaPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_codigoProduto_fkey" FOREIGN KEY ("codigoProduto") REFERENCES "Produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_codigoPacote_fkey" FOREIGN KEY ("codigoPacote") REFERENCES "Pacotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendas" ADD CONSTRAINT "Vendas_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinos" ADD CONSTRAINT "Destinos_codigoEndereco_fkey" FOREIGN KEY ("codigoEndereco") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Destinos" ADD CONSTRAINT "Destinos_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoPessoa_fkey" FOREIGN KEY ("codigoPessoa") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoFornecedor_fkey" FOREIGN KEY ("codigoFornecedor") REFERENCES "Fornecedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoExcursao_fkey" FOREIGN KEY ("codigoExcursao") REFERENCES "Excursao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoProduto_fkey" FOREIGN KEY ("codigoProduto") REFERENCES "Produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoPacote_fkey" FOREIGN KEY ("codigoPacote") REFERENCES "Pacotes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_codigoFormaPagamento_fkey" FOREIGN KEY ("codigoFormaPagamento") REFERENCES "FormaPagamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacoes" ADD CONSTRAINT "Transacoes_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_codigoPessoa_fkey" FOREIGN KEY ("codigoPessoa") REFERENCES "Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_codigoEndereco_fkey" FOREIGN KEY ("codigoEndereco") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_usuarioCadastro_fkey" FOREIGN KEY ("usuarioCadastro") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fornecedor" ADD CONSTRAINT "Fornecedor_produtosId_fkey" FOREIGN KEY ("produtosId") REFERENCES "Produtos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnderecoToPessoas" ADD CONSTRAINT "_EnderecoToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "Endereco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnderecoToPessoas" ADD CONSTRAINT "_EnderecoToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" ADD CONSTRAINT "_ExcursaoQuartosToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "ExcursaoQuartos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoQuartosToPessoas" ADD CONSTRAINT "_ExcursaoQuartosToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoEmbarqueToLocalEmbarque" ADD CONSTRAINT "_ExcursaoEmbarqueToLocalEmbarque_A_fkey" FOREIGN KEY ("A") REFERENCES "ExcursaoEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoEmbarqueToLocalEmbarque" ADD CONSTRAINT "_ExcursaoEmbarqueToLocalEmbarque_B_fkey" FOREIGN KEY ("B") REFERENCES "LocalEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoEmbarqueToPessoas" ADD CONSTRAINT "_ExcursaoEmbarqueToPessoas_A_fkey" FOREIGN KEY ("A") REFERENCES "ExcursaoEmbarque"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExcursaoEmbarqueToPessoas" ADD CONSTRAINT "_ExcursaoEmbarqueToPessoas_B_fkey" FOREIGN KEY ("B") REFERENCES "Pessoas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
