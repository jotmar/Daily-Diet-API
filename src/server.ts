import { app } from "./app";
import { env } from "./env/setup";

app.listen({
  port: env.PORT
}).then(() => {
  console.log('HTTP Server is running...')
  console.log('Enviroment: ' + env.NODE_ENV)
}).catch(err => {
  console.log(err)
})