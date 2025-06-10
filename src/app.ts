import fastify from "fastify"
import { dietsRouter } from "./routes/dietsRouter"

export const app = fastify()

app.register(dietsRouter)

app.get('/', () => {
  return "Hello World!"
})