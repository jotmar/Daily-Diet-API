import { FastifyReply} from "fastify";

export async function validateData(reply: FastifyReply, data: { [key: string]: unknown} | number | undefined) {
  if (!data || data === 0) {
    return reply.status(404).send({
      message: "Cannot find a diet with the provided id."
    })
  }
}