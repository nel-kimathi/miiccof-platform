import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { PoolConfig } from "mariadb";
import type { Prisma } from "../lib/generated/prisma/client";

function asJson(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

const rawUrl = process.env.DATABASE_URL ?? "";
const parsed = new URL(rawUrl);
const poolConfig: PoolConfig = {
  host: parsed.hostname,
  port: Number(parsed.port) || 4000,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, ""),
  ssl: { rejectUnauthorized: true },
  allowPublicKeyRetrieval: true,
  connectTimeout: 60000,
  acquireTimeout: 60000,
};
const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter });

const NEW_SPONSORSHIP_TIERS = JSON.stringify([
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
]);

async function main() {
  // 1. Update home hero badge
  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    const hero = await prisma.section.findFirst({
      where: { pageId: home.id, key: "hero" },
    });
    if (hero) {
      const metadata = (hero.metadata ?? {}) as Record<string, unknown>;
      metadata.badge = "December 3rd, 4th, & 5th 2026";
      await prisma.section.update({ where: { id: hero.id }, data: { metadata: asJson(metadata) } });
      console.log("Updated home hero badge");
    }

    // 2. Update home leadership
    const leadership = await prisma.section.findFirst({
      where: { pageId: home.id, key: "leadership" },
    });
    if (leadership) {
      const metadata = (leadership.metadata ?? {}) as {
        cards?: { title: string; role?: string }[];
      };
      for (const card of metadata.cards ?? []) {
        if (card.title === "Prof. Romanus Odhiambo, Ph.D.") {
          card.role = "Vice Chancellor MUST";
        }
        if (card.title === "Mr. Joshua K. Mungania") {
          card.role = "Chairman KNCCI - Meru Chapter";
        }
      }
      await prisma.section.update({ where: { id: leadership.id }, data: { metadata: asJson(metadata) } });
      console.log("Updated home leadership");
    }

    // 3. Update home committee
    const committee = await prisma.section.findFirst({
      where: { pageId: home.id, key: "committee" },
    });
    if (committee) {
      const metadata = (committee.metadata ?? {}) as {
        cards?: { title: string; role?: string; description?: string; image?: string }[];
      };
      const cards = metadata.cards ?? [];
      const filtered = cards.filter((c) => c.title !== "Patrick Kathurima");
      for (const card of filtered) {
        if (card.title === "Martin Kiogora Mbui") {
          card.role = "Secretary";
          card.description =
            "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement.";
        }
        if (card.title === "Dr. Patrick Kinyua Kubai") {
          card.image = "/images/committee/patrick-kubai.jpg";
        }
        if (card.description) {
          card.description = card.description.replace(/\?\?\?/g, "–");
        }
      }
      metadata.cards = filtered;
      await prisma.section.update({ where: { id: committee.id }, data: { metadata } });
      console.log("Updated home committee");
    }

    // 4. Update home scheduled events times
    const eventsSection = await prisma.section.findFirst({
      where: { pageId: home.id, key: "events-preview" },
    });
    if (eventsSection) {
      const metadata = (eventsSection.metadata ?? {}) as {
        events?: { title: string; time?: string; description?: string }[];
      };
      for (const event of metadata.events ?? []) {
        if (event.time) {
          event.time = event.time.replace(/\?\?/g, "·");
        }
      }
      await prisma.section.update({ where: { id: eventsSection.id }, data: { metadata: asJson(metadata) } });
      console.log("Updated home event times");
    }
  }

  // 5. Update about page
  const about = await prisma.page.findUnique({ where: { slug: "about" } });
  if (about) {
    const aboutBody = await prisma.section.findFirst({
      where: { pageId: about.id, key: "body" },
    });
    if (aboutBody?.body) {
      await prisma.section.update({
        where: { id: aboutBody.id },
        data: { body: aboutBody.body.replace(/\?\?\?/g, "—") },
      });
      console.log("Updated about body question marks");
    }

    const aboutLeadership = await prisma.section.findFirst({
      where: { pageId: about.id, key: "leadership" },
    });
    if (aboutLeadership) {
      const metadata = (aboutLeadership.metadata ?? {}) as {
        cards?: { title: string; role?: string }[];
      };
      for (const card of metadata.cards ?? []) {
        if (card.title === "Prof. Romanus Odhiambo, Ph.D.") {
          card.role = "Vice Chancellor MUST";
        }
        if (card.title === "Mr. Joshua K. Mungania") {
          card.role = "Chairman KNCCI - Meru Chapter";
        }
      }
      await prisma.section.update({ where: { id: aboutLeadership.id }, data: { metadata: asJson(metadata) } });
      console.log("Updated about leadership");
    }

    const aboutCommittee = await prisma.section.findFirst({
      where: { pageId: about.id, key: "committee" },
    });
    if (aboutCommittee) {
      const metadata = (aboutCommittee.metadata ?? {}) as {
        cards?: {
          title: string;
          role?: string;
          org?: string;
          description?: string;
          image?: string;
        }[];
      };
      const cards = metadata.cards ?? [];
      const filtered = cards.filter((c) => c.title !== "Patrick Kathurima");
      for (const card of filtered) {
        if (card.title === "Martin Kiogora Mbui") {
          card.role = "Secretary";
          card.description =
            "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement.";
          card.image = "/images/committee/martin-mbui.jpeg";
        }
        if (card.title === "Dr. Patrick Kinyua Kubai") {
          card.image = "/images/committee/patrick-kubai.jpg";
        }
        if (card.title === "Dr. Julius Ithae") {
          card.image = "/images/committee/julius-ithae.jpg";
        }
        if (card.title === "Jackline Kanana") {
          card.image = "/images/committee/jacline-kanana.png";
        }
        if (card.description) {
          card.description = card.description.replace(/\?\?\?/g, "–");
        }
        if (card.org) {
          card.org = card.org.replace(/\?\?\?/g, "–");
        }
      }
      metadata.cards = filtered;
      await prisma.section.update({ where: { id: aboutCommittee.id }, data: { metadata: asJson(metadata) } });
      console.log("Updated about committee");
    }
  }

  // 6. Update sponsorship tiers setting
  await prisma.siteSetting.upsert({
    where: { key: "sponsorshipTiers" },
    update: { value: NEW_SPONSORSHIP_TIERS },
    create: { key: "sponsorshipTiers", value: NEW_SPONSORSHIP_TIERS },
  });
  console.log("Updated sponsorship tiers");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
