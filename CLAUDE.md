# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — start the dev server (Next.js 16, App Router)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript rules)

There is no test runner configured yet — do not assume Jest/Vitest exist until they're added to `package.json`.

## Current state

App Router, TypeScript, Tailwind CSS v4 via `@tailwindcss/postcss`. Path alias `@/*` maps to `./src/*` (see `tsconfig.json`). Foundations are done: shadcn/ui is initialized (`components.json`, style `base-nova`, built on `@base-ui/react`) with the Figma color palette wired into shadcn's semantic CSS variables in `src/app/globals.css` (dark theme only, no light mode), Poppins wired via `next/font` in `src/app/layout.tsx`, the core shadcn primitives are installed under `src/components/ui/`, and cross-feature wrapper components (`TextField` with default/password/phone variants, `CountrySelect`) live under `src/components/shared/`. No feature screens, Redux store, or RTK Query setup exist yet — `src/app/page.tsx` is still the unmodified `create-next-app` placeholder. Treat the architectural guidance below as the standard to build *toward* as features land, not a description of code that fully exists yet.

## Mandated architecture

The project follows a strict MVVM layering, deliberately as rigorous as a NestJS backend's module/service/controller separation — not a loose app-router free-for-all:

- **Model** — types/zod schemas/entities (zod schemas double as validation + model layer), plus the API/data-access layer.
- **ViewModel** — hooks/services owning state, business logic, and orchestration: Redux Toolkit slices, RTK Query endpoints, custom hooks. No JSX here.
- **View** — "dumb" components built from shadcn/ui primitives that only render UI, receiving data/handlers via props or hooks.

Apply SOLID principles per component/hook/service (single responsibility, dependency inversion via hooks/interfaces rather than tight coupling). When scaffolding a new feature, create separate model / viewmodel / view pieces rather than mixing data-fetching or business logic directly into JSX.

## Mandated tech stack

