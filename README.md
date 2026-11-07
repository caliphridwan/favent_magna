# Favent Magna Nigeria Limited — Website & Admin CMS

The redesigned **faventmagna.com**: a Next.js 15 (App Router) site with a PostgreSQL-backed admin dashboard. Every service, partner, project, page heading and contact detail is stored in the database and editable without code.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion · Lucide · Server Actions + Route Handlers · Prisma · PostgreSQL · Zod · React Hook Form · Cloudinary · Resend · JWT sessions (jose) + bcrypt.

---

## ⚠️ Read first — what still needs company input

Company content (About copy, mission, vision, values, approach, services, OEM partners, contact details and the homepage testimonial) has been imported from the existing faventmagna.com into `prisma/content.mjs`. Still to do before launch:

| Item | Where to fix |
|---|---|
| Logo (light + dark) and favicon — upload the files from the old site (`/wp-content/uploads/2023/03/Transparent-b.png`, `Transparent-j.png`, `Transparent-e.png`) | Admin → Homepage & settings · replace `public/favicon.svg` |
| Partner logos — upload the authentic logos | Admin → Partners |
| Business hours, real LinkedIn company URL | Admin → Homepage & settings → Contact / Social |
| Corporate profile PDF | Admin → Homepage & settings → Company |
| Confirm formal partner status (the old site said "certified distributor" / "authorised supplier"; the new copy says "OEM-backed" until confirmed). Put confirmed status in each partner's *Verified partner status* field | Admin → Partners |
| Sprintly and RAY — in the brief but not on the old site; hidden until confirmed | Admin → Partners |
| Service details (capabilities/applications/benefits) expanded from the old one-line descriptions — **review** | Admin → Services |
| Industries (seeded as **unpublished drafts** — publish only sectors actually served) | Admin → Industries |
| Projects — none seeded. A project can only be published once marked *verified* | Admin → Projects |
| Privacy notice wording (have it reviewed against the NDPA) | Admin → Pages & SEO → /privacy |

**Database already seeded with the earlier placeholders?** Run `npx prisma migrate dev` (adds the new partner category) and then `npm run content:import` once. It overwrites settings, pages, services, partners and solutions with the imported content.

The admin **Overview** page lists the missing contact/brand items until they're filled in.

---

## 1. Local setup

Requirements: **Node 20 LTS** (works on macOS Big Sur), PostgreSQL 14+ (Postgres.app, Homebrew, or a free Neon/Render database).

```bash
cp .env.example .env          # fill in DATABASE_URL and AUTH_SECRET at minimum
npm install
npx prisma migrate dev --name init   # creates prisma/migrations/ and the tables
npm run db:seed               # services, partners, solutions, pages + first super admin
npm run dev                   # http://localhost:3000   admin: http://localhost:3000/admin
```

