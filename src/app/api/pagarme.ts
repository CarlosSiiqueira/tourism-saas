import axios from "axios";

export const pagarme = axios.create({
  baseURL: 'https://api.pagar.me/core/v5',
  headers: {
    Authorization: 'Basic c2tfNjUyODNlOTllODRlNDQ1OThkMTMwN2VmODU5ZTgxNTE6',
    'Content-Type': 'application/json'
  }
})
