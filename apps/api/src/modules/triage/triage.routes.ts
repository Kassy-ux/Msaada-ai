import { FastifyInstance } from "fastify";
import { runTriage } from "../../../../../packages/ai/rag/triagePipeline";

export async function triageRoutes(server: FastifyInstance) {
  server.post<{ Body: { message: string } }>("/api/triage", async (request, reply) => {
    const { message } = request.body;

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return reply.status(400).send({
        error: "Please describe your situation in a bit more detail.",
      });
    }

    try {
      const result = await runTriage(message);
      return reply.send(result);
    } catch (err) {
      server.log.error(err);
      return reply.status(500).send({
        error: "Something went wrong while processing your request. Please try again.",
      });
    }
  });
}
