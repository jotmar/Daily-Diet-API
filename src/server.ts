import { app } from "./app";
import { env } from "./env/setup";

app.listen({
  port: env.PORT,
  host: "0.0.0.0",
}).then(() => {
  console.log('HTTP Server is running...')
  console.log('Enviroment: ' + env.NODE_ENV)
}).catch(err => {
  console.log(err)
})