"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { logAdminAction } from "@/lib/admin/system-log";
import { revalidatePath } from "next/cache";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) throw new Error("Unauthorized");
  const role = (session.user as { role?: string }).role;
  if (!ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number])) {
    throw new Error("Forbidden");
  }
  return session;
}

const DEFAULT_SPONSORSHIP_TIERS = [
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
];

const DEFAULT_WHY_PARTNER_POINTS = [
  "Align your brand with a high-level investment and business platform in Meru County",
  "Engage investors, entrepreneurs, consumers, government, and financial institutions",
  "Showcase products through exhibition, activation, and direct customer engagement",
  "Strengthen visibility via event branding, media exposure, and digital marketing",
  "Build strategic relationships through VIP networking and B2B matchmaking",
  "Demonstrate commitment to enterprise growth and regional investment",
];

const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "MIICCOF",
  siteTagline: "Meru International Investment Conference & Consumer Fair",
  contactEmail: "secretariat@example.com",
  supportPhone: "",
  eventStartDate: "2026-12-03",
  eventEndDate: "2026-12-05",
  eventLocation: "Meru, Kenya",
  socialFacebook: "",
  socialTwitter: "",
  socialLinkedIn: "",
  sponsorsIntro:
    "MIICCOF is a flagship platform convening investors, businesses, government, development partners, financial institutions, and consumers to unlock investment and commercial opportunities across Meru County and the wider region, showcasing potential in agriculture and agribusiness, avocado and miraa value addition, tourism and hospitality, manufacturing, trade, financial services, technology, SMEs, and Special Economic Zone (SEZ) opportunities.",
  sponsorshipTiers: JSON.stringify(DEFAULT_SPONSORSHIP_TIERS),
  whyPartnerPoints: JSON.stringify(DEFAULT_WHY_PARTNER_POINTS),
};

export type SponsorshipTier = {
  name: string;
  amount: string;
  slots: string;
  position: string;
};

export type SponsorshipSettings = {
  sponsorsIntro: string;
  sponsorshipTiers: SponsorshipTier[];
  whyPartnerPoints: string[];
};

export async function getSettings() {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const setting of settings) {
    map[setting.key] = setting.value;
  }
  // Ensure all default keys exist
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (!(key in map)) map[key] = value;
  }
  return map;
}

export async function getPublicSettings() {
  return getSettings();
}

export async function getSponsorshipSettings(): Promise<SponsorshipSettings> {
  const settings = await getSettings();
  return {
    sponsorsIntro: settings.sponsorsIntro ?? DEFAULT_SETTINGS.sponsorsIntro,
    sponsorshipTiers: parseTiers(settings.sponsorshipTiers),
    whyPartnerPoints: parsePoints(settings.whyPartnerPoints),
  };
}

function parseTiers(raw: string | undefined): SponsorshipTier[] {
  if (!raw) return DEFAULT_SPONSORSHIP_TIERS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SponsorshipTier[];
  } catch {
    // fallthrough
  }
  return DEFAULT_SPONSORSHIP_TIERS;
}

function parsePoints(raw: string | undefined): string[] {
  if (!raw) return DEFAULT_WHY_PARTNER_POINTS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // fallthrough
  }
  return DEFAULT_WHY_PARTNER_POINTS;
}

const updateSchema = z.record(z.string().min(1).max(100), z.string().max(10000));

export async function updateSettings(formData: FormData) {
  const session = await requireAdmin();

  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") raw[key] = value;
  }

  const parsed = updateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues.map((i) => i.message).join(", ") };
  }

  try {
    await prisma.$transaction(
      Object.entries(parsed.data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    );
    await logAdminAction({
      userId: session.user.id,
      action: "UPDATE",
      entityType: "SYSTEM",
      details: { keys: Object.keys(parsed.data) },
    });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath("/sponsors-partners");
    return { success: true };
  } catch {
    return { error: "Failed to update settings" };
  }
}
