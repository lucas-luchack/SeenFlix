import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

import { AppError, NotFoundError } from "../errors/index.ts";

interface ErrorBody {
  error: { message: string; code: string };
}

function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof ZodError) {
    const message = err.issues
      .map((issue) => (issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message))
      .join("; ");
    return new AppError(400, "VALIDATION_ERROR", message || "Validation failed");
  }

  // Malformed JSON body rejected by express.json()
  if (err instanceof SyntaxError && "type" in err && err.type === "entity.parse.failed") {
    return new AppError(400, "INVALID_JSON", "Request body is not valid JSON");
  }

  // Prisma unique constraint violation
  if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
    return new AppError(409, "CONFLICT", "Resource already exists");
  }

  return new AppError(500, "INTERNAL_ERROR", "Internal server error");
}

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`, "ROUTE_NOT_FOUND"));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err);

  const appError = toAppError(err);

  if (appError.status >= 500) {
    console.error(err);
  }

  const body: ErrorBody = { error: { message: appError.message, code: appError.code } };
  res.status(appError.status).json(body);
};
