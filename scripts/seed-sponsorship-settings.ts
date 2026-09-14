import "dotenv/config";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/db";

const DEFAULT_SPONSORSHIP_SETTINGS: Record<string, string> = {
  sponsorsIntro:
    "MIICCOF is a flagship platform convening investors, businesses, government, development partners, financial institutions, and consumers to unlock investment and commercial opportunities across Meru County and the wider region, showcasing potential in agriculture and agribusiness, avocado and miraa value addition, tourism and hospitality, manufacturing, trade, financial services, technology, SMEs, and Special Economic Zone (SEZ) opportunities.",
  sponsorshipTiers: JSON.stringify([
      {
        name: "Star Partner",
        amount: "KES 5,000,000",
        slots: "1 slot",
        position: "Title Partner",
      },
    {
      name: "Platinum Partner",
      amount: "KES 3,000,000",
      slots: "3 slots",
      position: "Co-Powered Partner",
    },
    {
      name: "Gold Partner",
      amount: "KES 2,000,000",
      slots: "5 slots",
      position: "Official Gold Partner",
    },
    {
      name: "Silver Partner",
      amount: "KES 1,000,000",
      slots: "10 slots",
      position: "Official Silver Partner",
    },
    {
      name: "Bronze Partner",
      amount: "KES 500,000",
      slots: "15 slots",
      position: "Official Bronze Partner",
    },
  ]),
  whyPartnerPoints: JSON.stringify([
    "Align your brand with a high-level investment and business platform in Meru County",
    "Engage investors, entrepreneurs, consumers, government, and financial institutions",
    "Showcase products through exhibition, activation, and direct customer engagement",
    "Strengthen visibility via event branding, media exposure, and digital marketing",
    "Build strategic relationships through VIP networking and B2B matchmaking",
    "Demonstrate commitment to enterprise growth and regional investment",
  ]),
};

async function main() {
  for (const [key, value] of Object.entries(DEFAULT_SPONSORSHIP_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { id: randomUUID(), key, value },
    });
    console.log(`Seeded ${key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
