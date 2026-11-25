import type { Contract, Watched } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { Watched };
export type WatchedWithContract = Watched & { contract: Contract };

export function listWatched(userId: string): Promise<WatchedWithContract[]> {
  return prisma.watched.findMany({
    where: { userId },
    include: { contract: true },
    orderBy: { createdAt: "desc" },
  });
}

export function findWatched(userId: string, contractId: string): Promise<Watched | null> {
  return prisma.watched.findFirst({ where: { userId, contractId } });
}

export async function addWatched(userId: string, contractId: string): Promise<Watched> {
  return (
    (await findWatched(userId, contractId)) ??
    prisma.watched.create({ data: { userId, contractId } })
  );
}

export async function removeWatched(userId: string, contractId: string): Promise<boolean> {
  const { count } = await prisma.watched.deleteMany({ where: { userId, contractId } });
  return count > 0;
}
