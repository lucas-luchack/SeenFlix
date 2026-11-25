import type { RefreshToken } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { RefreshToken };

export function createRefreshToken(userId: string, token: string): Promise<RefreshToken> {
  return prisma.refreshToken.create({ data: { userId, token } });
}

export function findRefreshToken(token: string): Promise<RefreshToken | null> {
  return prisma.refreshToken.findFirst({ where: { token } });
}

export async function deleteRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } });
}

export async function deleteUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { userId } });
}
