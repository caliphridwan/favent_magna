/**
 * Overwrites site settings, pages, services, partners and solutions in the
 * database with the content in prisma/content.mjs (imported from the existing
 * faventmagna.com). Use once on a database that was seeded with the earlier
 * placeholder content.
 *
 *   npm run content:import
 *
 * Not touched: logos/images, WhatsApp number, admins, enquiries, projects,
 * FAQs, newsletter, and the published state of industries.
 * WARNING: edits made in the admin to the overwritten fields will be replaced.
 */
import { PrismaClient } from "@prisma/client";
import { applyContent } from "../prisma/content.mjs";

const prisma = new PrismaClient();

applyContent(prisma, { overwrite: true })
  .then(() => console.log("Content imported."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
