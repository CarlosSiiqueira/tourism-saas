import { IFinanceiroDTO } from "../../app/interfaces/Financeiro"
import { IFinanceiroHookArgs, IPacoteHookArgs } from "../../app/interfaces/Helper";
import { IPacoteDTO } from "../../app/interfaces/Pacote";

export const proccessFinanceiroData = (dados: IFinanceiroHookArgs): IFinanceiroDTO => {
  let data: IFinanceiroDTO;
  let observacao: string = 'Compra de: \n'

  dados.line_items.forEach((produto) => {
    if (dados.Pacote.idWP == produto.id) {
      observacao += `${produto.quantity}x ${produto.name} no valor R$${produto.price} \n`
    }
  })

  data = {
    tipo: 1,
    valor: dados.total,
    vistoAdmin: false,
    data: new Date(),
    efetivado: false,
    observacao: observacao,
    ativo: true,
    numeroComprovanteBancario: dados.order_key,
    dataPrevistaRecebimento: new Date(),
    idWP: dados.id,
    codigoPessoa: dados.codigoPessoa,
    codigoExcursao: dados.codigoExcursao,
    codigoPacote: dados.Pacote.id,
    codigoFormaPagamento: dados.codigoFormaPagamento,
    usuarioCadastro: process.env.USERPADRAOWEBHOOK || ''
  }

  return data;
}

export const pacotes = (dados: IPacoteHookArgs): Array<IPacoteDTO> => {
  let data: Array<IPacoteDTO> = []

  dados.line_items.forEach((produto) => {
    data.push({
      nome: produto.name,
      valor: produto.subtotal,
      descricao: '',
      ativo: true,
      origem: 1,
      tipoTransporte: 1,
      urlImagem: produto.image.src || '',
      urlImgEsgotado: '',
      idWP: produto.id,
      destino: 'aa',
      codigoDestino: null,
      categoria: null,
      usuarioCadastro: process.env.USERPADRAOWEBHOOK || ''
    })
  })

  return data;
}

export const proccessPacotesId = (dados: IPacoteHookArgs): Array<number> => {
  let ids: Array<number>

  ids = dados.line_items.map((pacote) => {
    return pacote.id
  })

  return ids
}

