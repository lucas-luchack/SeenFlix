import { createHash, randomBytes } from "node:crypto";

import jwt from "jsonwebtoken";
import ms, { type StringValue } from "ms";

import { config } from "../config/index.ts";
import { ConflictError, UnauthorizedError } from "../errors/index.ts";
import {
  createRefreshToken,
  createUser,
  deleteRefreshTokenByHash,
  deleteUserRefreshTokens,
  findRefreshTokenByHash,
  findUserByEmail,
  findUserById,
  revokeRefreshToken,
  toPublicUser,
  toUserPayload,
  type PublicUser,
  type User,
} from "../models/index.ts";
import type {
  LoginInput,
  RefreshTokenInput,
  SignupInput,
  TokenInput,
} from "../schemas/auth.schema.ts";

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

const REFRESH_TOKEN_TTL_MS = ms(config.REFRESH_TOKEN_TTL as StringValue);

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function invalidToken(): UnauthorizedError {
  return new UnauthorizedError("Invalid or expired token", "INVALID_TOKEN");
}

async function issueTokens(user: User): Promise<AuthTokens> {
  const token = jwt.sign(toUserPayload(toPublicUser(user)), config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_TTL as StringValue,
  });

  const refreshToken = randomBytes(32).toString("base64url");
  await createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return { token, refreshToken };
}

function verifyAccessToken(token: string): string {
  try {
    const payload = jwt.verify(token, config.JWT_ACCESS_SECRET);
    if (typeof payload === "object" && typeof payload.id === "string") return payload.id;
  } catch {}
  throw invalidToken();
}

export async function register({ email, password }: SignupInput): Promise<PublicUser> {
  if (await findUserByEmail(email))
    throw new ConflictError("Email already exists", "ACCOUNT_ALREADY_EXISTS");

  const hashedPassword = await Bun.password.hash(password);
  const user = await createUser({ email, password: hashedPassword });

  return toPublicUser(user);
}

export async function login({ email, password }: LoginInput): Promise<AuthTokens> {
  const user = await findUserByEmail(email);
  if (!user) throw new UnauthorizedError("Invalid credentials", "INVALID_CREDENTIALS");

  const verified = await Bun.password.verify(password, user.password);
  if (!verified) throw new UnauthorizedError("Invalid credentials", "INVALID_CREDENTIALS");

  return issueTokens(user);
}

export async function refreshToken({ refreshToken }: RefreshTokenInput): Promise<AuthTokens> {
  const stored = await findRefreshTokenByHash(hashToken(refreshToken));
  if (!stored) throw invalidToken();

  if (stored.revokedAt || !(await revokeRefreshToken(stored.id))) {
    await deleteUserRefreshTokens(stored.userId);
    throw invalidToken();
  }

  if (stored.expiresAt <= new Date()) throw invalidToken();

  const user = await findUserById(stored.userId);
  if (!user) throw invalidToken();

  return issueTokens(user);
}

export async function logout({ refreshToken }: RefreshTokenInput): Promise<void> {
  await deleteRefreshTokenByHash(hashToken(refreshToken));
}

export async function getAuthenticatedUser({ token }: TokenInput): Promise<PublicUser> {
  const user = await findUserById(verifyAccessToken(token));
  if (!user) throw invalidToken();

  return toPublicUser(user);
}
