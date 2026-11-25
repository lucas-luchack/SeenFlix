import type { Contract, Rating } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { Rating };
export type RatingWithContract = Rating & { contract: Contract };

export function listRatings(userId: string): Promise<RatingWithContract[]> {
  return prisma.rating.findMany({
    where: { userId },
    include: { contract: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function findRating(userId: string, contractId: string): Promise<Rating | null> {
  return prisma.rating.findFirst({ where: { userId, contractId } });
}

export async function setRating(
  userId: string,
  contractId: string,
  rating: number,
): Promise<Rating> {
  const existing = await findRating(userId, contractId);
  if (existing) {
    return prisma.rating.update({ where: { id: existing.id }, data: { rating } });
  }
  return prisma.rating.create({ data: { userId, contractId, rating } });
}

export async function removeRating(userId: string, contractId: string): Promise<boolean> {
  const { count } = await prisma.rating.deleteMany({ where: { userId, contractId } });
  return count > 0;
}
