import { describe, expect, test } from "bun:test";

import { loadConfig } from "../src/config/index.ts";

const validEnv = {
  DATABASE_URL: "file:./test.db",
  JWT_ACCESS_SECRET: "a".repeat(32),
  JWT_REFRESH_SECRET: "b".repeat(32),
  TMDB_API_KEY: "key",
};

describe("loadConfig", () => {
  test("applies defaults and coerces PORT", () => {
    const config = loadConfig({ ...validEnv, PORT: "4000" });
    expect(config.PORT).toBe(4000);
    expect(config.NODE_ENV).toBe("development");
    expect(config.JWT_ACCESS_TTL).toBe("15m");
    expect(config.CORS_ORIGIN).toEqual(["http://localhost:5173"]);
  });

  test("parses CORS_ORIGIN as a comma-separated list", () => {
    const config = loadConfig({
      ...validEnv,
      CORS_ORIGIN: "http://localhost:5173, https://seenflix.example ,",
    });
    expect(config.CORS_ORIGIN).toEqual(["http://localhost:5173", "https://seenflix.example"]);
  });

  test("throws listing missing variables", () => {
    expect(() => loadConfig({})).toThrow(/JWT_ACCESS_SECRET/);
  });
});
