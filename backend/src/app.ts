import cors from "cors";
import express, { type Express } from "express";

import { router } from "./routes/index.ts";

export interface AppOptions {
  corsOrigins: string[];
}

export function createApp({ corsOrigins }: AppOptions): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());

  app.use(router);

  return app;
}
