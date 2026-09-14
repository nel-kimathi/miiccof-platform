# PROGRESS.md — MIICCOF Digital Platform

> Update this at the end of every session. Newest entry on top. Keep entries short —
> this is a handoff note to your next session, not a full changelog (git log has that).

---

## Session log

### 2026-09-14
**Done:**
- Centered homepage Organising Committee and Sponsorship Packages card grids using flexbox (`justify-center`) so partial rows no longer hug the left edge.
- Fixed Dr. Patrick Kinyua Kubai’s image path in the *home* committee section metadata from `/images/committee/Patrick-Kubai.jpg` to `/images/committee/patrick-kubai.jpg`; about page already had the lowercase path.
- Verified the fix is live at `https://miiccof-platform.vercel.app` (HTML now references the lowercase image).
- Re-applied the correct Vercel production alias after each deploy and removed the stale `miictf-platform.vercel.app` alias.
- Updated `prisma/seed.ts` to match current production content (titles, roles, image paths, event badge text).
- Ran `npm run lint`, `npm run typecheck`, and `npm run build` successfully.
- Committed and pushed the layout/seed/script changes (`b1c83bd`).

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- The local `scripts/update-production-content.ts` could not connect to TiDB Cloud (Prisma pool timeout), likely a local network/firewall issue because the production Vercel deployment connects fine. Applied the one-line image-path fix via a temporary, secret-protected `/api/admin/update-content` route that ran on Vercel, then removed the route.

**Blocked on / open questions for Nelson:**
- Still waiting for Hostinger Business Node.js hosting + MySQL credentials to import `hostinger-migration.sql`.

**Next session should start with:**
- Await Hostinger credentials; import `hostinger-migration.sql`, update `DATABASE_URL` and other production env vars, then deploy to Hostinger.
- Live preview: https://miiccof-platform.vercel.app
- Repo: https://github.com/nel-kimathi/miiccof-platform
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-09-11
**Done:**
- Renamed GitHub repo from `nel-kimathi/miictf-platform` to `nel-kimathi/miiccof-platform`
- Updated local git remote URL to point to the renamed repo (`git remote set-url origin https://github.com/nel-kimathi/miiccof-platform.git`)
- Verified `git fetch origin` and `git status` work with the new URL
- Updated `AGENTS.md` to reflect the new repo name
- Committed and pushed the doc update (`8ea64f0`)
- Disabled Vercel SSO deployment protection so the live preview is publicly accessible without login
- Verified the site loads and displays MIICCOF content at `https://miiccof-platform.vercel.app`
- Changed header and footer logos to circular white backgrounds, reduced size by 30%, and made them mobile-friendly
- Increased logo size by 20% after user feedback; adjusted mobile menu padding to match
- Fixed Vercel production alias: ensured `https://miiccof-platform.vercel.app` points to the latest deployment and removed the stale `miictf-platform.vercel.app` alias
- Updated local `.vercel/project.json` project name from `miictf-platform` to `miiccof-platform` to keep future deploys aligned
- Increased the logo image size by 20% inside the same circular background by reducing padding (header and footer)
- Re-applied the correct Vercel alias after deploy
- Updated Sponsors & Partners page with CMS-editable sponsorship tiers and Why Partner section
- Added `sponsorsIntro`, `sponsorshipTiers`, and `whyPartnerPoints` to `SiteSetting` with admin settings UI
- Built `SponsorshipSection` component: intro paragraph, 5-tier cards (Star/Platinum/Gold/Silver/Bronze with amount, slots, position), and Why Partner bullet list
- Updated public `sponsors-partners` page to render hero and CTA from CMS plus sponsorship content from settings
- Updated `prisma/seed.ts` and added `scripts/seed-sponsorship-settings.ts` for default sponsorship content
- Preserved existing "Become a sponsor" / "Register as Sponsor" CTA section unchanged
- Ran `npm run lint`, `npm run typecheck`, and `npm run build` successfully
- Committed and pushed the work (`a2bc329`); deployed to Vercel and fixed alias
- Verified live page at `https://miiccof-platform.vercel.app/sponsors-partners` displays all 5 tiers and Why Partner points
- Updated homepage `sponsorship-teaser` section to use the same 5-tier package cards as the Sponsors & Partners page (no Why Partner on homepage)
- Made `SponsorshipSection` reusable with configurable title, intro, Why Partner visibility, and CTA
- Updated homepage to render sponsorship section from shared settings while keeping other CMS sections intact
- Ran lint/typecheck/build and deployed (`02cba49`)
- Verified homepage displays the 5 sponsorship tiers with the "Sponsorship Details" CTA
- Updated home hero badge to "December 3rd,4th & 5th 2026" and added green blinking pulse dot on the left of the badge
- Updated Prof. Romanus Odhiambo title to "Vice Chancellor MUST" on home and about pages
- Removed Patrick Kathurima from home and about organising committees; made Martin Kiogora Mbui Secretary
- Fixed KNCCI description text and question marks in about organising committee
- Fixed Dr. Patrick Kinyua Kubai image path case (`patrick-kubai.jpg`) in seed data
- Centered sponsorship package cards on homepage and sponsors page using flexbox
- Removed "Powered by [Company]" from Star Partner tier in code defaults
- Added temporary admin-only API route `/api/admin/update-content` to apply content changes to the production TiDB database
- Updated production TiDB database directly using the provided connection string; all requested content changes are now live
- Removed question marks from about body and home event times; replaced em-dashes correctly
- Updated about body first sentence to "The Meru International Investors Conference and Consumer Fair (MIICCOF)"
- Removed temporary API route and verify script; kept reusable production update scripts
- Cleaned `.next` build cache and rebuilt to clear stale type references
- Committed and pushed the progress updates (`4aa897f`, `40d806e`, `e9f9399`, `08e49cc`, `efbcd30`, `97a1e9e`, `a2bc329`, `02cba49`, `5d16862`, `be4327d`)

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- None

