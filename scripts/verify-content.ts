import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  const homeHero = await prisma.section.findFirst({
    where: { page: { slug: "home" }, key: "hero" },
  });
  console.log("Home hero badge:", (homeHero?.metadata as { badge?: string } | null)?.badge);

  const homeCommittee = await prisma.section.findFirst({
    where: { page: { slug: "home" }, key: "committee" },
  });
  const homeCards = (homeCommittee?.metadata as { cards?: { title: string; role: string }[] } | null)?.cards;
  console.log("Home committee:", homeCards?.map((c) => `${c.title} - ${c.role}`));

  const aboutCommittee = await prisma.section.findFirst({
    where: { page: { slug: "about" }, key: "committee" },
  });
  const aboutCards = (aboutCommittee?.metadata as { cards?: { title: string; role: string; org?: string }[] } | null)?.cards;
  console.log("About committee:", aboutCards?.map((c) => `${c.title} - ${c.role} (${c.org})`));

  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: ["sponsorshipTiers"] } },
  });
  const tiers = settings.find((s) => s.key === "sponsorshipTiers");
  console.log("Star Partner:", (JSON.parse(tiers?.value ?? "[]") as { name: string; position: string }[])[0]);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
