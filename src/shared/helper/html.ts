import QRCode from 'qrcode';
import { IReservaResponse } from '../../app/interfaces/Reserva';
import { formattingDate } from './date';
import { cpfMask, currencyBRLFormat, phoneMask } from './fieldMask';

export const htmlTicket = async (data: IReservaResponse): Promise<string> => {

    let qrCodeUrl = ''
    let ticketHtml = ''
    let opcionaisHtml = 'Sem Opcionais'

    if (data.Opcionais.length) {
        opcionaisHtml = '<br>'
        data.Opcionais.map((opcional) => {
            opcionaisHtml += `${opcional.Produto.nome} <br>`
        })
    }

    ticketHtml += await Promise.all(
        data.ExcursaoPassageiros.map(async (passageiro) => {

            qrCodeUrl = await QRCode.toDataURL(`http://127.0.0.1:8000/passageiro-embarque/embarque-qrcode/${passageiro.id}/${data.Excursao.id}`);

            return `<div class="ticket-info">
                      <h3>Excursão para ${data.Excursao.nome}</h3>

                      <div class="details">
                          <div>
                              <p><strong>Nome:</strong> ${passageiro.Pessoa.nome}</p>
                              <p><strong>Telefone Para Contato:</strong> ${phoneMask(passageiro.Pessoa.telefoneWpp || '')}</p>
                              <p><strong>Órgão Emissor:</strong> ${passageiro.Pessoa.emissor}</p>
                              <p><strong>Local de Embarque:</strong> ${passageiro.LocalEmbarque.horaEmbarque} - ${passageiro.LocalEmbarque.nome}</p>
                              <p><strong>Opcionais:</strong>${opcionaisHtml}</p>
                          </div>
                          <div>
                              <p><strong>Classificação:</strong> Adultos (+12 anos)</p>
                              <p><strong>CPF:</strong> ${cpfMask(passageiro.Pessoa.cpf)}
                              <p><strong>RG:</strong> ${passageiro.Pessoa.rg}</p>
                          </div>
                      </div>

                      <div class="qr-code">
                          <div>
                              <p><strong>Data:</strong> ${formattingDate(data.Excursao.dataInicio.toDateString())}</p>
                              <p><strong>Ticket:</strong> ${data.id}</p>
                          </div>
                          <img src="${qrCodeUrl}" alt="QR Code">
                      </div>
                  </div>`
        })
    )

    return `<!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Improved Ticket</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          margin: 0;
                          padding: 20px;
                          background-color: #f9f9f9;
                      }
                      .container {
                          width: 700px;
                          margin: 0 auto;
                          background-color: white;
                          border: 1px solid #ddd;
                          padding: 20px;
                          box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                      }
                      .header {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          border-bottom: 1px solid #ddd;
                          padding-bottom: 15px;
                          margin-bottom: 15px;
                      }
                      .header img {
                          height: 50px;
                      }
                      .header .right {
                          text-align: right;
                      }
                      .header .right span {
                          display: block;
                      }
                      .approved {
                          color: green;
                          font-weight: bold;
                          font-size: 1.2em;
                      }
                      .ticket-info, .footer {
                          border-top: 1px solid #ddd;
                          padding-top: 15px;
                          margin-top: 15px;
                      }
                      .ticket-info h3 {
                          margin-bottom: 10px;
                          font-size: 1.2em;
                      }
                      .ticket-info .details {
                          display: flex;
                          justify-content: space-between;
                      }
                      .details div {
                          margin-bottom: 10px;
                      }
                      .qr-code {
                          display: flex;
                          justify-content: flex-end;
                          align-items: center;
                      }
                      .qr-code img {
                          width: 100px;
                          margin-left: 20px;
                      }
                      .footer {
                          display: flex;
                          justify-content: space-between;
                      }
                      .footer div {
                          margin-top: 10px;
                      }
                  </style>
              </head>
              <body>

              <div class="container">
                  <div class="header">
                      <div class="left">
                          <img src="${process.env.URL_LOGO_PRADOS}" alt="Company Logo">
                          <p>31.853.548 Emanuel Wallysson Aguiar do Prado<br>
                          Fortaleza, Ceará<br>
                          E-mail: financeiro@pradoturismo.com.br</p>
                      </div>
                      <div class="right">
                          <span><strong>Reserva:</strong> ${data.reserva}</span>
                          <span class="approved">APROVADO</span>
                      </div>
                  </div>
                  ${ticketHtml}                  
              </div>
              </body>
          </html>`
}

