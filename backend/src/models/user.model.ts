import type { User } from "../../generated/prisma/client.ts";
import { prisma } from "../prisma/client.ts";

export type { User };

export type PublicUser = Omit<User, "password">;
export type UserPayload = Omit<PublicUser, "updatedAt" | "createdAt">;

export function toPublicUser({ password: _password, ...user }: User): PublicUser {
  return user;
}

export function toUserPayload({
  updatedAt: _updatedAt,
  createdAt: _createdAt,
  ...user
}: PublicUser): UserPayload {
  return user;
}

export function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(data: { email: string; password: string }): Promise<User> {
  return prisma.user.create({ data });
}
