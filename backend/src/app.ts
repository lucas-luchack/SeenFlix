import cors from "cors";
import express, { type Express } from "express";

import { caseConverter } from "./middlewares/caseConverter.middleware.ts";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.ts";
import { router } from "./routes/index.ts";

export interface AppOptions {
  corsOrigins: string[];
}

export function createApp({ corsOrigins }: AppOptions): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());
  app.use(caseConverter);

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
