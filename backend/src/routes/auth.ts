import { Router } from "express";

import { loginSchema, refreshTokenSchema, signupSchema } from "../schemas/auth.schema.ts";
import { login, logout, refreshToken, register } from "../services/auth.service.ts";

export const authRouter: Router = Router();

authRouter.post("/register", async (req, res) => {
  const user = await register(signupSchema.parse(req.body));
  res.status(201).json(user);
});

authRouter.post("/login", async (req, res) => {
  const result = await login(loginSchema.parse(req.body));
  res.status(200).json(result);
});

authRouter.post("/refresh", async (req, res) => {
  const result = await refreshToken(refreshTokenSchema.parse(req.body));
  res.status(200).json(result);
});

authRouter.post("/logout", async (req, res) => {
  await logout(refreshTokenSchema.parse(req.body));
  res.status(204).end();
});
