import { prisma } from "../../../../../packages/database/src/index";

export async function listReports() {
  return prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function updateReportStatus(id: string, status: string) {
  return prisma.report.update({
    where: { id },
    data: { status: status as any },
  });
}