/*{
    "id": 1211,
    "parent_id": 0,
    "status": "completed",
    "currency": "BRL",
    "version": "9.1.2",
    "prices_include_tax": false,
    "date_created": "2024-07-23T23:14:25",
    "date_modified": "2024-07-23T23:30:05",
    "discount_total": "0.00",
    "discount_tax": "0.00",
    "shipping_total": "0.00",
    "shipping_tax": "0.00",
    "cart_tax": "0.00",
    "total": "3.00",
    "total_tax": "0.00",
    "customer_id": 1,
    "order_key": "wc_order_UI0XtxzTpfXZL",
    "billing": {
        "first_name": "wermeson",
        "last_name": "soares",
        "company": "",
        "address_1": "Rua Joana",
        "address_2": "",
        "city": "Acarape",
        "state": "CE",
        "postcode": "62785-000",
        "country": "BR",
        "email": "wermeson.blucomet@gmail.com",
        "phone": "(85) 98589-2221",
        "number": "256",
        "neighborhood": "",
        "persontype": "F",
        "cpf": "06814984393",
        "rg": "",
        "cnpj": "",
        "ie": "",
        "birthdate": "",
        "gender": "",
        "cellphone": ""
    },
    "shipping": {
        "first_name": "",
        "last_name": "",
        "company": "",
        "address_1": "",
        "address_2": "",
        "city": "",
        "state": "",
        "postcode": "",
        "country": "",
        "phone": "",
        "number": "",
        "neighborhood": ""
    },
    "payment_method": "pagbank_pix",
    "payment_method_title": "Pix",
    "transaction_id": "",
    "customer_ip_address": "2804:29b8:5175:b32a:a857:a612:eb04:6b00",
    "customer_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "created_via": "checkout",
    "customer_note": "",
    "date_completed": "2024-07-23T23:17:10",
    "date_paid": "2024-07-23T23:17:10",
    "cart_hash": "03bb0bcc9d501323e68a593dc5242803",
    "number": "1211",
    "meta_data": [
        {
            "id": 299,
            "key": "_billing_cellphone",
            "value": ""
        },
        {
            "id": 283,
            "key": "_billing_cnpj",
            "value": ""
        },
        {
            "id": 282,
            "key": "_billing_cpf",
            "value": "068.149.843-93"
        },
        {
            "id": 285,
            "key": "_billing_neighborhood",
            "value": ""
        },
        {
            "id": 284,
            "key": "_billing_number",
            "value": "256"
        },
        {
            "id": 281,
            "key": "_billing_persontype",
            "value": "1"
        },
        {
            "id": 301,
            "key": "_shipping_neighborhood",
            "value": ""
        },
        {
            "id": 300,
            "key": "_shipping_number",
            "value": ""
        },
        {
            "id": 289,
            "key": "_tribe_has_tickets",
            "value": "1"
        },
        {
            "id": 302,
            "key": "_tribe_mail_sent",
            "value": "1"
        },
        {
            "id": 297,
            "key": "_wc_order_attribution_device_type",
            "value": "Desktop"
        },
        {
            "id": 295,
            "key": "_wc_order_attribution_session_count",
            "value": "2"
        },
        {
            "id": 292,
            "key": "_wc_order_attribution_session_entry",
            "value": "https://wess.blog/"
        },
        {
            "id": 294,
            "key": "_wc_order_attribution_session_pages",
            "value": "4"
        },
        {
            "id": 293,
            "key": "_wc_order_attribution_session_start_time",
            "value": "2024-07-23 22:12:02"
        },
        {
            "id": 290,
            "key": "_wc_order_attribution_source_type",
            "value": "typein"
        },
        {
            "id": 296,
            "key": "_wc_order_attribution_user_agent",
            "value": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
        },
        {
            "id": 291,
            "key": "_wc_order_attribution_utm_source",
            "value": "(direct)"
        },
        {
            "id": 286,
            "key": "is_vat_exempt",
            "value": "no"
        }
    ],
    "line_items": [
        {
            "id": 19,
            "name": "teste",
            "product_id": 11,
            "variation_id": 0,
            "quantity": 1,
            "tax_class": "",
            "subtotal": "1.00",
            "subtotal_tax": "0.00",
            "total": "1.00",
            "total_tax": "0.00",
            "taxes": [],
            "meta_data": [],
            "sku": "",
            "price": 1,
            "image": {
                "id": "",
                "src": ""
            },
            "parent_name": null
        },
        {
            "id": 20,
            "name": "Teste",
            "product_id": 1176,
            "variation_id": 0,
            "quantity": 2,
            "tax_class": "",
            "subtotal": "2.00",
            "subtotal_tax": "0.00",
            "total": "2.00",
            "total_tax": "0.00",
            "taxes": [],
            "meta_data": [
                {
                    "id": 182,
                    "key": "_tribe_wooticket_attendee_optout",
                    "value": "yes",
                    "display_key": "_tribe_wooticket_attendee_optout",
                    "display_value": "yes"
                },
                {
                    "id": 183,
                    "key": "_reduced_stock",
                    "value": "2",
                    "display_key": "_reduced_stock",
                    "display_value": "2"
                }
            ],
            "sku": "1176-1-TESTE",
            "price": 1,
            "image": {
                "id": "",
                "src": ""
            },
            "parent_name": null
        }
    ],
    "tax_lines": [],
    "shipping_lines": [],
    "fee_lines": [],
    "coupon_lines": [],
    "refunds": [],
    "payment_url": "https://wess.blog/finalizar-compra/order-pay/1211/?pay_for_order=true&key=wc_order_UI0XtxzTpfXZL",
    "is_editable": false,
    "needs_payment": false,
    "needs_processing": true,
    "date_created_gmt": "2024-07-23T23:14:25",
    "date_modified_gmt": "2024-07-23T23:30:05",
    "date_completed_gmt": "2024-07-23T23:17:10",
    "date_paid_gmt": "2024-07-23T23:17:10",
    "currency_symbol": "R$",
    "_links": {
        "self": [
            {
                "href": "https://wess.blog/wp-json/wc/v3/orders/1211"
            }
        ],
        "collection": [
            {
                "href": "https://wess.blog/wp-json/wc/v3/orders"
            }
        ],
        "customer": [
            {
                "href": "https://wess.blog/wp-json/wc/v3/customers/1"
            }
        ]
    }
}*/