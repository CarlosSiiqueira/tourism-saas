import axios from "axios";

const username = process.env.API_WP_USER_WOO
const password = process.env.API_WP_SECRET_WOO
const credentials = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');

const wordPress = axios.create({
  baseURL: `${process.env.URL_WORDPRESS}`,
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
})

export { wordPress }
