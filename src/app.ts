import fastify from "fastify"
import { dietsRouter } from "./routes/dietsRouter"
import { userRouter } from "./routes/userRouter"
import cookies from "@fastify/cookie"

export const app = fastify()

/* Plugins */
/*  */

app.register(cookies, {
  parseOptions: {
    maxAge: 60 * 60 * 24 // 24 hours
  }
})

/* Routers */
/*  */

app.register(userRouter, {
  prefix: "/users"
})
app.register(dietsRouter, {
  prefix: "/diets"
})