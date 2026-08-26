import { FastifyInstance } from "fastify";
import { prisma } from "../../../../../packages/database/src/index";

export async function providerRoutes(server: FastifyInstance) {
  // List providers, optionally filtered by category
  server.get<{ Querystring: { category?: string } }>(
    "/api/providers",
    async (request, reply) => {
      const { category } = request.query;

      const providers = await prisma.provider.findMany({
        where: {
          verified: true,
          ...(category
            ? { services: { some: { category: category as any } } }
            : {}),
        },
        include: { services: true },
        orderBy: { name: "asc" },
      });

      return reply.send(providers);
    }
  );

  server.get<{ Params: { id: string } }>("/api/providers/:id", async (request, reply) => {
    const { id } = request.params;

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!provider) {
      return reply.status(404).send({ error: "Provider not found" });
    }

    return reply.send(provider);
  });
}
