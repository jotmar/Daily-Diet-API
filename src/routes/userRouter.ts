import { FastifyInstance } from "fastify"

export async function userRouter(app: FastifyInstance) {

  /* User Registration Route */
  /*  */

  app.post('/register', async (request, reply) => {
    reply.status(200).send('New Registration!')
  })

  /* User Login Route */
  /*  */

  app.post('/login', async (request, reply) => {
    reply.status(200).send('New user login')
  })
}