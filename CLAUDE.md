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

This is presently a bare `create-next-app` scaffold (App Router, TypeScript, Tailwind CSS v4 via `@tailwindcss/postcss`) — only `src/app/layout.tsx`, `src/app/page.tsx`, and `src/app/globals.css` exist. Path alias `@/*` maps to `./src/*` (see `tsconfig.json`). Treat any architectural guidance below as the standard to build *toward* as features are added, not a description of code that already exists.

## Mandated architecture

The project follows a strict MVVM layering, deliberately as rigorous as a NestJS backend's module/service/controller separation — not a loose app-router free-for-all:

- **Model** — types/zod schemas/entities (zod schemas double as validation + model layer), plus the API/data-access layer.
- **ViewModel** — hooks/services owning state, business logic, and orchestration: Redux Toolkit slices, RTK Query endpoints, custom hooks. No JSX here.
- **View** — "dumb" components built from shadcn/ui primitives that only render UI, receiving data/handlers via props or hooks.

Apply SOLID principles per component/hook/service (single responsibility, dependency inversion via hooks/interfaces rather than tight coupling). When scaffolding a new feature, create separate model / viewmodel / view pieces rather than mixing data-fetching or business logic directly into JSX.

## Mandated tech stack

- **State**: Redux Toolkit only (no ad-hoc `useState`/context for anything beyond purely ephemeral, view-local UI state like a dropdown's open/close). `redux-persist` and RTK Query will be added later — design slices so server-cache state stays separable from client UI state for a clean RTK Query migration.
- **Forms**: `react-hook-form` + `zod` via `@hookform/resolvers` for every form. No uncontrolled/manual form state, no other validation library.
- **UI**: shadcn/ui for every element (buttons, inputs, layout primitives, and prefer shadcn text/typography primitives over bare `<p>`/`<span>` where one exists). Check for an existing shadcn component (install via the shadcn CLI) before hand-rolling HTML/CSS.

## Figma design — implementation to-do list

Source of truth: [UzChess Figma](https://www.figma.com/design/rOvRUuLpYyFLJ1q8OUQIoO/UzChess?node-id=0-1) (single canvas, "Main"). Site language is Uzbek; dark theme. Re-fetch via the `figma` MCP server if details below need verifying — this list is a snapshot, not a mirror of the file.

**Before starting UI work**, resolve the open questions in "Ambiguities to clarify" below with design/product — several affect routing and component structure, not just visuals.

### 0. Foundations (do first — everything else depends on these)

- [ ] Tailwind theme tokens — colors: `Main bg #111315`, `Dark #1A1D1F`, `Dark 2 #13181C`, `White #F7F9FA`, `Blue #1C92E0`, `Lighter blue #32ACFC`, `Secondary #6C6F70`, `secondary low #9DA1A3`, `Grey #ABABAF`, `Yellow #E0B531`, accent `#FFDF00`, `Green #82CC27`, `Red #DC2D2D`.
- [ ] Font: Poppins (Regular/Medium/Bold, 12–28px) as the primary typeface via `next/font`.
- [ ] shadcn primitives / wrappers for the recurring component set: Button (variants `type` Main/Secondary × `size` Small/Medium/Large × icon left/right/on-off), Field (Default/Phone number/Password, with focus/hover states), Tab, Checkbox, Radio, Switch/Toggle, Avatar, Dropdown, Pagination, Divider, Breadcrumb, Country-flag picker.
- [ ] Chess-specific components: `Simple board` (static/decorative board grid), `Chess Pieces`, `Chess Symbols`, `Difficulty level` badge (Beginner/Professional/Amateur), `Time management` tag (Bullet/Blitz/Rapid), `Victory`/`Game info` row (avatars, result, game type, date, move count).
- [ ] Layout shell: desktop top `Header`/`Top bar` + `Footer` (social icons: Instagram/Telegram/YouTube/Twitter/Facebook); mobile `TabBar` bottom nav + `HomeIndicator` (separate nav paradigm from desktop, not a responsive collapse of the header).
- [ ] Global "site in test mode" banner (UZ/RU/EN).

### 1. Home
- [ ] Base layout: hero/news carousel, donation banner, promo `Banners`, "Game of the day" video block (→ links to Live single-game page), Top-5 ranking widget (→ "Barchasi" links to full Ranking page), Top-4 courses (→ links to catalog), Top books, footer.
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
- [ ] Ranking table component (shared with home widget)
- [ ] Full ranking page: tabs (Barchasi / Tamomlangan o'yinlar / Barcha o'yinlar), country-flag filter, pagination

### 4. News
- [ ] News list (incl. empty state: "Hech qanday ma'lumot topilmadi")
- [ ] News single/detail — share, related articles, comment thread with replies
- [ ] Homepage news section shows latest items only (per design annotation)

### 5. Education / Courses
- [ ] Catalog with filters (level, category, language, rating) + "Tozalash" clear-all
- [ ] Course detail — pricing, section/lesson list, difficulty tag, purchased badge, video preview, reviews
- [ ] Lesson/tactics answering screen (countdown timer, submit answer)
- [ ] "Next lesson locked" modal when next lesson isn't purchased (per design annotation)
- [ ] Course completion screen + certificate (printable, landscape)
- [ ] Purchase modal (default / success / fail)
- [ ] Review report modal ("Shikoyat qilish", reason dropdown + optional text)
- [ ] Course comments visible only to purchasers who completed the course (per design annotation — backend-enforced, but UI should reflect gated state)
- [ ] Responsive/mobile variants for catalog + detail

### 6. Library (books)
- [ ] Catalog
- [ ] Book detail — not-purchased (price, add to cart, author, pages, year) and purchased states
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
- [ ] Purchased products, purchased courses lists
- [ ] Saved courses / saved products / saved books (three separate lists)

### 10. Cart / Checkout
- [ ] Cart — line items, quantity picker, totals, discount, coupon
- [ ] Checkout — shipping/contact form, place order
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