**Blocked on / open questions for Nelson:**
- Still waiting for Hostinger Business Node.js hosting + MySQL credentials to import `hostinger-migration.sql`

**Next session should start with:**
- Await Hostinger credentials; import `hostinger-migration.sql`, update `DATABASE_URL` and other production env vars, then deploy to Hostinger
- Live preview: https://miiccof-platform.vercel.app
- Repo: https://github.com/nel-kimathi/miiccof-platform
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-09-10 (later session)
**Done:**
- Built Delegate Management module: list/search/filter by role=DELEGATE, approve/reject, export CSV, server-side RBAC
- Built Sponsor Management module: list/search/filter by role=SPONSOR, approve/reject, export CSV
- Built Exhibitor Management module: list/search/filter by role=EXHIBITOR, approve/reject, export CSV
- Built Reports module: aggregate stats, country/category breakdowns, CSV exports for users/countries/categories
- Rebranded admin sidebar label from "MIICTF Admin" to "MIICCOF Admin"
- Reverted unfinished `SystemLog` schema change to avoid migration risk while modules using only the existing User model were completed
- `npm run lint` and `npm run typecheck` pass locally for all changes
- Committed and pushed three commits: `edd3ae5`, `6f097d4`, `0729255`
- Fixed Vercel production deployment failure by adding `postinstall: "prisma generate"` to `package.json` so the generated Prisma client is created during Vercel's `npm install`
- GitHub Actions run #48 and Vercel deployment for commit `8b3aadd` are now passing
- Added `ExhibitionHall` and `Booth` models with `BoothStatus` enum (AVAILABLE, RESERVED, ALLOCATED, OCCUPIED), applied migration locally and to TiDB Cloud
- Built Exhibition Hall admin CRUD (list, create, edit, delete) under `/admin/booths`
- Built Booth admin CRUD (create, edit, delete, filter by hall) and exhibitor assignment UI under `/admin/booths`
- Committed and pushed schema migration (`fd762d9`), hall CRUD (`44aef78`) and booth CRUD + assignment (`edd94ff`); Vercel deployments successful
- Added `SystemLog` model and applied migration to TiDB Cloud via temporary admin-only API route (route removed after use)
- Built `/admin/logs` audit log viewer and `logAdminAction` helper
- Logged user, news, delegate, sponsor, exhibitor, hall and booth admin actions to `SystemLog`
- Removed temporary setup-admin page and system_log migration route after use
- Added `SiteSetting` model and applied migration to TiDB Cloud via temporary admin-only API route (route removed after use)
- Built `/admin/settings` page to edit site name, tagline, contact email, event dates/location, social URLs
- Wired site settings into public footer (site name, tagline, contact email, location, copyright)
- Security hardening pass: added explicit session expiry (7 days), secure cookies in production, HTML escaping in contact/auth emails, confirmed server-side input validation and RBAC on all admin actions
- Replaced header and footer logos with uploaded MIICCOF logo variants (`logo-no-bg.png` for header/footer, `logo-with-bg.png` retained for future light-background use)
- Increased header logo size and added white 20px rounded background so it is clearly visible on the hero and scrolled header

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- Completed Sponsor/Exhibitor management using existing User model fields only (organization as company, category as tier/industry). Full sponsor/exhibitor profiles with brand assets, contact persons, products and booth allocation will require schema additions later.
- GitHub Actions run #43 had a failure caused by a Next `<a>` tag; runs #44 onward and Vercel deployments are now passing.
- Booth schema designed to support a future visual booth map: halls contain booths with structured number, size, category, status, price, and exhibitor relation.

