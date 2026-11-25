import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

import { createApp } from "../src/app.ts";

const allowedOrigin = "http://localhost:5173";

let server: Server;
let baseUrl: string;

beforeAll(() => {
  server = createApp({ corsOrigins: [allowedOrigin] }).listen(0);
  const { port } = server.address() as AddressInfo;
  baseUrl = `http://localhost:${port}`;
});

afterAll(() => {
  server.close();
});

describe("app", () => {
  test("GET /health returns ok", async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
  });
});

describe("cors", () => {
  test("allows the configured frontend origin", async () => {
    const res = await fetch(`${baseUrl}/health`, { headers: { Origin: allowedOrigin } });
    expect(res.headers.get("access-control-allow-origin")).toBe(allowedOrigin);
  });

  test("answers preflight requests for the configured origin", async () => {
    const res = await fetch(`${baseUrl}/health`, {
      method: "OPTIONS",
      headers: {
        Origin: allowedOrigin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Authorization, Content-Type",
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe(allowedOrigin);
    expect(res.headers.get("access-control-allow-headers")).toContain("Authorization");
  });

  test("does not allow other origins", async () => {
    const res = await fetch(`${baseUrl}/health`, { headers: { Origin: "http://evil.example" } });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});
