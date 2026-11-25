import cors from "cors";
import express, { type Express } from "express";
import morgan from "morgan";

import { logger } from "./middlewares/logger.ts";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.ts";
import { router } from "./routes/index.ts";

export interface AppOptions {
  corsOrigins: string[];
}

// App is built without listening so tests can mount it on a random port.
export function createApp({ corsOrigins }: AppOptions): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: corsOrigins }));
  app.use(express.json());
  app.use(
    morgan("combined", {
      stream: {
        write(message: string) {
          logger.info({ http: message.trim() }, "HTTP request");
        },
      },
    }),
  );

  app.use(router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