**Blocked on / open questions for Nelson:**
- Still waiting for Hostinger MySQL credentials to import `hostinger-migration.sql`

**Next session should start with:**
- Continue Booth Management: booth CRUD and exhibitor assignment
- Then System Logs, Settings, security hardening pass
- Live site: https://miiccof-platform.vercel.app
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-09-10
**Done:**
- Replaced MAIICTF acronym with MIICCOF across the public site
- Updated all hardcoded references in components, layouts, metadata, auth emails, contact form, login/register pages
- Updated TiDB Cloud database: replaced MAIICTF in page titles, section titles/subtitles/body/metadata, and news articles
- Updated seed file and project docs (AGENTS.md, BUILD_PLAN.md, PROGRESS.md, README.md) for consistency
- Committed all uncommitted work to git and pushed to GitHub (commit `6641ffa`)
- Exported full TiDB Cloud database to `hostinger-migration.sql` ready for Hostinger import

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- Site acronym changed from MAIICTF to MIICCOF (Meru International Investment Conference and Consumer Fair) per user request

**Blocked on / open questions for Nelson:**
- Waiting for Hostinger MySQL credentials to import the database

**Next session should start with:**
- Import `hostinger-migration.sql` into Hostinger MySQL and update DATABASE_URL
- Build Phase 2 admin portal modules (User Management, Dashboard, Delegate/Sponsor/Exhibitor CRUD, News, Booths, Reports, System Logs)
- Live site: https://miiccof-platform.vercel.app
- TiDB Cloud DB credentials: stored in Vercel env vars (DATABASE_URL)
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-09-09
**Done:**
- Deployed to Vercel (production): https://miiccof-platform.vercel.app
- Set up TiDB Cloud serverless MySQL for production database
- Exported local MySQL data and imported into TiDB Cloud (9 pages, 29 sections, 3 news)
- Fixed Prisma adapter SSL config for TiDB Cloud connections (`lib/db.ts` — parse URL, pass `PoolConfig` with SSL)
- Added `dynamic = "force-dynamic"` to all CMS-backed pages (prevents build-time DB queries)
- Added graceful error handling in `lib/content.ts` (try/catch returns null/empty instead of crashing)
- Added fallback UI in `CmsPage`, news, and contact pages when DB is unavailable
- Changed fonts: Inter → Source Sans 3 (body), Fraunces → Manrope (headings/buttons/nav)
- Compressed 9 oversized images (opening-ceremony.jpg: 13.8MB → 0.1MB, total savings ~95%)
- Added lazy loading + async decoding to `ImgWithFallback` component

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- TiDB Cloud (free tier) used for production MySQL instead of Hostinger remote DB
- Database URL uses SSL (`rejectUnauthorized: true`) with `PrismaMariaDb` adapter via PoolConfig
- Fonts changed from Figma-reference Fraunces/Inter to Manrope/Source Sans 3 per user request

**Blocked on / open questions for Nelson:**
- None

