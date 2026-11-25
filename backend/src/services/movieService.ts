import { BadGatewayError, InternalServerError } from "../errors/index.ts";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 100;

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

function normalizeQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

function getCache(key: string): unknown | undefined {
  const entry = cache.get(key);

  if (!entry) return undefined;

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }

  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

function setCache(key: string, value: unknown): void {
  cache.delete(key);
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });

  while (cache.size > CACHE_MAX_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
}

async function tmdbRequest(
  path: string,
  params: Record<string, string> = {},
): Promise<unknown> {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new InternalServerError("TMDB_API_KEY is not configured", "TMDB_CONFIG_ERROR");
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("language", process.env.TMDB_LANGUAGE ?? "fr-FR");

  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }

  let response: globalThis.Response;
  try {
    response = await fetch(url);
  } catch {
    throw new BadGatewayError("Unable to reach TMDB", "TMDB_UPSTREAM_ERROR");
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new InternalServerError("TMDB rejected the configured API key", "TMDB_AUTH_ERROR");
    }

    throw new BadGatewayError(`TMDB returned status ${response.status}`, "TMDB_UPSTREAM_ERROR");
  }

  try {
    return await response.json();
  } catch {
    throw new BadGatewayError("TMDB returned an invalid response", "TMDB_INVALID_RESPONSE");
  }
}

export async function searchMovies(query: string): Promise<unknown> {
  const key = `search:${normalizeQuery(query)}`;
  const cached = getCache(key);

  if (cached !== undefined) {
    console.log(JSON.stringify({ event: "TMDB_CACHE", result: "HIT", key }));
    return cached;
  }

  console.log(JSON.stringify({ event: "TMDB_CACHE", result: "MISS", key }));
  const result = await tmdbRequest("/search/multi", {
    query: query.trim(),
    include_adult: "false",
  });

  setCache(key, result);
  return result;
}

export async function getMovieDetails(
  type: "movie" | "tv",
  id: number,
): Promise<unknown> {
  const key = `detail:${type}:${id}`;
  const cached = getCache(key);

  if (cached !== undefined) {
    console.log(JSON.stringify({ event: "TMDB_CACHE", result: "HIT", key }));
    return cached;
  }

  console.log(JSON.stringify({ event: "TMDB_CACHE", result: "MISS", key }));
  const result = await tmdbRequest(`/${type}/${id}`);

  setCache(key, result);
  return result;
}