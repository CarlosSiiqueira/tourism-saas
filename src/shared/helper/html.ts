import QRCode from 'qrcode';
import { IReservaResponse } from '../../app/interfaces/Reserva';
import { formattingDate } from './date';
import { cpfMask, phoneMask } from './fieldMask';

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
