import { PrismaLibSql } from "@prisma/adapter-libsql";

import { PrismaClient } from "../../generated/prisma/client";
import { config } from "../config";

const adapter = new PrismaLibSql({ url: config.DATABASE_URL });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (config.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
