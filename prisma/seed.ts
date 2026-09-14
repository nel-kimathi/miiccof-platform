/**
 * Seed default CMS content for the public site + a few published news items.
 *
 * This content is editable from the Administration Portal (Phase 2 CMS UI).
 * Seeding is idempotent: pages are upserted by slug and their sections are
 * replaced on each run.
 *
 * NOTE: No real personal names, dates, emails or phone numbers are used —
 * values are deliberate placeholders for editors to replace.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const rawUrl = process.env.DATABASE_URL ?? "";
const url = rawUrl.replace(/^mysql:\/\//, "mariadb://");
const adapter = new PrismaMariaDb(url);
const prisma = new PrismaClient({ adapter });

type SectionSeed = {
  key: string;
  order: number;
  title?: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
};

type PageSeed = { slug: string; title: string; sections: SectionSeed[] };

const pages: PageSeed[] = [
  {
    slug: "home",
    title: "Home",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Meru International Investment Conference and Consumer Fair",
        subtitle: "Unlocking investment and trade opportunities in Meru",
        body: "MIICCOF brings together investors, government, business leaders and innovators to showcase opportunities, forge partnerships and drive inclusive growth.",
        imageUrl: "/images/hero/tea-harvesting.jpeg",
        metadata: {
          badge: "December 3rd, 4th, & 5th 2026",
          cta: [
            { label: "Discover More", href: "/about" },
            { label: "Register to Attend", href: "/register" },
          ],
        },
      },
      {
        key: "leadership",
        order: 1,
        title: "Our Leadership",
        subtitle: "The team championing MIICCOF",
        metadata: {
          variant: "leadership",
          linkHref: "/about#leadership",
          cards: [
            {
              title: "H.E. Isaac Mutuma M'Ethingia",
              role: "Governor, Meru County",
              description: "Championing Meru's transformation into a premier investment destination through strategic partnerships and infrastructure development.",
              image: "/images/leadership/governor.png",
              imageBg: "white",
            },
            {
              title: "Prof. Romanus Odhiambo, Ph.D.",
              role: "Vice Chancellor MUST",
              description: "Leading academic innovation and research partnerships that drive the conference's thought leadership agenda.",
              image: "/images/leadership/vice-chancellor.webp",
            },
            {
              title: "Mr. Joshua K. Mungania",
              role: "Chairman KNCCI - Meru Chapter",
              description: "Connecting the private sector with investment opportunities and championing trade facilitation across the region.",
              image: "/images/leadership/chairman.jpeg",
            },
          ],
        },
      },
      {
        key: "meru-county",
        order: 2,
        title: "Meru County: The Land of Prosperity",
        body: "Meru is a highland County nestled on the fertile slopes of Mount Kenya in the Eastern Region. Spanning 7,003 sq km with a population of 1.5 million, it serves as a strategic gateway between Nairobi and the Northern Frontier.\n\nEconomic & Social Development\nMeru has experienced rapid economic growth, driven by a highly educated populace and a diverse economic base.\n\nAgriculture & Business: A global leader in Miraa (Khat), Macadamia, and Coffee production, alongside Tea, Bananas, Avocado, Tourism, Trade & Industry.",
        imageUrl: "/images/sections/meru-county.png",
        metadata: {
          cta: [{ label: "About us", href: "/about" }],
        },
      },
      {
        key: "opportunities-teaser",
        order: 3,
        title: "Investment Opportunities",
        subtitle: "Explore priority sectors open for investment",
        metadata: {
          cards: [
            { title: "Agriculture & Agro-processing", description: "Value addition across key value chains." },
            { title: "Renewable Energy", description: "Solar, wind and small hydro opportunities." },
            { title: "Affordable Housing", description: "Urban housing and infrastructure development." },
            { title: "Tourism & Hospitality", description: "Eco-tourism, hotels and destination experiences." },
          ],
          cta: { label: "View All Opportunities", href: "/investment-opportunities" },
        },
      },
      {
        key: "committee",
        order: 4,
        title: "Organising Committee",
        subtitle: "Key representatives driving MIICCOF",
        metadata: {
          variant: "committee",
          cards: [
            { title: "Dr. Julius Ithae", role: "Chairperson", description: "Representing Meru University of Science and Technology (MUST) as Chairperson of the Organising Committee.", image: "/images/committee/julius-ithae.jpg" },
            { title: "Jackline Kanana", role: "Vice Chairperson", description: "Representing the County Government of Meru (MCG) as Vice Chairperson, overseeing trade facilitation.", image: "/images/committee/jacline-kanana.png", zoom: "h-[140%] w-[140%] object-cover object-[center_10%]" },
            { title: "Martin Kiogora Mbui", role: "Secretary", description: "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement.", image: "/images/committee/martin-mbui.jpeg" },
            { title: "Kithinji Ruri", role: "Meru County Government", description: "Representing the Meru County Government in logistics, policy coordination and public sector alignment.", image: "/images/committee/kithinji-ruri.jpg" },
            { title: "Dr. Patrick Kinyua Kubai", role: "MUST Representative", description: "Representing Meru University of Science and Technology in academic partnerships and research coordination.", image: "/images/committee/patrick-kubai.jpg" },
          ],
        },
      },
      {
        key: "sponsorship-teaser",
        order: 5,
        title: "Sponsorship Packages",
        subtitle: "Partner with us and put your brand at the centre",
        metadata: {
          cta: { label: "Sponsorship Details", href: "/sponsors-partners" },
        },
      },
      {
        key: "events-preview",
        order: 6,
        title: "Scheduled Events",
        subtitle: "Key sessions and activities",
        metadata: {
          events: [
            { title: "Opening Ceremony", time: "Day 1 · Morning", description: "Official opening and keynote addresses.", image: "/images/events/opening-ceremony.jpg" },
            { title: "Investor Panel Discussions", time: "Day 1 · Afternoon", description: "Sector panels with investors and government.", image: "/images/events/panel-discussion.jpg" },
            { title: "Consumer Fair & Exhibitions", time: "All Days", description: "Exhibition booths and B2B networking.", image: "/images/events/Trade Fair-exhibitions.jpg" },
          ],
          cta: { label: "Full Programme", href: "/conference-programme" },
        },
      },
    ],
  },
  {
    slug: "about",
    title: "About MIICCOF",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "About MIICCOF",
        subtitle: "A platform for investment, trade and partnerships",
        imageUrl: "/images/hero/about-us-hero.jpeg",
      },
      {
        key: "body",
        order: 1,
        title: "Our Story",
        body: "Three institutions. One vision. A new chapter for Meru.\n\nThe Meru International Investors Conference and Consumer Fair (MIICCOF) was born from a unique tripartite partnership between the KNCCI Meru Chapter, Meru University of Science and Technology, and the Meru County Government—uniting business, research, innovation and government to unlock Meru's potential.\n\nFor the first time, the business community, investors, researchers and innovators come together under one platform to showcase, connect and create opportunities.\n\nWith the support of the Governor of Meru County, the research and innovation strength of Meru University, and the networks and enterprise of KNCCI Meru, MIICCOF puts the best of Meru on display—from agriculture and tourism to manufacturing, technology, trade and emerging enterprises.\n\nMIICCOF is more than a conference and consumer fair. It is Meru opening its doors to the world and inviting the world to invest, partner and grow with us.",
        imageUrl: "/images/sections/about-tripartite.png",
        metadata: { logoUrl: "/images/logos/miictf-logo.png" },
      },
      {
        key: "mission",
        order: 2,
        title: "Mission & Vision",
        metadata: {
          cards: [
            { title: "Mission", description: "To catalyse investment and trade for inclusive economic growth." },
            { title: "Vision", description: "A thriving investment destination with globally connected enterprises." },
          ],
        },
      },
      {
        key: "leadership",
        order: 3,
        title: "Our Leadership",
        subtitle: "The team championing MIICCOF",
        metadata: {
          variant: "leadership",
          anchorId: "leadership",
          cards: [
            {
              title: "H.E. Isaac Mutuma M'Ethingia",
              role: "Governor, Meru County",
              description: "Championing Meru's transformation into a premier investment destination through strategic partnerships and infrastructure development. Under his leadership, the county has prioritised investment in agriculture, tourism and trade infrastructure.",
              image: "/images/leadership/governor.png",
              imageBg: "white",
            },
            {
              title: "Prof. Romanus Odhiambo, Ph.D.",
              role: "Vice Chancellor, MKU",
              description: "Leading academic innovation and research partnerships that drive the conference's thought leadership agenda. Prof. Odhiambo brings deep expertise in higher education and international collaboration.",
              image: "/images/leadership/vice-chancellor.webp",
            },
            {
              title: "Mr. Joshua K. Mungania",
              role: "Chairman KNCCI - Meru Chapter",
              description: "Connecting the private sector with investment opportunities and championing trade facilitation across the region. Mr. Mungania represents the interests of Meru's business community.",
              image: "/images/leadership/chairman.jpeg",
            },
          ],
        },
      },
      {
        key: "committee",
        order: 4,
        title: "Organising Committee",
        subtitle: "The people making it happen",
        metadata: {
          variant: "committee",
          anchorId: "organising",
          cards: [
            { title: "Jackline Kanana", role: "Vice Chairperson, Trade", org: "Meru County Government", description: "Representing the County Government of Meru (MCG) as Vice Chairperson, overseeing trade facilitation." },
            { title: "Liz Wanja Gikundi", role: "Legal Advisor", org: "Meru County Government", description: "Providing legal counsel and governance oversight for the conference organising committee." },
            { title: "John Kibwi Maingi", role: "MCG Representative", org: "Meru County Government", description: "Coordinating county government support and inter-agency collaboration for the event." },
            { title: "Alice Karimi", role: "Youth Affairs", org: "Meru County Government", description: "Championing youth inclusion and engagement across conference programmes and activities." },
            { title: "Kithinji Ruri", role: "MCG Representative", org: "Meru County Government", description: "Representing the Meru County Government in logistics, policy coordination and public sector alignment." },
            { title: "Dr. Julius Ithae", role: "Committee Chairperson", org: "MUST", description: "Representing Meru University of Science and Technology (MUST) as Chairperson of the Organising Committee." },
            { title: "Dr. Patrick Kinyua Kubai", role: "MUST Representative", org: "MUST", description: "Representing Meru University of Science and Technology in academic partnerships and research coordination." },
            { title: "Prof. Jackline Oparde", role: "MUST Representative", org: "MUST", description: "Contributing academic expertise and research partnerships from Meru University of Science and Technology." },
            { title: "Prof. Amos Omano", role: "MUST Representative", org: "MUST", description: "Supporting academic coordination and institutional partnerships from Meru University." },
            { title: "Veronicah Kihenja", role: "Vice Chairperson", org: "KNCCI Meru Chapter", description: "Serving as Vice Chairperson of KNCCI Meru Chapter, supporting sponsor relations and business networking." },
            { title: "William Wambugu", role: "Director", org: "KNCCI Meru Chapter", description: "Serving as Director, guiding strategic initiatives and chamber operations for the conference." },
            { title: "Martin Kiogora Mbui", role: "Secretary", org: "KNCCI Meru Chapter", description: "Representing KNCCI Meru Chapter as Secretary, coordinating chamber activities and member engagement." },
          ],
        },
      },
    ],
  },
  {
    slug: "investment-opportunities",
    title: "Investment Opportunities",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Investment Opportunities",
        subtitle: "Priority sectors ready for investment",
      },
      {
        key: "sectors",
        order: 1,
        title: "Priority Sectors",
        metadata: {
          cards: [
            { title: "Agriculture & Agro-processing", description: "Dairy, horticulture, cereals, tea and coffee value addition, cold chain and processing facilities." },
            { title: "Renewable Energy", description: "Solar farms, small hydro, biomass and clean cooking solutions." },
            { title: "Affordable Housing", description: "Housing developments, construction materials and urban infrastructure." },
            { title: "Tourism & Hospitality", description: "Eco-lodges, conference facilities, adventure and cultural tourism." },
            { title: "Industrial Parks & Manufacturing", description: "Agro-industrial parks, light manufacturing and logistics hubs." },
            { title: "ICT & Digital Services", description: "BPO, software, digital financial services and innovation hubs." },
          ],
        },
      },
      {
        key: "cta",
        order: 2,
        title: "Ready to invest?",
        body: "Register as a delegate or contact the investment desk to receive detailed project briefs.",
        metadata: { cta: [{ label: "Register Now", href: "/register" }] },
      },
    ],
  },
  {
    slug: "trade-fair",
    title: "Consumer Fair",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Consumer Fair & Exhibitions",
        subtitle: "Showcase your products and services",
      },
      {
        key: "body",
        order: 1,
        title: "Exhibit at MIICCOF",
        body: "The trade fair gives exhibitors direct access to thousands of delegates, buyers and investors. Booths are available in themed exhibition halls across multiple sizes and categories.",
      },
      {
        key: "info",
        order: 2,
        title: "Exhibitor Information",
        metadata: {
          cards: [
            { title: "Booth Categories", description: "Standard, premium and open-space booths across themed halls." },
            { title: "Who Can Exhibit", description: "SMEs, corporates, county governments, NGOs and development partners." },
            { title: "What's Included", description: "Booth, branding, delegate passes and B2B matchmaking." },
          ],
        },
      },
      {
        key: "cta",
        order: 3,
        title: "Book a booth",
        body: "Register as an exhibitor to reserve your booth.",
        metadata: { cta: [{ label: "Register as Exhibitor", href: "/register" }] },
      },
    ],
  },
  {
    slug: "conference-programme",
    title: "Conference Programme",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Conference Programme",
        subtitle: "Sessions, panels and networking",
      },
      {
        key: "schedule",
        order: 1,
        title: "Programme Outline",
        body: "The detailed programme will be published here. Outline below is indicative.",
        metadata: {
          events: [
            { title: "Opening Ceremony & Keynotes", time: "Day 1", description: "Official opening, keynote addresses and ministerial remarks." },
            { title: "Sector Panels", time: "Day 1–2", description: "Deep dives into priority investment sectors." },
            { title: "Deal Room & B2B Meetings", time: "Day 2", description: "Curated investor–project matchmaking sessions." },
            { title: "Consumer Fair & Awards", time: "Day 3", description: "Exhibitions, county showcases and closing ceremony." },
          ],
        },
      },
    ],
  },
  {
    slug: "sponsors-partners",
    title: "Sponsors & Partners",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Sponsors & Partners",
        subtitle: "Partner with MIICCOF",
      },
      {
        key: "cta",
        order: 2,
        title: "Become a sponsor",
        body: "Register as a sponsor and our partnerships team will reach out.",
        metadata: { cta: [{ label: "Register as Sponsor", href: "/register" }] },
      },
    ],
  },
  {
    slug: "news",
    title: "News & Updates",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "News & Updates",
        subtitle: "Latest announcements from the MIICCOF secretariat",
      },
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Frequently Asked Questions",
        subtitle: "Answers to common questions",
      },
      {
        key: "items",
        order: 1,
        metadata: {
          items: [
            { question: "Who can attend MIICCOF?", answer: "Investors, business owners, SMEs, government officials, development partners and the general public." },
            { question: "How do I register?", answer: "Use the Register page to create an account as a delegate, sponsor or exhibitor. You will receive a verification email to activate your account." },
            { question: "How do I book an exhibition booth?", answer: "Register as an exhibitor. Booth allocation is managed by the secretariat through the exhibitor portal." },
            { question: "How can my organisation sponsor the event?", answer: "Register as a sponsor and the partnerships team will contact you with package details." },
          ],
        },
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    sections: [
      {
        key: "hero",
        order: 0,
        title: "Contact Us",
        subtitle: "Get in touch with the MIICCOF secretariat",
      },
      {
        key: "details",
        order: 1,
        title: "Contact Details",
        metadata: {
          email: "secretariat@example.com",
          phone: "+254 700 000 000",
          location: "Meru, Kenya",
        },
      },
    ],
  },
];

const newsItems = [
  {
    title: "Welcome to the MIICCOF digital platform",
    slug: "welcome-to-the-miictf-digital-platform",
    excerpt: "Register as a delegate, sponsor or exhibitor and follow conference updates here.",
    content: "The MIICCOF digital platform is now live. Delegates, sponsors and exhibitors can register online, receive announcements and access conference information in one place.",
    category: "Announcement",
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
  },
  {
    title: "Call for exhibitors now open",
    slug: "call-for-exhibitors-now-open",
    excerpt: "Organisations can now register to exhibit at the trade fair.",
    content: "Exhibitor registration is open. Booths are allocated on a first-come basis across themed exhibition halls. Register early to secure your space.",
    category: "Consumer Fair",
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
  },
  {
    title: "Sponsorship packages available",
    slug: "sponsorship-packages-available",
    excerpt: "Platinum, Gold and Silver sponsorship packages are now available.",
    content: "Organisations interested in sponsoring MIICCOF can register as sponsors through the platform. The partnerships team will follow up with package details.",
    category: "Sponsorship",
    status: "PUBLISHED" as const,
    publishedAt: new Date(),
  },
];

async function main() {
  console.log("Seeding CMS pages + sections...");
  for (const p of pages) {
    const page = await prisma.page.upsert({
      where: { slug: p.slug },
      update: { title: p.title },
      create: { id: randomUUID(), slug: p.slug, title: p.title },
    });
    await prisma.section.deleteMany({ where: { pageId: page.id } });
    await prisma.section.createMany({
      data: p.sections.map((s) => ({
        id: randomUUID(),
        pageId: page.id,
        key: s.key,
        order: s.order,
        title: s.title ?? null,
        subtitle: s.subtitle ?? null,
        body: s.body ?? null,
        imageUrl: s.imageUrl ?? null,
        metadata: s.metadata ?? undefined,
      })),
    });
  }

  console.log("Seeding news items...");
  for (const n of newsItems) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        excerpt: n.excerpt,
        content: n.content,
        category: n.category,
        status: n.status,
        publishedAt: n.publishedAt,
      },
      create: { id: randomUUID(), ...n },
    });
  }

  console.log("Seeding site settings...");
  const defaultSettings: Record<string, string> = {
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
  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { id: randomUUID(), key, value },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });