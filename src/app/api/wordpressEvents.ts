import axios from "axios";

const token = process.env.API_EVENT_WP_TOKEN || ''

const wordPressEvents = axios.create({
  baseURL: `${process.env.URL_WORDPRESS}`,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})

export { wordPressEvents }
