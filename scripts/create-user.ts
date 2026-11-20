import { PrismaClient, Role } from "@prisma/client";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  ACCOUNT_EMAIL: z.string().email(),
  ACCOUNT_PASSWORD: z.string().min(12).refine(value => Buffer.byteLength(value) <= 72),
  ACCOUNT_ROLE: z.nativeEnum(Role).default("USER"),
});

async function main() {
  const values = schema.safeParse(process.env);
  if (!values.success) throw new Error("Set ACCOUNT_EMAIL, ACCOUNT_PASSWORD (12+ characters; at most 72 UTF-8 bytes), and optionally ACCOUNT_ROLE=ADMIN.");
  const prisma = new PrismaClient();
  try {
    await prisma.user.create({ data: { email: values.data.ACCOUNT_EMAIL, password: await hash(values.data.ACCOUNT_PASSWORD, 12), role: values.data.ACCOUNT_ROLE } });
    console.log("Account created. Existing accounts are never overwritten.");
  } finally { await prisma.$disconnect(); }
}

main().catch(() => { console.error("Account creation failed. Check configuration, database connectivity, and whether the account already exists."); process.exitCode = 1; });
