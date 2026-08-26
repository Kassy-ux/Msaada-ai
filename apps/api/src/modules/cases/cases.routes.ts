import { FastifyInstance } from "fastify";
import { prisma } from "../../../../../packages/database/src/index";

function generateCaseCode(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `MSD-${random}`;
}

export async function caseRoutes(server: FastifyInstance) {
  // Create a case
  server.post<{
    Body: {
      userId?: string;
      category: string;
      description: string;
      urgency?: string;
    };
  }>("/api/cases", async (request, reply) => {
    const { userId, category, description, urgency } = request.body;

    if (!category || !description) {
      return reply.status(400).send({ error: "category and description are required" });
    }

    // For MVP without full auth yet, allow an anonymous/demo user fallback
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      const demoUser = await prisma.user.upsert({
        where: { phone: "0000000000" },
        update: {},
        create: { phone: "0000000000", name: "Demo User" },
      });
      effectiveUserId = demoUser.id;
    }

    const newCase = await prisma.case.create({
      data: {
        code: generateCaseCode(),
        userId: effectiveUserId,
        category: category as any,
        description,
        urgency: (urgency as any) ?? "MEDIUM",
      },
    });

    await prisma.caseEvent.create({
      data: {
        caseId: newCase.id,
        type: "CASE_CREATED",
        description: "Case created from Msaada triage.",
      },
    });

    return reply.status(201).send(newCase);
  });

  // List cases (optionally filtered by userId)
  server.get<{ Querystring: { userId?: string } }>("/api/cases", async (request, reply) => {
    const { userId } = request.query;

    const cases = await prisma.case.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: "desc" },
      include: { events: { orderBy: { createdAt: "asc" } } },
    });

    return reply.send(cases);
  });

  // Get single case with full timeline
  server.get<{ Params: { id: string } }>("/api/cases/:id", async (request, reply) => {
    const { id } = request.params;

    const foundCase = await prisma.case.findUnique({
      where: { id },
      include: {
        events: { orderBy: { createdAt: "asc" } },
        evidence: true,
        referrals: { include: { provider: true } },
      },
    });

    if (!foundCase) {
      return reply.status(404).send({ error: "Case not found" });
    }

    return reply.send(foundCase);
  });

  // Update case status
  server.patch<{
    Params: { id: string };
    Body: { status?: string; urgency?: string };
  }>("/api/cases/:id", async (request, reply) => {
    const { id } = request.params;
    const { status, urgency } = request.body;

    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...(status ? { status: status as any } : {}),
        ...(urgency ? { urgency: urgency as any } : {}),
      },
    });

    if (status) {
      await prisma.caseEvent.create({
        data: {
          caseId: id,
          type: "STATUS_CHANGED",
          description: `Case status changed to ${status}.`,
        },
      });
    }

    return reply.send(updated);
  });

  // Add a case event
  server.post<{
    Params: { id: string };
    Body: { type: string; description: string };
  }>("/api/cases/:id/events", async (request, reply) => {
    const { id } = request.params;
    const { type, description } = request.body;

    const event = await prisma.caseEvent.create({
      data: { caseId: id, type, description },
    });

    return reply.status(201).send(event);
  });
}
