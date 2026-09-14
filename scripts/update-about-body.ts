import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import type { PoolConfig } from "mariadb";

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

async function main() {
  const about = await prisma.page.findUnique({ where: { slug: "about" } });
  if (!about) {
    console.log("About page not found");
    return;
  }
  const aboutBody = await prisma.section.findFirst({
    where: { pageId: about.id, key: "body" },
  });
  if (!aboutBody?.body) {
    console.log("About body not found");
    return;
  }
  const newBody = aboutBody.body
    .replace(
      "The Meru Annual International Investment Conference & Trade Fair (MIICCOF)",
      "The Meru International Investors Conference and Consumer Fair (MIICCOF)"
    )
    .replace(/\?\?\?/g, "—");
  await prisma.section.update({
    where: { id: aboutBody.id },
    data: { body: newBody },
  });
  console.log("Updated about body");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
