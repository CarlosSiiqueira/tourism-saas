import WooCommerceAPI from "@woocommerce/woocommerce-rest-api"

const wooCommerce = new WooCommerceAPI({
  url: process.env.URL_WORDPRESS || '',
  consumerKey: process.env.API_WP_USER || '',
  consumerSecret: process.env.API_WP_SECRET || '',
  version: 'wc/v3'
});


export { wooCommerce }
