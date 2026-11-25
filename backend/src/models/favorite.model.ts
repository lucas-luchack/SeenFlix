import type { Contract, Favorite } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { Favorite };
export type FavoriteWithContract = Favorite & { contract: Contract };

export function listFavorite(userId: string): Promise<FavoriteWithContract[]> {
  return prisma.favorite.findMany({
    where: { userId },
    include: { contract: true },
    orderBy: { createdAt: "desc" },
  });
}

export function findFavorite(userId: string, contractId: string): Promise<Favorite | null> {
  return prisma.favorite.findFirst({ where: { userId, contractId } });
}

export async function addFavorite(userId: string, contractId: string): Promise<Favorite> {
  return (
    (await findFavorite(userId, contractId)) ??
    prisma.favorite.create({ data: { userId, contractId } })
  );
}

export async function removeFavorite(userId: string, contractId: string): Promise<boolean> {
  const { count } = await prisma.favorite.deleteMany({ where: { userId, contractId } });
  return count > 0;
}
