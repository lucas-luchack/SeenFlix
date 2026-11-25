# SeenFlix – TODO

**Deadline: 04/12/2026** (final session – demo + presentation)

Team (split by layer): **Lucas** = backend core / DB / auth / favorites · **Asad** = backend TMDB / errors / validation / docs / tests / CI · **Thibault** = frontend

Legend: **Lvl** = priority level from the spec (1 = must, 2 = quality, 3 = bonus) · Status: ☐ todo / ◐ doing / ☑ done

## 0. Setup & organisation

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 0.2 | Git convention: Conventional Commits in English → `CONTRIBUTING.md` | –      | 1   | Lucas | ☑      |
| 0.3 | Stack: Prisma + SQLite, Zod, bun test, pino → `CONTRIBUTING.md` | –          | 1   | All | ☑      |
| 0.4 | Get TMDB API key                                                | –          | 1   | Asad | ☑      |
| 0.5 | Architecture schema (front / back / DB / TMDB)                  | 0.3        | 1   | Thibault | ☐      |
| 0.6 | API contract draft → `docs/API.md` (to refine)                  | 0.3        | 1   | All | ◐      |

## 1. Backend – Foundations

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 1.1 | `src/` structure (routes, services, middlewares, models, config) | 0.3       | 1   | Lucas | ☑      |
| 1.2 | Config loader + `.env` / `.env.example` (JWT secrets, DB URL, TMDB key, port) | 1.1 | 1 | Lucas | ☑ |
| 1.3 | Express app + server bootstrap (app separated from listen, for tests) | 1.1  | 1   | Lucas | ☑      |
| 1.4 | `morgan` HTTP logs + app logger (pino/winston)                  | 1.3        | 2   | Asad | ☑      |
| 1.5 | Central error middleware + `AppError` → `{ error: { message, code } }` (400/401/404/409/500) | 1.3 | 2 | Asad | ☑ |
| 1.6 | Zod validation middleware (body / params / query)               | 1.5        | 2   | Asad | ☑      |
| 1.7 | CORS for frontend                                               | 1.3        | 1   | Lucas | ☑      |

## 2. Backend – Database

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 2.1 | DB connection / client                                          | 1.2        | 1   | Lucas | ☐      |
| 2.2 | `User` model (id, email unique, passwordHash, createdAt)        | 2.1        | 1   | Lucas | ☐      |
| 2.3 | `Favorite` model (id, userId FK, tmdbId, type, rating?, comment?, createdAt, unique userId+tmdbId+type) | 2.2 | 1 | Lucas | ☐ |
| 2.4 | `RefreshToken` table (hash, userId, expiresAt, revoked)            | 2.2        | 3   | Lucas | ☐      |
| 2.5 | Seed script (demo `alice@example.org / Passw0rd!` + favorites)  | 2.3        | 1   | Lucas | ☐      |
| 2.6 | `db:reset` script                                               | 2.3        | 1   | Lucas | ☐      |
| 2.7 | Dedicated SQLite test DB file                                   | 2.3        | 2   | Asad | ☐      |

## 3. Backend – Authentication

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 3.1 | Auth service: register (bcrypt hash, duplicate → 409)           | 2.2        | 1   | Lucas | ☐      |
| 3.2 | Auth service: login (check password → access token)             | 3.1        | 1   | Lucas | ☐      |
| 3.3 | `POST /auth/register` + validation (201/400/409)                | 3.1, 1.6   | 1   | Lucas | ☐      |
| 3.4 | `POST /auth/login` + validation (200/400/401)                   | 3.2, 1.6   | 1   | Lucas | ☐      |
| 3.5 | Auth middleware (Bearer access token → `req.user`, 401)         | 3.2, 1.5   | 1   | Lucas | ☐      |
| 3.6 | Refresh token generation (long TTL) returned at login           | 3.2, 2.4   | 3   | Lucas | ☐      |
| 3.7 | `POST /auth/refresh` `{ refreshToken }` in body, rotation (200/401) | 3.6        | 3   | Lucas | ☐      |
| 3.8 | (Optional) `POST /auth/logout` – revoke refresh token           | 3.7        | 3   | Lucas | ☐      |
| 3.9 | (Optional) `GET /me` – current user info                        | 3.5        | 3   | Lucas | ☐      |

## 4. Backend – Favorites (protected)

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 4.1 | Favorites service: list / add (dup → 409) / remove (owner only, 404) | 2.3   | 1   | Lucas | ☐      |
| 4.2 | `GET /me/favorites`                                             | 4.1, 3.5   | 1   | Lucas | ☐      |
| 4.3 | `POST /me/favorites` + validation (`tmdbId`, `type`)            | 4.1, 3.5, 1.6 | 1 | Lucas | ☐      |
| 4.4 | `DELETE /me/favorites/:id` (204/404)                            | 4.1, 3.5   | 1   | Lucas | ☐      |
| 4.5 | `PATCH /me/favorites/:id` – rating (1–5) + comment              | 4.4        | 3   | Asad | ☐      |
| 4.6 | Filters / sort on `GET` (type, rating, createdAt)               | 4.2        | 3   | Asad | ☐      |

## 5. Backend – TMDB proxy & cache

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 5.1 | TMDB client (fetch, API key, error mapping → 500/502)           | 0.4, 1.2   | 1   | Asad | ☐      |
| 5.2 | `GET /movies/search?q=` (multi search movie+tv, validate `q`)   | 5.1, 1.6   | 1   | Asad | ☐      |
| 5.3 | `GET /movies/:type/:id` – detail page                           | 5.1        | 1   | Asad | ☐      |
| 5.4 | LRU cache with TTL ≈ 10 min (key = normalized `q`)              | 5.2        | 2   | Asad | ☐      |
| 5.5 | Log HIT / MISS                                                  | 5.4, 1.4   | 2   | Asad | ☐      |
| 5.6 | Save sample HIT/MISS logs as proof                              | 5.5        | 2   | Asad | ☐      |

