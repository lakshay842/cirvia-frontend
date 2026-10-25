# Cirvia Frontend — Phase 2 Report

**Date:** 2025-06-25  
**Scope:** Authentication, profile, discover, event detail, host flows  
**Status:** ✅ Complete — awaiting approval

---

## Summary

Phase 2 extends the marketing website with full user-facing flows connected to **real backend APIs only**. No mock data, no fake endpoints.

---

## Implemented Features

### Authentication
| Route | Feature | API |
|-------|---------|-----|
| `/login` | Email + password login | `POST /auth/login` |
| `/login` | Phone OTP login (send + verify) | `POST /auth/send-phone-otp`, `POST /auth/login-phone` |
| `/register` | Account registration | `POST /auth/register` |
| `/forgot-password` | Password reset request | `POST /auth/forgot-password` |
| `/reset-password?token=` | Password reset | `POST /auth/reset-password` |
| `/verify-email?token=` | Email verification | `POST /auth/verify-email` |
| `/verify-phone` | Phone verification (authenticated) | `POST /auth/send-phone-otp`, `POST /auth/verify-phone-otp` |

**Auth infrastructure:**
- Zustand auth store with persistence (`cirvia-auth`)
- Axios interceptors — Bearer token injection + automatic refresh on 401
- `AuthGuard` — protects `/profile`, `/become-host`, `/host/events/create`, `/verify-phone`
- Guest-only redirect for login/register/forgot/reset when authenticated

**Not implemented (backend not ready):**
- Google OAuth (`POST /auth/google` throws "not yet configured")

### Profile
| Route | Feature | API |
|-------|---------|-----|
| `/profile` | View profile, trust score, verification status | `GET /users/me` |
| `/profile` | Edit profile | `PATCH /users/profile` |
| `/profile` | Resend email verification | `POST /auth/send-email-verification` |
| `/profile` | Logout | `POST /auth/logout` |

### Discover / Explore Events
| Route | Feature | API |
|-------|---------|-----|
| `/discover` | Event listing with pagination | `GET /events` |
| `/discover` | Search | `GET /events/search` |
| `/discover` | Filters — city, category, price, sort, verified host | Query params on `/events` |
| `/discover/category/[slug]` | Category-filtered events | `GET /events?category=slug` |
| `/discover` | Category browse grid | `GET /categories` |

**Filter options:** newest, trending, rating, price asc/desc, free/paid, verified hosts

### Event Detail
| Route | Feature | API |
|-------|---------|-----|
| `/event/[slug]` | Full event view — media, rules, host, location | `GET /events/:slug` |

Booking CTA links to login (booking module UI deferred per scope).

### Host Profile
| Route | Feature | API |
|-------|---------|-----|
| `/host/[slug]` | Public host profile — bio, ratings, gallery | `GET /hosts/:slug` |

### Become Host
| Route | Feature | API |
|-------|---------|-----|
| `/become-host` | Host application form | `POST /hosts/apply` |
| `/become-host` | Auto token refresh after apply (HOST role) | `POST /auth/refresh` |

### Create Event
| Route | Feature | API |
|-------|---------|-----|
| `/host/events/create` | Create event (HOST role required) | `POST /events` |
| `/host/events/create` | Category picker | `GET /categories` |

---

## New Files (Phase 2)

### Types
- `types/auth.types.ts`, `types/user.types.ts`, `types/host.types.ts`
- Extended `types/event.types.ts` (detail, search params, create response)

### Services
- `services/auth.service.ts`
- `services/user.service.ts`
- `services/host.service.ts`
- Extended `services/event.service.ts` (search, detail, create)

### Stores
- `stores/auth-store.ts`

### Schemas (Zod — mirrors backend validation)
- `schemas/auth.schema.ts`
- `schemas/profile.schema.ts`
- `schemas/host.schema.ts`

### Hooks
- `hooks/useAuth.ts` — login, register, logout, OTP, verify, refresh
- `hooks/useProfile.ts` — profile fetch + update
- `hooks/useHost.ts` — host profile, become host
- Extended `hooks/useEvents.ts` — search, detail, create

### Features
- `features/auth/` — login, register, forgot/reset password, verify email/phone forms
- `features/discover/discover-page.tsx`
- `features/events/event-detail-page.tsx`
- `features/profile/profile-page.tsx`
- `features/host/` — host profile, become host, create event

### Routes (15 total)
```
/login, /register, /forgot-password, /reset-password, /verify-email
/verify-phone, /profile
/discover, /discover/category/[slug]
/event/[slug], /host/[slug]
/become-host, /host/events/create
```

### Components
- `components/navigation/auth-guard.tsx`
- `components/layout/auth-layout.tsx`
- `components/forms/otp-input.tsx`
- Updated `components/navigation/navbar.tsx` — auth-aware (profile, create event)

---

## Architecture Decisions

1. **Token refresh** — Axios response interceptor refreshes on 401, queues concurrent requests
2. **HOST role** — After `/hosts/apply`, frontend calls `/auth/refresh` to get updated JWT with HOST role
3. **AuthGuard (client-side)** — Zustand persist uses localStorage; middleware cannot read tokens, so client guard is used (same pattern as admin dashboard)
4. **Search vs list** — Keyword search uses `/events/search`; filters use `/events` with query params
5. **No booking UI** — Event detail shows "Sign in to join" — booking flow explicitly out of scope

---

## Quality Gate

| Check | Result |
|-------|-------|
| `npm run lint` | ✅ Pass |
| `npm run typecheck` | ✅ Pass |
| `npm run build` | ✅ Pass (15 routes) |

---

## API Endpoints Used (Phase 2)

### Auth (11)
`POST /auth/register`, `/login`, `/login-phone`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`, `/send-email-verification`, `/send-phone-otp`, `/verify-phone-otp`

### Users (2)
`GET /users/me`, `PATCH /users/profile`

### Events (5)
`GET /events`, `/events/search`, `/events/:slug`, `POST /events`  
(+ Phase 1: `/events/featured`, `/events/trending`)

### Categories (1)
`GET /categories`

### Hosts (2)
`GET /hosts/:slug`, `POST /hosts/apply`

---

## Not Built (Deferred)

- Booking flow / payments
- Google OAuth login
- Host dashboard / event management (edit, publish, media upload)
- Public user profile by username (`GET /users/:username`)
- Saved events, followers, settings pages
- Mapbox integration

---

## Running Locally

```bash
# Backend (port 3000)
cd backend-api && npm run dev

# Frontend (port 3001)
cd frontend-web && npm run dev
```

1. Register at `/register`
2. Verify email via link (or resend from `/profile`)
3. Browse `/discover`, view `/event/[slug]`
4. Apply at `/become-host`, then create at `/host/events/create`

---

**Phase 2 complete. Awaiting approval for Phase 3** (booking, host dashboard, event management).
