import { prisma } from "../../../../../packages/database/src/index";

export async function listProviders() {
  return prisma.provider.findMany({
    include: { services: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProvider(data: {
  name: string;
  organization?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  categories?: string[];
}) {
  const provider = await prisma.provider.create({
    data: {
      name: data.name,
      organization: data.organization,
      location: data.location,
      phone: data.phone,
      email: data.email,
      website: data.website,
    },
  });

  if (data.categories && data.categories.length > 0) {
    await prisma.providerService.createMany({
      data: data.categories.map((category) => ({
        providerId: provider.id,
        category: category as any,
      })),
    });
  }

  return provider;
}

export async function verifyProvider(id: string, verified: boolean) {
  return prisma.provider.update({
    where: { id },
    data: { verified },
  });
}

export async function deleteProvider(id: string) {
  return prisma.provider.delete({ where: { id } });
}
