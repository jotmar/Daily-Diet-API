import { FastifyInstance } from "fastify";
import {knex} from "../../db/database"
import {string, z} from "zod"
import { userIdValidation } from "../middlewares/userIdValidation";
import { randomUUID } from "crypto";

export async function dietsRouter(app: FastifyInstance) {
  /* User Validation Hook */
  /*  */

  app.addHook('onRequest', userIdValidation)

  /* Get all DIETS Route */
  /*  */

  app.get('/', async (request, reply) => {
    const data = await knex('diets').where('userID', request.userID).select('*')

    return reply.status(200).send({ data })

  })

  /* Get single DIET Route */
  /*  */

  app.get('/:id', async (request, reply) => {
    const requestParamsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = requestParamsSchema.parse(request.params)

    const data = await knex('diets').where('id', id).first()

    return reply.status(200).send({diet: data})
  })

  /* Create a new DIET Route */
  /*  */

  app.post('/', async (request, reply) => {

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

  /* Update a DIET Route */
  /*  */

  app.put('/:id', async (request, reply) => {
    
    /* Validate Request Body */
    
    const requestBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      diet: z.boolean()
    })

    /* Validate Request Param ID */

    const requestParamSchema = z.object({
      id: string().uuid()
    })

    /* Get variables */

    const {name, description, diet} = requestBodySchema.parse(request.body)
    const {userID} = request
    const {id} = requestParamSchema.parse(request.params)

    /* Update Diet */

    await knex('diets').where({
      id,
      userID
    }).update({
      name,
      description,
      diet
    })

    return reply.status(201).send()
  })

  /* Delete a DIET Route */
  /*  */

  app.delete('/:id', async (request, reply) => {

    /* Validate Request Params */

    const requestParamsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = requestParamsSchema.parse(request.params)

    /* Delete Diet */

    await knex('diets').where({
      id,
      userID: request.userID
    })
    .del()

    return reply.status(201).send()
  })
}