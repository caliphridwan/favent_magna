/**
 * Seed: creates any missing content from prisma/content.mjs and the first
 * super admin. Never overwrites rows that already exist, so it is safe to run
 * repeatedly and won't undo edits made in the admin dashboard.
 *
 * To push updated content from content.mjs over an existing database, use
 * `npm run content:import` instead.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { applyContent } from "./content.mjs";

const prisma = new PrismaClient();

async function main() {
  await applyContent(prisma, { overwrite: false });

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
    const existing = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
    if (!existing) {
      await prisma.admin.create({
        data: {
          email: email.toLowerCase(),
          name: process.env.SEED_ADMIN_NAME || "Site Administrator",
          passwordHash: await bcrypt.hash(password, 12),
          role: "SUPER_ADMIN",
        },
      });
      console.log(`Created super admin ${email}`);
    }
  } else {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — no admin created. Run `npm run admin:create` later.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