- **State**: Redux Toolkit only (no ad-hoc `useState`/context for anything beyond purely ephemeral, view-local UI state like a dropdown's open/close). `redux-persist` will be added when the first feature needs persisted client state (e.g. auth tokens).
- **Server cache / data fetching**: RTK Query, code-split per feature — one `createApi` base slice with **no endpoints** (e.g. `src/lib/api/base-api.ts`), then each feature injects its own endpoints via `.injectEndpoints()` in its own model-layer file (e.g. `src/features/auth/model/auth-api.ts`). Never add endpoints to the base slice directly, and never define endpoints for feature A inside feature B's file.
- **Code splitting (project-wide, not just RTK Query)**: this is a mandate on the whole codebase's bundle boundaries, not one technique. Route-level splitting comes for free from the App Router (each `page.tsx` is already its own chunk) — but don't undo it by importing across feature boundaries or through barrel `index.ts` re-exports that pull unrelated features into the same chunk; each feature's model/viewmodel/view files should only be reachable through that feature's own route(s). On top of that: `next/dynamic` (with `ssr: false` where the thing is browser-only) for anything genuinely heavy and conditionally/below-the-fold rendered — the certificate/print view, a video player (Live section), a chessboard rendering library if one gets added, modals/dialogs that aren't visible on initial render — so their JS isn't in the initial page bundle. Don't reach for `next/dynamic` on small, always-visible UI (a button, a field) — that's not what it's for.
- **Forms**: `react-hook-form` + `zod` via `@hookform/resolvers` for every form. No uncontrolled/manual form state, no other validation library.
- **UI**: shadcn/ui for every element (buttons, inputs, layout primitives, and prefer shadcn text/typography primitives over bare `<p>`/`<span>` where one exists). Check for an existing shadcn component (install via the shadcn CLI) before hand-rolling HTML/CSS.
- **Loading states**: shadcn `Skeleton` for every async/data-dependent view — a skeleton matching the eventual layout, never a bare spinner or a blank flash while an RTK Query hook is loading.
- **Images**: `next/image` for every image, never a bare `<img>`. Configure `images.remotePatterns` in `next.config.ts` for the backend's asset host as soon as a feature actually renders a backend-hosted image (avatars, book covers, course thumbnails), rather than pre-emptively.

## Before building any feature: Figma and backend must agree

Cross-check both **before** writing a feature's code, not just for Auth/Profile: read the relevant Figma frames for layout/styling AND the relevant live Swagger group (see "Backend API reference (live)" below) for the actual fields/flow/validation, and reconcile them. Figma governs visuals only; the backend governs what data exists, what's required, and what the flow actually does. If a Figma frame implies a field, step, or endpoint the backend doesn't have, don't build it — flag it as a backend gap in the relevant to-do section (the pattern already used for phone auth, forgot-password, news comments, and the review-report modal) instead of guessing or inventing a client-only workaround. This applies to `builder`/`tester` agent work too — see their agent definitions.

## Figma design — implementation to-do list

Source of truth: [UzChess Figma](https://www.figma.com/design/rOvRUuLpYyFLJ1q8OUQIoO/UzChess?node-id=0-1) (single canvas, "Main"). Site language is Uzbek; dark theme. Re-fetch via the `figma` MCP server if details below need verifying — this list is a snapshot, not a mirror of the file.

**Before starting UI work**, resolve the open questions in "Ambiguities to clarify" below with design/product — several affect routing and component structure, not just visuals.

### Backend API reference (live)

Deployed backend + Swagger: `https://uzchess.onrender.com`. Same rule as Auth/Profile: **styling from Figma, fields/flow from these specs** — treat them as more current than reading backend source, since this is what's actually deployed. Re-fetch (`GET {base}/swagger/{group}-json`) if a shape looks stale.

- **`/swagger/home`** — Players (`GET /players/read`, `/players/ranking`, `/players/ranking/filters`), Games (`GET /games/read`, `/games/list`, `/games/filters`), Game of the Day (`GET /game-of-day/active`), News (`GET /news/read`, `/news/read/{id}`), Banners (`GET /banners/read`). Drives Home + Ranking + News + Live sections. Mutations (`create`/`update`/`delete`) on all of these are admin-only — ignore for the public site.
- **`/swagger/account`** — Auth (`/auth/register|login|refresh|logout`), Profile (`/profile`, `/profile/password`, `/profile/email(/resend|/confirm)`, `/profile/verify-email(/resend|/confirm)`), Book Cart (`/cart/read`, `/cart/summary`, `/cart/add|update|remove/{id}`), Book Favourite (`/favourites/read`, `/favourites/add|remove/{id}`), Order (`GET /orders`, `POST /orders/checkout`), Course Favourite (`/courses/favourites`, `/courses/favourite/{id}`). Drives Auth + Profile + Cart/Checkout sections.
- **`/swagger/books`** — Books (`GET /books/read`, `/books/read/{id}`, `/books/top-rated`), Authors/Book Categories/Difficulty/Languages (`GET .../read`, used as catalog filter option lists), Book Rating (`POST/DELETE /books/rate/{id}`), Coupon (`GET /coupons/read`), Delivery Setting (`GET /delivery-setting`). Drives Library section + checkout coupon/shipping.
- **`/swagger/courses`** — Courses (`GET /courses/read`, `/courses/read/{id}`, `/courses/top-rated`), Course Categories (filter option list), Course Rating (`GET /courses/reviews/{id}`, `POST/DELETE /courses/rate/{id}`), Course Sections/Lessons (`GET /courses/sections/read`, `/courses/lessons/read`), Course Purchase (`GET /courses/purchased`, `POST /courses/{id}/purchase`), Lesson Progress (`GET /courses/{id}/lessons`, `GET /courses/lessons/{id}/next`, `POST /courses/lessons/{id}/complete`), Certificate (`GET /courses/{id}/certificate`, `GET /certificates/{code}/verify`). Drives Education/Courses section.

**Terminology note**: Figma's "Sotib olingan/Saqlangan mahsulotlar" (purchased/saved *products*) in Profile means **books**, bought via `/cart` → `/orders/checkout` (not a separate "product" entity) — distinct from "kurslar" (courses), which are purchased directly via `/courses/{id}/purchase`. Map "mahsulotlar" lists to the Book Cart/Favourite/Order endpoints, "kurslar" lists to Course Purchase/Favourite endpoints.

### 0. Foundations (do first — everything else depends on these)

- [ ] Tailwind theme tokens — colors: `Main bg #111315`, `Dark #1A1D1F`, `Dark 2 #13181C`, `White #F7F9FA`, `Blue #1C92E0`, `Lighter blue #32ACFC`, `Secondary #6C6F70`, `secondary low #9DA1A3`, `Grey #ABABAF`, `Yellow #E0B531`, accent `#FFDF00`, `Green #82CC27`, `Red #DC2D2D`.
- [ ] Font: Poppins (Regular/Medium/Bold, 12–28px) as the primary typeface via `next/font`.
- [ ] shadcn primitives / wrappers for the recurring component set: Button (variants `type` Main/Secondary × `size` Small/Medium/Large × icon left/right/on-off), Field (Default/Phone number/Password, with focus/hover states), Tab, Checkbox, Radio, Switch/Toggle, Avatar, Dropdown, Pagination, Divider, Breadcrumb, Country-flag picker.
- [ ] Chess-specific components: `Simple board` (static/decorative board grid), `Chess Pieces`, `Chess Symbols`, `Difficulty level` badge (Beginner/Professional/Amateur), `Time management` tag (Bullet/Blitz/Rapid), `Victory`/`Game info` row (avatars, result, game type, date, move count).
- [ ] Layout shell: desktop top `Header`/`Top bar` + `Footer` (social icons: Instagram/Telegram/YouTube/Twitter/Facebook); mobile `TabBar` bottom nav + `HomeIndicator` (separate nav paradigm from desktop, not a responsive collapse of the header).
- [ ] Global "site in test mode" banner (UZ/RU/EN).

### 1. Home
- [ ] Base layout: hero/news carousel (`GET /news/read`, latest N), donation banner, promo `Banners` (`GET /banners/read`), "Game of the day" video block (`GET /game-of-day/active`, → links to Live single-game page), Top-5 ranking widget (`GET /players/ranking`, sliced to 5, → "Barchasi" links to full Ranking page), Top-4 courses (`GET /courses/top-rated`, → links to catalog), Top books (`GET /books/top-rated`), footer.
- [ ] Header states as one parametrized component (not separate pages): logged-out (Kirish/Ro'yxatdan o'tish), logged-in w/ avatar dropdown, search-open, notifications-open, language-switcher-open, scroll-compacted.
- [ ] Global search — matches on title only (per design annotation).

### 2. Auth (modal/overlay flow over dimmed home background, not standalone routes — confirm before building)

Figma's auth flow (phone/email tabs, phone OTP, "forgot password") is confusing and doesn't match what the backend (`uzchess/backend`, NestJS + CQRS, see `POST /auth/*` and `/profile/*` in its Swagger/controllers) actually implements. **Take visual styling/layout from Figma (Field/Button/OTP-input components, spacing, colors) but drive the screens/flow/fields from the backend API below — do not build the phone tabs or forgot-password frames as designed.**

Backend reality (`src/features/auth` in the backend repo):
- **No phone auth exists** — `User` entity has no phone column; `RegisterRequest`/`LoginRequest` are email+password only. Drop the Phone number / Email tab split and the "yoki" divider entirely — build a single email+password form for sign up and sign in.
- **No public forgot/reset-password endpoint exists yet.** `PATCH /profile/password` requires an authenticated session and `currentPassword` — it's a "change password" form, not "forgot password". Do **not** build the Figma "Forgot password" (phone/email confirmation + create-new-password) frames — flag this as a backend gap and skip it until an endpoint is added.
- [ ] **Sign up** — `POST /auth/register` `{firstName, lastName, email, password, confirmPassword}`. Response includes the user plus `accessToken`/`refreshToken` — registration logs the user in immediately (no separate login step after signup).
- [ ] **Sign in** — `POST /auth/login` `{email, password}` → `{accessToken, refreshToken}`.
- [ ] **Session/token handling** — store `accessToken`/`refreshToken` in Redux (+ persist); silent refresh via `POST /auth/refresh` `{refreshToken}`; `POST /auth/logout` (authenticated, bearer token) to invalidate.
- [ ] **Email verification (post-signup, non-blocking)** — since register already returns a session, show a "verify your email" prompt (reuse Figma's OTP-typing/error visuals for a **6-digit numeric code**, with resend cooldown) backed by `POST /profile/verify-email/resend` and `POST /profile/verify-email/confirm {code}`. Codes expire (`GoneException` → "request a new code" state) — surface that as the OTP error state.
- [ ] Terms checkbox on sign up — no backend field for it; treat as client-only gating before enabling the submit button (confirm with product whether this needs a backend flag later).

### 3. Ranking
- [ ] Ranking table component (shared with home widget) — `GET /players/ranking`
- [ ] Full ranking page: tabs (Barchasi / Tamomlangan o'yinlar / Barcha o'yinlar likely map to `GET /games/list` + `/games/filters`, TBD against actual query params), country-flag filter (`GET /players/ranking/filters` for the option list), pagination

### 4. News
- [ ] News list (`GET /news/read`, incl. empty state: "Hech qanday ma'lumot topilmadi")
- [ ] News single/detail (`GET /news/read/{id}`) — share, related articles, comment thread with replies (**no comments endpoint exists in `/swagger/home` or `/swagger/account`** — flag as a backend gap like the forgot-password one, don't build against it yet)
- [ ] Homepage news section shows latest items only (per design annotation)

### 5. Education / Courses
- [ ] Catalog (`GET /courses/read`) with filters (`GET /courses/categories/read` for category, `GET /languages/read`/`GET /difficulty/read` from the books group for language/level — confirm these are shared across books+courses or course-specific, rating filter is a query param) + "Tozalash" clear-all
- [ ] Course detail (`GET /courses/read/{id}`) — pricing, section/lesson list (`GET /courses/sections/read`, `GET /courses/lessons/read`), difficulty tag, purchased badge (`GET /courses/purchased`), video preview, reviews (`GET /courses/reviews/{id}`, submit via `POST /courses/rate/{id}`)
- [ ] Lesson/tactics answering screen (countdown timer, submit via `POST /courses/lessons/{id}/complete`)
- [ ] "Next lesson locked" modal when next lesson isn't purchased (`GET /courses/lessons/{id}/next` — per design annotation)
- [ ] Course completion screen + certificate (`GET /courses/{id}/certificate`, printable, landscape; verification via `GET /certificates/{code}/verify`)
- [ ] Purchase modal (default / success / fail) — `POST /courses/{id}/purchase`
- [ ] Review report modal ("Shikoyat qilish", reason dropdown + optional text) — **no report/moderation endpoint found**; flag as a backend gap
- [ ] Course comments visible only to purchasers who completed the course (per design annotation — backend-enforced via `/courses/reviews/{id}`, but UI should reflect gated state)
- [ ] Responsive/mobile variants for catalog + detail

### 6. Library (books)
- [ ] Catalog (`GET /books/read`) with filters (`GET /books/categories/read`, `GET /authors/read`, `GET /difficulty/read`, `GET /languages/read`)
- [ ] Book detail (`GET /books/read/{id}`) — not-purchased (price, add to cart via `POST /cart/add/{id}`, author, pages, year) and purchased states (cross-check against `GET /orders`); rating via `POST/DELETE /books/rate/{id}`
- [ ] Responsive variant

### 7. Contact ("Bog'lanish")
- [ ] Full page: map, hours, email, phone, nearest metro, contact form
- [ ] Short/footer variant

### 8. Live
- [ ] Video-stream viewer (play/pause/settings/fullscreen), live badge, game title/round, sidebar course cards + promo. This is a video player, not an interactive board (confirm no playable-board feature is in scope).

### 9. Profile

Same rule as Auth above: styling from Figma, fields/flow from the backend (`/profile` endpoints). No phone field exists on the backend `User` entity — drop "edit phone number" entirely.

- [ ] Dashboard shell with left-nav tabs: general settings, purchased courses, orders, saved items
- [ ] `GET /profile` → `{id, firstName, lastName, avatar, email, isEmailVerified, birthDate}` — drives the dashboard header + edit form defaults.
- [ ] Edit profile — `PATCH /profile` (multipart/form-data) `{firstName?, lastName?, birthDate?, avatar?}`.
- [ ] Change password — `PATCH /profile/password` `{currentPassword, newPassword, confirmNewPassword}` (authenticated; this is the only "password reset" surface that currently exists — see Auth section note on the missing forgot-password endpoint).
- [ ] Edit email (no "edit phone") — `PATCH /profile/email` `{currentPassword, newEmail}` sends a 6-digit code to the new address, then `POST /profile/email/confirm {code}` finalizes it (same OTP visual as email verification, separate cache/endpoint from signup verification).
- [ ] Purchased products (books, `GET /orders`), purchased courses (`GET /courses/purchased`) lists
- [ ] Saved courses (`GET /courses/favourites`) / saved products (books, `GET /favourites/read`) — Figma's "saved books" is the same list as "saved products" (see terminology note above), not a third endpoint

### 10. Cart / Checkout
- [ ] Cart (`GET /cart/read`, `GET /cart/summary`) — line items, quantity picker (`PATCH /cart/update/{id}`, `DELETE /cart/remove/{id}`), totals, discount, coupon (`GET /coupons/read` for validation — confirm exact apply-coupon contract against `/orders/checkout` payload)
- [ ] Checkout — shipping/contact form (shipping cost from `GET /delivery-setting`), place order via `POST /orders/checkout`
- [ ] Order success

### 11. Misc
- [ ] Static/CMS page template (Terms, About, etc.)
- [ ] 404 page (decorative chessboard illustration)

### Ambiguities to clarify before implementation
- Confirm whether the large English-language admin/social-analytics mockup block found in the file (Inter font, "Promote"/"Engagement" widgets) is a stray moodboard to ignore, not a real UzChess screen.
- Confirm auth is intended as a modal/overlay over the home page (not `/login`, `/register` routes) — the Figma frames imply this.
- Confirm which of the near-duplicate frames per flow (courses detail, profile, sign-in) represent real states (loading/empty/error) vs. leftover design iterations.
- Confirm the production country list for the Ranking filter (curated federation list vs. full FIDE list) — a content decision, not a design one.
- Confirm no interactive/playable chessboard feature is in scope for this phase (only decorative/static board usage found in the design).
- **Auth/Profile now follow the backend API, not the Figma flow** (see sections 2 and 9) — no phone auth and no forgot-password endpoint exist in the backend yet. If product wants phone login or self-service password reset, that requires new backend work first; don't build frontend screens against those Figma frames until an endpoint exists.
