import { prisma } from "../../../../../packages/database/src/index";

export async function listAllCases() {
  return prisma.case.findMany({
    include: {
      user: { select: { id: true, phone: true, name: true } },
      _count: { select: { events: true, evidence: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateCaseStatus(id: string, status: string) {
  return prisma.case.update({
    where: { id },
    data: { status: status as any },
  });
}
