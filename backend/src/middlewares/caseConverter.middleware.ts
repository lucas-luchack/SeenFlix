import type { RequestHandler } from "express";

type KeyTransform = (key: string) => string;

export const snakeToCamel: KeyTransform = (key) =>
  key.replace(/_+([a-z0-9])/g, (_, char: string) => char.toUpperCase());

export const camelToSnake: KeyTransform = (key) =>
  key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export function convertKeys(value: unknown, transform: KeyTransform): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => convertKeys(item, transform));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [transform(key), convertKeys(val, transform)]),
    );
  }

  return value;
}

/**
 * Converts incoming body and query keys from snake_case to camelCase,
 * and outgoing JSON response keys from camelCase to snake_case.
 */
export const caseConverter: RequestHandler = (req, res, next) => {
  if (req.body !== undefined) {
    req.body = convertKeys(req.body, snakeToCamel);
  }

  // req.query is a getter in Express 5, so it must be redefined rather than assigned
  Object.defineProperty(req, "query", {
    value: convertKeys(req.query, snakeToCamel),
    writable: true,
    configurable: true,
    enumerable: true,
  });

  const json = res.json.bind(res);
  res.json = (body?: unknown) => json(convertKeys(body, camelToSnake));

  next();
};
