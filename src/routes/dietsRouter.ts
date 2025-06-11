import { FastifyInstance } from "fastify";
import {knex} from "../../db/database"
import {z} from "zod"
import { userIdValidation } from "../middlewares/userIdValidation";
import { randomUUID } from "crypto";

export async function dietsRouter(app: FastifyInstance) {

  /* GET ALL DIETS ROUTE */
  /*  */

  app.get('/', async (request, reply) => {
  })

  /* Create a new DIET Route */
  /*  */

  app.post('/', {preHandler: userIdValidation}, async (request, reply) => {

    /* Validate Request Schema */

    const requestBodySchema = z.object(
      {
        name: z.string(),
        description: z.string(),
        diet: z.boolean(),
      }

    )

    /* Getting Variables */

    const {name, description, diet} = requestBodySchema.parse(request.body)
    const {userID} = request

    /* Creating the new Diet */

    await knex('diets').insert({
      id: randomUUID(),
      name,
      description,
      date: Date.now(),
      diet,
      userID
    })

    return reply.status(201).send()
  })

}