## 6. Backend – Docs

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 6.1 | `openapi.yaml` (all routes, schemas, errors, bearer auth)       | 3.4, 4.4, 5.2 | 2 | Asad | ☐      |
| 6.2 | `/docs` route (Swagger UI)                                      | 6.1        | 2   | Asad | ☐      |

## 7. Backend – Tests

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 7.1 | `bun test` setup + coverage report (`--coverage`)               | 1.1, 2.7   | 2   | Asad | ☐      |
| 7.2 | Unit tests: auth service                                        | 3.2, 7.1   | 2   | Asad | ☐      |
| 7.3 | Unit tests: favorites service                                   | 4.1, 7.1   | 2   | Asad | ☐      |
| 7.4 | Unit tests: TMDB client + cache (mock fetch, HIT/MISS, TTL)     | 5.4, 7.1   | 2   | Asad | ☐      |
| 7.5 | Unit tests: middlewares (auth, validation, errors)              | 1.6, 3.5, 7.1 | 2 | Asad | ☐      |
| 7.6 | Integration tests (supertest): register → login → favorites     | 4.4, 7.1   | 3   | Asad | ☐      |
| 7.7 | Reach ≥ 50 % coverage                                           | 7.2–7.5    | 2   | Asad | ☐      |

## 8. Frontend – Foundations

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 8.1 | Clean scaffold (remove counter store), layout + navbar          | –          | 1   | Thibault | ☑      |
| 8.2 | HTTP client (axios/fetch), base URL from env                    | 0.6        | 1   | Thibault | ☐      |
| 8.3 | Auth store (Pinia): tokens, user, login/register/logout, persisted in localStorage | 8.2 | 1 | Thibault | ☐ |
| 8.4 | Interceptor: attach Bearer token, auto-refresh on 401           | 8.3, 3.7   | 3   | Thibault | ☐      |
| 8.5 | Routes + guard (redirect to login on protected pages)           | 8.3        | 1   | Thibault | ☐      |
| 8.6 | Global error display (toast / message)                          | 8.2        | 2   | Thibault | ☐      |
| 8.7 | Favorites store (Pinia)                                         | 8.3, 4.4   | 1   | Thibault | ☐      |

## 9. Frontend – Screens

| ID  | Task                                                            | Depends on | Lvl | Who | Status |
|-----|-----------------------------------------------------------------|------------|-----|-----|--------|
| 9.1 | Home page (pitch + links login / register / search)             | 8.1        | 1   | Thibault | ☐      |
| 9.2 | Register page (form + validation / API errors)                  | 8.3, 3.3   | 1   | Thibault | ☐      |
| 9.3 | Login page (form + errors)                                      | 8.3, 3.4   | 1   | Thibault | ☐      |
| 9.4 | Search page (input, results, "Add to favorites" if logged in)   | 8.2, 8.7, 5.2 | 1 | Thibault | ☐      |
| 9.5 | Detail page (movie / tv)                                        | 8.2, 5.3   | 1   | Thibault | ☐      |
| 9.6 | My favorites page (list + delete)                               | 8.7, 8.5   | 1   | Thibault | ☐      |
| 9.7 | Rating / comment UI on favorites                                | 9.6, 4.5   | 3   | Thibault | ☐      |
| 9.8 | Filters / sort on favorites                                     | 9.6, 4.6   | 3   | Thibault | ☐      |
| 9.9 | Profile page (activity summary)                                 | 9.6, 3.9   | 3   | Thibault | ☐      |
| 9.10| UI polish (responsive, loading states, empty states)            | 9.1–9.6    | 3   | Thibault | ☐      |

## 10. Frontend – Tests

| ID   | Task                                                           | Depends on | Lvl | Who | Status |
|------|----------------------------------------------------------------|------------|-----|-----|--------|
| 10.1 | Unit tests stores (auth, favorites)                            | 8.3, 8.7   | 3   | Thibault | ☐      |
| 10.2 | E2E (Playwright): register → login → search → add/remove fav   | 9.2–9.6    | 3   | Thibault | ☐      |

## 11. Quality, CI & deliverables

| ID   | Task                                                           | Depends on | Lvl | Who | Status |
|------|----------------------------------------------------------------|------------|-----|-----|--------|
| 11.1 | Lint + format scripts (back & front)                           | 1.1        | 2   | Asad | ☐      |
| 11.2 | GitHub Actions: lint + tests + coverage (back & front)         | 11.1, 7.1  | 3   | Asad | ☐      |
| 11.3 | Root `README.md` (prereqs, install ≤ 5 min, archi, demo account, scripts) | 2.5, 6.2 | 1 | Lucas | ☐ |
| 11.4 | Root script to run back + front together                       | 1.3, 8.1   | 2   | Thibault | ☐      |
| 11.5 | Collect proofs: coverage report, HIT/MISS logs                 | 5.6, 7.7   | 2   | Asad | ☐      |

## 12. Final presentation

| ID   | Task                                                           | Depends on | Lvl | Who | Status |
|------|----------------------------------------------------------------|------------|-----|-----|--------|
| 12.1 | Slides: architecture, code organisation, auth & persistence, tests & errors | 0.5, 11.5 | 1 | All | ☐ |
| 12.2 | Demo script (user journey) + fallback (seeded DB)              | 9.6, 2.5   | 1   | Thibault | ☐      |
| 12.3 | Rehearsal (everyone can explain every part)                    | 12.1, 12.2 | 1   | All | ☐      |
