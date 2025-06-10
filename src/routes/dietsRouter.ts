import { FastifyInstance } from "fastify";
import {knex} from "../../db/database"

export async function dietsRouter(app: FastifyInstance) {

  /* GET ALL DIETS ROUTE */
  /*  */

  app.get('/', async (request, reply) => {
  })

}