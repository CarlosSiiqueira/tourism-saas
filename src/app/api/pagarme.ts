import axios from "axios";

export const pagarme = axios.create({
  baseURL: 'https://api.pagar.me/core/v5',
  headers: {
    Authorization: `Basic ${process.env.AUTH_PAGARME}`,
    'Content-Type': 'application/json'
  }
})
