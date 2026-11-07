/**
 * Create or reset a super administrator from the command line.
 *   npm run admin:create -- admin@faventmagna.com "Strong-Password-123" "Full Name"
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [email, password, name = "Site Administrator"] = process.argv.slice(2);
  if (!email || !password) throw new Error('Usage: npm run admin:create -- <email> <password> ["Full Name"]');
  if (password.length < 12) throw new Error("Password must be at least 12 characters.");
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, active: true, role: "SUPER_ADMIN" },
    create: { email: email.toLowerCase(), name, passwordHash, role: "SUPER_ADMIN" },
  });
  console.log(`Super admin ready: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
