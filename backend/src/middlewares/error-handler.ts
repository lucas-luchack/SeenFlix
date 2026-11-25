import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { logger } from "./logger.ts";
import { AppError } from "./app-error.ts";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      code: "NOT_FOUND",
    },
  });
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    res.status(error.status).json({
      error: { message: error.message, code: error.code },
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        message: "Invalid request input",
        code: "VALIDATION_ERROR",
      },
    });
    return;
  }

  logger.error({ err: error }, "Unhandled application error");
  res.status(500).json({
    error: { message: "Internal server error", code: "INTERNAL_ERROR" },
  });
}