export const htmlEmailReserva = async (
    data: IReservaResponse,
    passageiro: { id: string, cpf: string, rg: string | null, nome: string, email: string }
): Promise<string> => {

    const excursaoNome = `${data.Excursao.nome} - ${formattingDate(data.Excursao.dataInicio.toDateString())} à ${formattingDate(data.Excursao.dataFim.toDateString())}`
    const valor = data.Transacoes?.reduce((previousValue, currentValue) => previousValue + currentValue.valor, 0) || 0
    const qtd = data.ExcursaoPassageiros.length
    const valorTotal = valor * qtd
    const formaPagamento = data.Transacoes?.map((financeiro) => { financeiro.FormaPagamento.nome })
    const valorLiquido = valorTotal - data.desconto

    return `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 10px;
                        overflow: hidden;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    }

                    .header {
                        background-color: #202020;
                        padding: 20px;
                        color: white;
                        text-align: left;
                    }

                    .header img {
                        max-height: 40px;
                    }

                    .header .right {
                        text-align: right;
                        font-size: 12px;
                    }

                    .content {
                        padding: 20px;
                    }

                    .content h1 {
                        color: #28a745;
                    }

                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }

                    .cta-button {
                        background-color: #000;
                        color: white;
                        text-align: center;
                        padding: 15px;
                        border-radius: 5px;
                        display: block;
                        width: 100%;
                        text-decoration: none;
                        margin: 20px 0;
                    }

                    .cta-button:hover {
                        background-color: #333;
                    }

                    .footer {
                        background-color: #f4f4f4;
                        padding: 20px;
                        text-align: center;
                        font-size: 14px;
                        color: #555;
                    }

                    .footer a {
                        color: #000;
                        text-decoration: none;
                    }

                    .footer img {
                        max-width: 30px;
                        margin: 0 10px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }

                    table, th, td {
                        border: 1px solid #ddd;
                    }

                    th, td {
                        padding: 10px;
                        text-align: left;
                    }

                    th {
                        background-color: #f4f4f4;
                    }
                </style>
            </head>

            <body>
                <div class="container">
                    <div class="header">
                        <div class="left">
                            <img src="${process.env.URL_LOGO_PRADOS}" alt="Prados Turismo">
                        </div>
                        <div class="right">
                            <p>Recebemos sua reserva<br> Data: ${formattingDate(data.dataCadastro.toDateString())} | Horário: ${formattingDate(data.dataCadastro.toDateString()).split(' ')[1]}</p>
                            <p><strong>Voucher anexado no final do e-mail</strong></p>
                        </div>
                    </div>

                    <div class="content">
                        <h1>Aprovada</h1>
                        <p>Oi, <strong>${passageiro.nome}</strong></p>
                        <p>Informamos que a sua reserva <strong>#${data.reserva}</strong> foi recebida com sucesso. Abaixo segue os dados de acesso à sua área de cliente para visualização da sua reserva e impressão de seu(s) voucher(s).</p>
                        
                        <h2>Acesse a área do cliente</h2>
                        <p>Acesse sua reserva utilizando os dados abaixo:</p>
                        <p><strong>Email:</strong> <a href="mailto:${passageiro.email}">${passageiro.email}</a><br>
                        <strong>CPF:</strong> ${cpfMask(passageiro.cpf)}</p>
                        <a href="#" class="cta-button">Acessar área do cliente</a>

                        <h2>Itens da reserva</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Unit</th>
                                    <th>Qtde</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${excursaoNome}</td>
                                    <td>${currencyBRLFormat(valor)}</td>
                                    <td>${qtd}</td>
                                    <td>${currencyBRLFormat(valorTotal)}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h2>Forma de pagamento</h2>
                        <p><strong>${formaPagamento}</strong><br> Valor: ${currencyBRLFormat(valorLiquido)}</p>
                    </div>

                    <div class="footer">
                        <p>WhatsApp: (85) 9 9746-0786<br> <a href="mailto:financeiro@pradosturismo.com.br">financeiro@pradosturismo.com.br</a></p>
                        <p>Fortaleza, Ceará</p>
                        <a href="https://www.facebook.com/pradosturismo" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook"></a>
                        <a href="https://www.instagram.com/pradosturismo/" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram"></a>
                    </div>
                </div>
            </body>
        </html>`;
}