- `AUTH_SECRET`: `openssl rand -base64 48`
- The first super admin comes from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (12+ chars). Or later: `npm run admin:create -- you@faventmagna.com "Strong-Password-123" "Your Name"`.
- **Commit the generated `prisma/migrations/` folder.** Production runs `prisma migrate deploy`, which applies committed migrations only. (Migrations weren't generated in the build environment because package installation was unavailable there.)
- Without Cloudinary keys, uploads are disabled but URLs can be pasted. Without a Resend key, enquiries still save and emails are skipped (logged).

Checks before deploying:

```bash
npm run typecheck && npm run lint && npm run build && npm start
```

---

## 2. Project structure

```
prisma/schema.prisma        Data model (16 models, enums, indexes, cascades)
prisma/content.mjs          Site content (imported from the old site + brief)
prisma/seed.mjs             Idempotent seed (creates missing rows only)
scripts/import-content.mjs  Overwrite DB content from content.mjs
redirects.config.ts         301 map from old URLs
src/middleware.ts           Protects /admin and /api/admin
src/app/(site)/             Public pages
  page.tsx                  Home (hero, intro, services, why, partners, solutions,
                            industries, projects, approach, testimonials, CTA)
  about · services · services/[slug] · solutions · partners · industries
  projects · projects/[slug] · training · contact · privacy · newsletter/unsubscribe
src/app/admin/login         Sign-in
src/app/admin/(dashboard)/  Overview, Enquiries, Homepage & settings, Media,
                            Newsletter, Administrators, My account, and
  [resource]/…              generic CRUD for Services, Categories, Solutions,
                            Partners, Industries, Projects, Training,
                            Testimonials, FAQs, Pages & SEO
src/app/api/admin/upload    Cloudinary upload → Media library row
src/app/api/admin/export    CSV export (enquiries / newsletter)
src/app/api/health          DB health check
src/app/sitemap.ts · robots.ts
src/actions/                Server actions (public forms, admin)
src/lib/admin/resources.ts  Field definitions for every admin content type
src/lib/auth/               JWT session, RBAC permissions, guards
src/lib/seo.ts              Metadata, canonical URLs, JSON-LD
```

To add a field to a content type: add it to `schema.prisma`, run `npx prisma migrate dev`, add it to that resource's `fields` in `src/lib/admin/resources.ts`, then render it on the public page.

---

## 3. Features

**Public site:** sticky header with services mega-menu, animated network hero, reveal-on-scroll motion (respects reduced motion), service pages (capabilities, platforms, applications, benefits, related services, enquiry form), partners grouped by category, project portfolio with service filter (verified projects only), training catalogue, contact page with click-to-call, `mailto:` and WhatsApp links, a floating WhatsApp button, newsletter sign-up and unsubscribe, downloadable corporate profile, a 404 page, error boundaries and loading states.

**Forms** (contact, consultation, service, training, newsletter) use React Hook Form with Zod on the client, and **re-validate with Zod on the server**. They're stored in PostgreSQL, protected by a honeypot and per-IP rate limits, and send a Resend notification to `ENQUIRY_NOTIFY_EMAIL` plus an acknowledgement to the sender.

**Admin**
- Roles: **Super Admin** (everything), **Editor** (content, media, enquiries) and **Viewer** (read-only enquiries).
- Security: bcrypt (12 rounds) password hashing, signed httpOnly session cookies (8 h), middleware on every admin route, permissions re-checked in every page and action, deactivated admins lose access immediately, and login rate limiting.
- Enquiries: status (new / in progress / closed / spam), assignee, internal notes, reply by email, call or WhatsApp, search, filters and CSV export.
- Content: create, edit, delete and one-click publish for every content type, with slugs, ordering, relations (service ↔ partners, related services, solution ↔ services, project ↔ services) and project galleries.
- Media: Cloudinary uploads, alt text, copy URL and delete.
- Settings: homepage hero, intro, why-choose-us, delivery steps, CTA, contact details, socials and default SEO.
- Pages & SEO: per-page heading, intro, body, meta title and description, social image and noindex.

---

## 4. Preserving SEO on the existing domain

1. **Export the old URL list** before switching DNS: Google Search Console → Indexing → Pages (export), or the old `/sitemap.xml`, or a crawl with Screaming Frog.
2. For every old URL that doesn't exist in the new structure, add a `{ from, to }` entry in `redirects.config.ts` (they're served as **308/301 permanent** redirects). New URLs: `/about`, `/services`, `/services/<slug>`, `/solutions`, `/partners`, `/industries`, `/projects`, `/projects/<slug>`, `/training`, `/contact`.
3. Copy any old page titles and descriptions worth keeping into **Admin → Pages & SEO** / each service's SEO fields.
4. Already built in: canonical URLs on `https://faventmagna.com` (www → apex redirect), dynamic `/sitemap.xml`, `/robots.txt` (admin/API disallowed), Organization, Service, Breadcrumb and FAQ JSON-LD, Open Graph and Twitter tags, Cloudinary `f_auto,q_auto` images via `next/image` (AVIF/WebP), and font optimisation.
5. After launch: submit `https://faventmagna.com/sitemap.xml` in Search Console and watch Pages → "Not found (404)" for any missed redirects.

---

## 5. Deploying to faventmagna.com (Render)

The included `render.yaml` provisions PostgreSQL and the web service.

1. Push this repo to GitHub, then go to Render → **New → Blueprint** and select the repo.
2. Set the secret env vars (Cloudinary, Resend, `ENQUIRY_NOTIFY_EMAIL`). `AUTH_SECRET` is generated for you.
3. After the first deploy, open the Render shell and run `npm run db:seed` once. Set `SEED_ADMIN_*` first.
4. **Custom domain:** Render service → Settings → Custom Domains → add `faventmagna.com` and `www.faventmagna.com`. At your DNS provider, point the apex (A/ALIAS) and `www` (CNAME) as Render instructs. TLS is automatic.
5. **Email:** verify `faventmagna.com` in Resend (SPF/DKIM DNS records) so `no-reply@faventmagna.com` can send. Don't touch the existing MX records, so company mailboxes keep working.
6. Switch DNS only after content and redirects are in place. Keep the old host available until the new site is verified.

Any Node host with PostgreSQL works the same way (Vercel + Neon, Railway, a VPS with `npm run build && npm start`). The in-memory rate limiter assumes a single instance; use Redis/Upstash if you scale out.

---

## 6. Launch test checklist

- [ ] `npm run build` passes, with no type or lint errors
- [ ] Home and every page render at 375 px, 768 px and 1440 px
- [ ] Contact, consultation, service, training and newsletter forms: errors show, the row appears in Admin, notification and acknowledgement emails arrive
- [ ] Honeypot and rate limit: a 6th rapid submission is refused
- [ ] Admin: sign-in, wrong password, Editor can't open Administrators/Settings, Viewer can't edit
- [ ] Upload an image and the PDF profile; the footer download works
- [ ] Publishing an unverified project is blocked
- [ ] `/sitemap.xml`, `/robots.txt`, canonical tags and JSON-LD validate (Rich Results Test)
- [ ] Old URLs 301 to new pages
- [ ] Lighthouse: Performance / Accessibility / SEO ≥ 90 on mobile
- [ ] Keyboard-only navigation of the menu, forms and FAQ accordions
