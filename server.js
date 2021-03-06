require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
//const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const axios = require('axios');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const ShopifyToken = require('shopify-token');

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session({ sameSite: 'none', secure: true }, server));
  server.keys = [SHOPIFY_API_SECRET_KEY];
  
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_orders'],
      accessMode: 'offline', // <<<< ADD THIS
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: 'none'
        });
 const ax = await axios.post('http://localhost:8000/api/token',{token:accessToken,shopName:shop}).then(function(response){
  console.log(response)
  })
        const registration = await registerWebhook({
          address: 'https://localhost:8000/api/orders',
          topic: "ORDERS_CREATE",
          accessToken,
          shop,
          apiVersion: ApiVersion.July20
        });
        if (registration.success){

          console.log('Successfully registered webhook!');
        } else {
          console.log('Failed to register webhook', registration.result);
        }
        //await getSubscriptionUrl(ctx, accessToken, shop);
        console.log(registration.result.data.webhookSubscriptionCreate.userErrors);
      }
    })
    )



  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.get('/webhooks/orders/read', webhook, (ctx) => {
    axios.post('http://localhost:8000/api/orders',{'order_name':ctx.state.webhook}).then(function(res){
    console.log('received webhook: ', ctx.state.webhook);
    console.log(res);
    });
    axios.post("https://rest.nexmo.com/sms/json",data ={"text":"A new order was created!","to":YOUR_NUMBER,"api_key":env.VONAGE_API_KEY, "api_secret":VONAGE.API_SECRET})}).then(function(res){
    console.log('received webhook: ', ctx.state.webhook);
    console.log(res);
    });
  });


  server.use(graphQLProxy({ version: ApiVersion.July20 }));

  router.get('(.*)', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