export const htmlEmailCadastro = (username: string, password: string): string => {

    return `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao Prado</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                }
                .header {
                background-color: #dd7f11;
                padding: 20px;
                text-align: center;
                color: #ffffff;
                }
                .header h1 {
                margin: 0;
                font-size: 24px;
                }
                .content {
                padding: 20px;
                line-height: 1.6;
                color: #333333;
                }
                .content a {
                color: #dd7f11;
                text-decoration: none;
                }
                .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #999999;
                background-color: #f9f9f9;
                }
                .logo {
                display: flex;
                justify-content: center;
                padding: 20px 0;
                }
                .logo img {
                max-width: 150px;
                height: auto;
                }
            </style>
            </head>
            <body>
            <div class="logo">
                <img src="https://tourism-saas-web-git-main-carlossiiqueiras-projects.vercel.app/images/prados/logo_laranja.png" alt="Logomarca do Prado">
            </div>
            <div class="container">
                <div class="header">
                <h1>Boas-vindas à Prados Turismo</h1>
                </div>
                <div class="content">
                <p>Olá, <strong>${username}</strong>.</p>
                <p>Obrigado por criar uma conta em Prado. O seu nome de usuário é <strong>${username}</strong> e sua senha é <strong>${password}</strong>. 
                Você pode acessar sua conta para ver pedidos, alterar sua senha e muito mais em: 
                <a href="https://www.pradosturismo.com.br/minha-conta/">https://www.pradosturismo.com.br/minha-conta/</a></p>
                <p>Estamos ansiosos para atendê-lo(a) em breve.</p>
                </div>
                <div class="footer">
                Prados Turismo — Built by <a href="https://woocommerce.com/" target="_blank">Carlos Siqueira</a>
                </div>
            </div>
            </body>
            </html>`;
}

export const htmlEmailCredito = (reserva: string, cliente: string, valor: number): string => {
    return `<!DOCTYPE html>
            <html lang="pt-BR">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo ao Prado</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                }
                .header {
                background-color: #dd7f11;
                padding: 20px;
                text-align: center;
                color: #ffffff;
                }
                .header h1 {
                margin: 0;
                font-size: 24px;
                }
                .content {
                padding: 20px;
                line-height: 1.6;
                color: #333333;
                }
                .content a {
                color: #dd7f11;
                text-decoration: none;
                }
                .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #999999;
                background-color: #f9f9f9;
                }
                .logo {
                display: flex;
                justify-content: center;
                padding: 20px 0;
                }
                .logo img {
                max-width: 150px;
                height: auto;
                }
            </style>
            </head>
            <body>
            <div class="logo">
                <img src="https://tourism-saas-web-git-main-carlossiiqueiras-projects.vercel.app/images/prados/logo_laranja.png" alt="Logomarca do Prado">
            </div>
            <div class="container">
                <div class="header">
                <h1>Geramos um crédito para você!</h1>
                </div>
                <div class="content">
                <p>Olá, <strong>${cliente}</strong>.</p>
                <p>Gostariamos de informar que geramos um crédito para você devido ao cancelamento da reserva <strong>${reserva}</strong>                
                no valor de: ${currencyBRLFormat(valor)}, você pode conferir mais detalhes em:</p>
                <a href="https://www.pradosturismo.com.br/minha-conta/">https://www.pradosturismo.com.br/minha-conta/</a></p>
                <p>Estamos ansiosos para atendê-lo(a) em breve.</p>
                </div>
                <div class="footer">
                Prados Turismo — Built by <a href="https://woocommerce.com/" target="_blank">Carlos Siqueira</a>
                </div>
            </div>
            </body>
            </html>`
}
