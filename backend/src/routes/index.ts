import { Router } from "express";

import { authRouter } from "./auth.ts";
import { healthRouter } from "./health.ts";
import { moviesRouter } from "./movies.ts";

export const router: Router = Router();

router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/movies", moviesRouter);
