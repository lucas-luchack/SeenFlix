import { Router } from "express";

import { healthRouter } from "./health.ts";

export const router: Router = Router();

router.use("/health", healthRouter);
