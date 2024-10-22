export const cpfMask = (cpf: string): string =>
  cpf
    .replace(/[^0-9]/g, "")
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");

export const cnpjMask = (cnpj: string): string =>
  cnpj
    .replace(/[^0-9]/g, "")
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");

export const phoneMask = (phone: string): string => {
  // Remova todos os caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, "");

  // Verifica se o telefone é celular ou fixo
  if (numericPhone.length === 11) {
    // Formato para celular: (XX) 9XXXX-XXXX
    return numericPhone.replace(
      /(\d{2})(\d{1})(\d{4})(\d{4})/,
      "($1) $2 $3-$4",
    );
  } else if (numericPhone.length === 10) {
    // Formato para telefone fixo: (XX) XXXX-XXXX
    return numericPhone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    // Se não for possível determinar o formato, retornar o número original
    return phone;
  }
};

export const currencyBRLFormat = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value)
}