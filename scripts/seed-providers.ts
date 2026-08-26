import { prisma } from "../packages/database/src/index";

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
  ];

  for (const p of providers) {
    const provider = await prisma.provider.create({
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

    for (const category of p.categories) {
      await prisma.providerService.create({
        data: {
          providerId: provider.id,
          category: category as any,
        },
      });
    }

    console.log(`Seeded provider: ${p.name}`);
  }

  console.log("Provider seeding complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
