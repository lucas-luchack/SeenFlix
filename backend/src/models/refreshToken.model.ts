import type { RefreshToken } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { RefreshToken };

export function createRefreshToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<RefreshToken> {
  return prisma.refreshToken.create({ data });
}

export function findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
  return prisma.refreshToken.findUnique({ where: { tokenHash } });
}

export async function revokeRefreshToken(id: string): Promise<boolean> {
  const { count } = await prisma.refreshToken.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return count === 1;
}

export async function deleteRefreshTokenByHash(tokenHash: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { tokenHash } });
}

export async function deleteUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
