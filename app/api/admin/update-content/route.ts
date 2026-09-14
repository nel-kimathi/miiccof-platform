import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const TEMP_SECRET = "miiccof-quick-fix-2026";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("secret") !== TEMP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.siteSetting.findUnique({ where: { key: "partnerLogos" } });
    if (!setting) {
      return NextResponse.json({ error: "partnerLogos setting not found" }, { status: 404 });
    }

    const logos = JSON.parse(setting.value) as { name: string; image: string; href: string }[];
    const updated = logos.map((logo) =>
      logo.name === "KNCCI Meru Chapter"
        ? { ...logo, href: "https://meruchamber.co.ke/" }
        : logo
    );

    await prisma.siteSetting.update({
      where: { key: "partnerLogos" },
      data: { value: JSON.stringify(updated) },
    });

    return NextResponse.json({ message: "KNCCI Meru Chapter link updated", logos: updated });
  } catch (error) {
    console.error("Update partner logos error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