**Next session should start with:**
- Run `scripts/start-mysql.ps1` to start local MySQL, then `npm run dev`
- Check `BUILD_PLAN.md` for next unchecked items — Phase 2 admin portal modules
- TiDB Cloud DB credentials: stored in Vercel env vars (DATABASE_URL)
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-08-19
**Done:**
- Phase 2 started: confirmed all 5 roles exist correctly in Prisma schema + Better Auth config (no changes needed)
- Simplified `/admin` page to minimal "Admin access confirmed" + role display
- Added server-side route protection via `app/admin/layout.tsx` — only ADMIN and SUPER_ADMIN can access `/admin/*`, others redirected to their role dashboard
- Seeded admin test users: `admin@test.local` (ADMIN), `superadmin@test.local` (SUPER_ADMIN) — password: `Password123!`
- Reset `delegate@test.local` back to DELEGATE role (was accidentally overwritten)
- Installed shadcn sidebar component (base-nova style, uses `render` prop not `asChild`)
- Created admin portal shell: sidebar navigation with 10 modules (Dashboard, Users, Delegates, Sponsors, Exhibitors, Booths, News, Reports, Settings, System Logs)
- Created stub pages for all admin sub-routes
- Updated admin dashboard page with summary card placeholders

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- Used shadcn sidebar component with `render` prop pattern (base-nova style difference from Radix `asChild`)
- Admin layout uses client shell (`AdminShell`) wrapping server auth guard — idiomatic Next.js App Router pattern

**Blocked on / open questions for Nelson:**
- None

**Next session should start with:**
- Run `scripts/start-mysql.ps1` to start local MySQL, then `npm run dev`
- Check `BUILD_PLAN.md` for next unchecked items — Dashboard data wiring, User Management, System Logs
- Test users: delegate@test.local, sponsor@test.local, admin@test.local, superadmin@test.local (all verified, password: Password123!)
- `npx prisma generate` needed after any schema.prisma change
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

### 2026-08-08
**Done:**
- Completed Phase 0: Next.js 15 scaffold, Tailwind v4 + shadcn/ui base-nova, Prisma 7 + MySQL schema, Better Auth, folder structure, CI, local MySQL setup, initial migration + seed
- Completed Phase 1: CMS content model (Page/Section/News), seed data (9 pages, 26 sections, 3 news), all public pages, auth forms (register/login), role-based dashboard guards, RBAC redirect, E2E verification
- Auth E2E tested and confirmed: register → email verification → login → role-based dashboard redirect → password hashed (salted scrypt, 161 chars) → session cookie works across requests
- RBAC guard verified: sponsor session gets 307 on /delegate and /admin, 200 on /sponsor
- Unverified login correctly rejected with 403 EMAIL_NOT_VERIFIED
- Newsletter + contact form server actions wired (DB-ready, standard useActionState pattern)
- README updated with local dev setup instructions
- CI green (latest: commit `9e4de5c`)

**Decisions / deviations from AGENTS.md or BUILD_PLAN.md (if any):**
- NewsletterSubscriber table added (Figma footer has newsletter signup) — justified by "match Figma structure" requirement
- News model + news list/detail pages built in Phase 1 rather than waiting for Phase 2 — the model exists and public site reads from it, avoids a gap
- role mapping handled via `databaseHooks.user.create.after` (direct prisma.update) because additionalFields.input:false prevents setting role from client
- No auto-session on signup (token: null) — dashboard guards require emailVerified
- Green/gold theme (`oklch(0.4 0.11 158)` primary) is placeholder until exact Figma hex values are available
- Prisma 7 requires explicit `npx prisma generate` after schema changes (migrate dev doesn't always auto-regenerate)

**Blocked on / open questions for Nelson:**
- None

**Next session should start with:**
- Run `scripts/start-mysql.ps1` to start local MySQL, then `npm run dev`
- Check `BUILD_PLAN.md` for next unchecked items — likely Phase 2 (admin portal modules)
- All test users in DB: delegate@test.local, sponsor@test.local (both verified, password: Password123!)
- `npx prisma generate` needed after any schema.prisma change
- Dev server log at `C:\Users\HUDINI\AppData\Local\Temp\opencode\next-dev.log`

---

*(No sessions logged yet — first session should scaffold Phase 0 and add the first entry here.)*
