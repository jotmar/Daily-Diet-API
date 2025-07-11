import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../../db/database"
import { randomUUID } from "node:crypto"

export async function userRouter(app: FastifyInstance) {

  /* User Registration Route */
  /*  */

  app.post('/register', async (request, reply) => {
    
    /* Request Body Validation */
    
    const requestBodySchema = z.object({
      username: z.string(),
      email: z.string(),
      password: z.string(),
    })

    /* Getting Validated Request Data */

    const {username, email, password} = requestBodySchema.parse(request.body)

    /* Checking if user already exists */

    const data = await knex('users').where('username', username).orWhere('email', email).first()

    if (data) {
      return reply.status(409).send({
        message: "User with this email or username already exists."
      })
    }

    /* Creating New User in the Database */

    await knex('users').insert({
      id: randomUUID(),
      username,
      email,
      password,
      session_id: randomUUID()
    })

    return reply.status(201).send()
  })


  /* User Login Route */
  /*  */

  app.post('/login', async (request, reply) => {
    
    /* Validate Request Body */

    const requestBodySchema = z.object({
      email: z.string(),
      password: z.string()
    })

    /* Get validated data */

    const {email, password} = requestBodySchema.parse(request.body)

    const user = await knex('users').where({
      email,
      password
    }).first()

    if(!user) {
      return reply.status(401).send({
        response: "Invalid Email of Password!"
      })
    }

    reply.setCookie("sessionID", user.session_id, {
      path: "/"
    })

    return reply.status(200).send({
      msg: "Sucessfull Login"
    })
  })
}