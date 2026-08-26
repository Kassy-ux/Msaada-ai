import { prisma } from "../../../../../packages/database/src/index";

export async function listUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      phone: true,
      name: true,
      location: true,
      role: true,
      createdAt: true,
      _count: { select: { cases: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(id: string, role: string) {
  return prisma.user.update({
    where: { id },
    data: { role: role as any },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } });
}
