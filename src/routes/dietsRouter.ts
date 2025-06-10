import { FastifyInstance } from "fastify";

export async function dietsRouter(app: FastifyInstance) {

  /* GET ALL DIETS ROUTE */
  /*  */

  app.get('/', async (request, reply) => {
    reply.status(200).send({status: "Sucessful", diet: "Diets"})
  })

}