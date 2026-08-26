import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import multipart from "@fastify/multipart";
import "dotenv/config";
import { triageRoutes } from "./modules/triage/triage.routes";
import { caseRoutes } from "./modules/cases/cases.routes";
import { providerRoutes } from "./modules/providers/providers.routes";
import { ussdRoutes } from "./modules/ussd/ussd.routes";
import { evidenceRoutes } from "./modules/evidence/evidence.routes";
import { adminProviderRoutes } from "./modules/admin/admin-providers.routes";
import { adminLegalDocumentRoutes } from "./modules/admin/admin-legal-documents.routes";
import { adminUserRoutes } from "./modules/admin/admin-users.routes";
import { adminCaseRoutes } from "./modules/admin/admin-cases.routes";
import { adminReportRoutes } from "./modules/admin/admin-reports.routes";

const server = Fastify({ logger: true });

server.register(cors, { origin: true });
server.register(formbody);
server.register(multipart);

server.get("/health", async () => {
  return { status: "ok", service: "msaada-api" };
});

server.register(triageRoutes);
server.register(caseRoutes);
server.register(providerRoutes);
server.register(ussdRoutes);
server.register(evidenceRoutes);
server.register(adminProviderRoutes);
server.register(adminLegalDocumentRoutes);
server.register(adminUserRoutes);
server.register(adminCaseRoutes);
server.register(adminReportRoutes);

const start = async () => {
  try {
    await server.listen({ port: 4000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
