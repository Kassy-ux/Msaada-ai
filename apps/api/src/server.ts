import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

const server = Fastify({ logger: true });

server.register(cors, { origin: true });

server.get("/health", async () => {
  return { status: "ok", service: "msaada-api" };
});

const start = async () => {
  try {
    await server.listen({ port: 4000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
