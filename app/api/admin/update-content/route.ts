import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@/lib/generated/prisma/client";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

function asJson(value: Record<string, unknown>): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

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

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = (session.user as { role?: string }).role;
  if (!ADMIN_ROLES.includes(role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // 1. Update home hero badge
    const home = await prisma.page.findUnique({ where: { slug: "home" } });
    if (home) {
      const hero = await prisma.section.findFirst({
        where: { pageId: home.id, key: "hero" },
      });
      if (hero) {
        const metadata = (hero.metadata ?? {}) as Record<string, unknown>;
        metadata.badge = "December 3rd,4th & 5th 2026";
        await prisma.section.update({
          where: { id: hero.id },
          data: { metadata: asJson(metadata) },
        });
      }

      // 2. Update home leadership Prof. Romanus role
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
        }
        await prisma.section.update({
          where: { id: leadership.id },
          data: { metadata: asJson(metadata) },
        });
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
        // Remove Patrick Kathurima
        const filtered = cards.filter((c) => c.title !== "Patrick Kathurima");
        // Update Martin Kiogora Mbui
        for (const card of filtered) {
          if (card.title === "Martin Kiogora Mbui") {
            card.role = "Secretary";
            card.description =
              "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement.";
          }
        }
        metadata.cards = filtered;
        await prisma.section.update({
          where: { id: committee.id },
          data: { metadata: asJson(metadata) },
        });
      }
    }

    // 4. Update about page
    const about = await prisma.page.findUnique({ where: { slug: "about" } });
    if (about) {
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
        }
        await prisma.section.update({
          where: { id: aboutLeadership.id },
          data: { metadata: asJson(metadata) },
        });
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
        // Remove Patrick Kathurima
        const filtered = cards.filter((c) => c.title !== "Patrick Kathurima");
        for (const card of filtered) {
          // Update Martin Kiogora Mbui
          if (card.title === "Martin Kiogora Mbui") {
            card.role = "Secretary";
            card.description =
              "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement.";
          }
          // Fix question marks / dashes and image path
          if (card.title === "Dr. Patrick Kinyua Kubai") {
            card.image = "/images/committee/patrick-kubai.jpg";
          }
          if (card.description) {
            card.description = card.description.replace(/\?\?\?/g, "–").replace(/–/g, "–");
          }
          if (card.org) {
            card.org = card.org.replace(/\?\?\?/g, "–").replace(/–/g, "–");
          }
        }
        metadata.cards = filtered;
        await prisma.section.update({
          where: { id: aboutCommittee.id },
          data: { metadata: asJson(metadata) },
        });
      }
    }

    // 5. Update sponsorship tiers setting
    await prisma.siteSetting.upsert({
      where: { key: "sponsorshipTiers" },
      update: { value: NEW_SPONSORSHIP_TIERS },
      create: { key: "sponsorshipTiers", value: NEW_SPONSORSHIP_TIERS },
    });

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/sponsors-partners");

    return NextResponse.json({ success: true, message: "Content updated" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
