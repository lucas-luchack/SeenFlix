import type { Contract } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { Contract };

export function findContractByTmdbId(tmdbId: number): Promise<Contract | null> {
  return prisma.contract.findUnique({ where: { tmdbId } });
}

export function getOrCreateContract(tmdbId: number): Promise<Contract> {
  return prisma.contract.upsert({
    where: { tmdbId },
    update: {},
    create: { tmdbId },
  });
}
