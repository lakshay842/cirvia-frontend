# Cirvia Frontend — Phase 4 Report

**Date:** 2025-06-25  
**Scope:** Reviews (display), notifications inbox, saved events, recently viewed, host dashboard & wallet improvements  
**Status:** ✅ Complete — awaiting approval

---

## Summary

Phase 4 extends the authenticated experience with notification inbox + polling badge, saved/favorites listing, client-side recently viewed, rating display components, and richer host dashboard/wallet views. All server data uses **implemented backend APIs only** — no mock API responses.

**Quality gate:** `npm run lint` ✅ · `npm run typecheck` ✅ · `npm run build` ✅

---

## Implemented Features

### Reviews & Ratings (partial — backend module not deployed)

| UI | Status | Data source |
|----|--------|-------------|
| `RatingStars` component | ✅ | Display-only |
| `ReviewSummaryCard` on host profile | ✅ | `GET /hosts/:slug` → `hostRating`, `totalReviews` |
| Rating on event detail (host) | ✅ | Event public view → `host.hostRating` |
| Leave review (`/bookings/[id]/review`) | ✅ Eligibility UI | **No `POST /reviews/*` API** — shows honest blocker message |
| Review cards (individual reviews) | ❌ Deferred | No `GET /events/:id/reviews` or list endpoint |

### Notification Inbox & Badge

| Route / UI | Feature | API |
|------------|---------|-----|
| `/notifications` | Inbox with filters, mark read, delete | `GET /notifications`, `PATCH .../read`, `PATCH /read-all`, `DELETE .../:id` |
| `/notifications/preferences` | Delivery preferences | `GET/PATCH /notifications/preferences` |
| Navbar badge | Unread count, polls every 30s | `GET /notifications?unreadOnly=true&limit=1` → `unreadCount` |

**Note:** No WebSocket/SSE on backend. Badge uses polling (not push real-time).

### Saved Events / Favorites

| Route | Feature | API |
|-------|---------|-----|
| `/saved` | List favorited events | `GET /users/me/saved-events` |

**Gap:** `POST/DELETE /events/:eventId/save` not implemented on backend — cannot add/remove favorites from UI.

### Recently Viewed

| Route | Feature | Storage |
|-------|---------|---------|
| `/recently-viewed` | Browsed events on this device | `localStorage` + refresh via `GET /events/:slug` |

**Gap:** No server-side recently-viewed API (`event_views` table unused).

### Host Dashboard Improvements

| Enhancement | API |
|-------------|-----|
| Extended stat cards (reviews, response rate, revenue placeholder, wallet balance) | `GET /hosts/dashboard`, `GET /wallet` |
| Pending booking requests with approve/reject | `GET /hosts/bookings?status=pending`, `PATCH .../approve`, `PATCH .../reject` |
| Quick links to wallet & withdrawals | — |

### Wallet History & Withdrawal Requests

| UI | API |
|----|-----|
| Wallet tabs: Overview / History / Withdrawals | `GET /wallet`, `GET /wallet/transactions`, `GET /wallet/withdrawals` |
| Withdrawal request form (Phase 3, linked from dashboard) | `POST /wallet/withdraw`, bank accounts CRUD |

---

## New Files

| Area | Paths |
|------|-------|
| Types | `notification.types.ts`, `saved-event.types.ts` |
| Services | `notification.service.ts`; extended `user.service.ts` |
| Hooks | `useNotifications.ts`, `useSavedEvents.ts`, `useRecentlyViewed.ts`, `useHostBookings.ts` |
| Components | `rating-stars.tsx`, `review-summary-card.tsx`, `notification-badge.tsx` |
| Features | `notification-inbox-page.tsx`, `notification-preferences-page.tsx`, `saved-events-page.tsx`, `recently-viewed-page.tsx`, `leave-review-page.tsx` |
| Lib | `recently-viewed.ts` (client-side history) |

---

## Routes Added / Changed

```
/notifications              → inbox (was preferences-only in Phase 3)
/notifications/preferences  → delivery toggles
/saved                      → saved events list
/recently-viewed            → local browse history
/bookings/[bookingId]/review → leave review (API pending)
```

**Navbar:** Notification badge, Saved link, mobile notification access.

---

## Backend API Gaps (documented, not mocked)

| Feature | Missing API |
|---------|-------------|
| Submit/list reviews | Entire `/reviews` module |
| Save/unsave events | `POST/DELETE /events/:eventId/save` |
| Server recently viewed | No list/record endpoint |
| Real-time notifications | No WebSocket; polling used |
| Individual review cards | No public review list endpoints |

---

## Environment

Unchanged from Phase 3 — `NEXT_PUBLIC_API_URL`, optional `NEXT_PUBLIC_RAZORPAY_KEY`.

---

**Stop.** Phase 4 complete. Awaiting approval.
