import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../../db/database";

export async function userIdValidation(request: FastifyRequest, reply: FastifyReply) {
  const {sessionID} = request.cookies
  
  if(!sessionID) {
    return reply.status(401).send({
      message: "You must log in to make a request!"
    })
  }
  
  const user = await knex('users').where('session_id', sessionID).first()

  if(!user) {
    return reply.status(401).send({
      message: "Invalid Session please log in again."
    })
  }
  
  request.userID = user.id
}