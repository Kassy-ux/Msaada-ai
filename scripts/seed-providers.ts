import { prisma } from "../packages/database/src/index";

function isTransientTimeout(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "ETIMEDOUT"
  );
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function seedWithRetry(): Promise<void> {
  const attempts = 3;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await main();
      return;
    } catch (error) {
      if (!isTransientTimeout(error) || attempt === attempts) throw error;

      console.warn(`Database connection timed out; retrying (${attempt}/${attempts})...`);
      await delay(attempt * 500);
    }
  }
}

async function main() {
  const providers = [
    {
      name: "Kituo Cha Sheria",
      organization: "Kituo Cha Sheria Legal Aid",
      location: "Nairobi",
      phone: "+254709925000",
      email: "info@kituochasheria.or.ke",
      website: "https://kituochasheria.or.ke",
      verified: true,
      categories: ["HOUSING", "EMPLOYMENT", "LAND", "FAMILY"],
    },
    {
      name: "National Legal Aid Service (NLAS)",
      organization: "National Legal Aid Service",
      location: "Nairobi",
      phone: "+254800720440",
      email: "info@nlas.go.ke",
      website: "https://www.nlas.go.ke",
      verified: true,
      categories: ["EMPLOYMENT", "HOUSING", "POLICE", "FAMILY", "DEBT", "OTHER"],
    },
    {
      name: "FIDA Kenya",
      organization: "Federation of Women Lawyers Kenya",
      location: "Nairobi",
      phone: "+254722509760",
      email: "info@fidakenya.org",
      website: "https://fidakenya.org",
      verified: true,
      categories: ["GBV", "FAMILY"],
    },
    {
      name: "Msaada Demo Legal Aid (TEST ONLY)",
      organization: "Msaada demo data — not a real provider",
      location: "Nairobi",
      phone: "+254700000000",
      email: "demo@example.test",
      website: "https://example.test",
      verified: true,
      categories: ["POLICE", "EMPLOYMENT", "HOUSING", "LAND", "FAMILY", "GBV", "CONSUMER", "DEBT", "PUBLIC_SERVICE", "OTHER"],
    },
  ];

  for (const p of providers) {
    const existing = await prisma.provider.findFirst({ where: { name: p.name } });
    const provider = existing
      ? await prisma.provider.update({
          where: { id: existing.id },
          data: {
            organization: p.organization,
            location: p.location,
            phone: p.phone,
            email: p.email,
            website: p.website,
            verified: p.verified,
          },
        })
      : await prisma.provider.create({
          data: {
            name: p.name,
            organization: p.organization,
            location: p.location,
            phone: p.phone,
            email: p.email,
            website: p.website,
            verified: p.verified,
          },
        });

    await prisma.providerService.deleteMany({ where: { providerId: provider.id } });
    await prisma.providerService.createMany({
      data: p.categories.map((category) => ({
          providerId: provider.id,
          category: category as any,
      })),
    });

    console.log(`${existing ? "Updated" : "Seeded"} provider: ${p.name}`);
  }

  console.log("Provider seeding complete.");
}

seedWithRetry()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
