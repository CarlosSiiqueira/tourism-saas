import WooCommerceAPI from "@woocommerce/woocommerce-rest-api"

const wooCommerce = new WooCommerceAPI({
  url: process.env.URL_WORDPRESS || '',
  consumerKey: process.env.API_WP_USER_WOO || '',
  consumerSecret: process.env.API_WP_SECRET_WOO || '',
  version: 'wc/v3'
});


export { wooCommerce }
