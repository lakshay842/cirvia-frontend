# Cirvia Frontend — Phase 3 Report

**Date:** 2025-06-25  
**Scope:** Booking, payments, host dashboard, wallet, event management, settings  
**Status:** ✅ Complete — awaiting approval

---

## Summary

Phase 3 adds authenticated booking and payment flows, host operations (dashboard, analytics, wallet, withdrawals, event management), and user settings/notification preferences. All data comes from **existing backend APIs** — no mock data or fake endpoints.

**Quality gate:** `npm run lint` ✅ · `npm run typecheck` ✅ · `npm run build` ✅ (31 routes)

---

## Implemented Features

### Booking Flow
| Route | Feature | API |
|-------|---------|-----|
| `/event/[slug]/book` | Select tickets, optional coupon, create booking | `POST /bookings` |
| `/bookings` | My bookings with status filters | `GET /bookings?status=` |
| `/bookings/[bookingId]` | Booking details, timeline, status polling | `GET /bookings/:id`, `/status`, `/timeline` |
| `/bookings/[bookingId]` | Cancel booking | `PATCH /bookings/:id/cancel` |
| `/bookings/[bookingId]/ticket` | QR ticket UI (stub-aware) | `GET /bookings/:id/qr` |

### Payments
| Route | Feature | API |
|-------|---------|-----|
| `/bookings/[bookingId]/payment` | Create order + Razorpay / mock checkout | `POST /payments/order`, `POST /payments/verify` |
| `/payments/success` | Success confirmation | — (post-verify redirect) |
| `/payments/failed` | Failure + retry link | — |

**Dev/mock:** When backend returns `order_mock_*`, UI shows “Complete test payment” (signature ≥ 10 chars accepted by backend mock gateway).

### Host Dashboard & Analytics
| Route | Feature | API |
|-------|---------|-----|
| `/host/dashboard` | Stats, pending tasks, recent activity | `GET /hosts/dashboard` |
| `/host/analytics` | Host performance metrics | `GET /hosts/me/analytics` |

### Host Wallet
| Route | Feature | API |
|-------|---------|-----|
| `/host/wallet` | Balance summary + transactions | `GET /wallet`, `GET /wallet/transactions` |
| `/host/wallet/withdraw` | Withdraw + bank accounts | `POST /wallet/withdraw`, `GET/POST /wallet/bank-accounts` |
| `/host/wallet/withdraw` | Withdrawal history | `GET /wallet/withdrawals` |

### Event Management (Host)
| Route | Feature | API |
|-------|---------|-----|
| `/host/events` | List host events with status filter | `GET /hosts/events` |
| `/host/events/[eventId]/edit` | Edit event fields | `PATCH /events/:eventId` |
| Edit / list actions | Publish | `PATCH /events/:eventId/publish` |
| Edit / list actions | Unpublish | `PATCH /events/:eventId/unpublish` |
| Edit / list actions | Archive | `PATCH /events/:eventId/archive` |
| `/host/events/create` | Redirect to edit after create (stores event ID) | `POST /events` |

### Settings & Notifications
| Route | Feature | API |
|-------|---------|-----|
| `/settings` | Account + privacy preferences | `GET/PATCH /users/me/settings/*` |
| `/notifications` | Notification delivery toggles only | `GET/PATCH /users/me/settings/notifications` |

**Note:** No in-app notification inbox API exists on the backend. The notifications page is preference toggles only (no fake inbox).

---

## New Infrastructure

| Area | Files |
|------|-------|
| Types | `booking.types.ts`, `payment.types.ts`, `wallet.types.ts`, `settings.types.ts` |
| Services | `booking.service.ts`, `payment.service.ts`, `wallet.service.ts`, `settings.service.ts` |
| Hooks | `useBookings.ts`, `usePayments.ts`, `useWallet.ts`, `useSettings.ts` |
| Event ID registry | `lib/event-id-registry.ts` — session cache for slug → UUID |
| Host shell | `components/host/host-shell.tsx` — sidebar layout for host panel |

**Navbar:** Bookings link, Host dashboard link (HOST role), existing profile/create event links.

**Auth guard:** Extended protected routes for bookings, settings, payments, host panel, and `/event/*/book`. HOST role required for `/host/dashboard`, `/host/analytics`, `/host/wallet`, `/host/events`.

---

## API Gap: Public Event UUID

`POST /bookings` requires `eventId` (UUID). Public `GET /events/:slug` and `GET /hosts/events` list items return **no event `id`**.

**Frontend workaround (no backend changes):**
1. **Session registry** — stores `slug → eventId` after event create or when learned from bookings.
2. **Booking history scan** — `GET /bookings` summaries include `event.eventId` + `event.slug`.
3. **Host bookings scan** — `GET /hosts/bookings` for host-side slug → ID mapping.
4. **Query param** — `/event/[slug]/book?eventId=` when ID is known.

**Impact:** First-time guests booking a published event they have never interacted with may see “Booking unavailable” until the backend exposes `id` on public/list responses. Hosts can manage events created in-session or events with known IDs from bookings.

**Recommended backend follow-up:** Add `id` to `EventPublicView` and `EventListItemView`.

---

## QR Ticket Stub

`GET /bookings/:id/qr` returns `{ qrCode: null, note }`. UI displays booking reference and the API note — no fabricated QR image.

---

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base (default `http://localhost:3000/api/v1`) |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Razorpay checkout key (optional; mock flow when unset) |

---

## Routes Added (Phase 3)

```
/bookings
/bookings/[bookingId]
/bookings/[bookingId]/payment
/bookings/[bookingId]/ticket
/event/[slug]/book
/payments/success
/payments/failed
/host/dashboard
/host/analytics
/host/wallet
/host/wallet/withdraw
/host/events
/host/events/[eventId]/edit
/settings
/notifications
```

---

## Not in Scope (Phase 4+)

- Google OAuth
- In-app notification inbox
- Real QR generation (backend stub)
- Admin moderation UI
- Mobile app

---

**Stop.** Phase 3 complete. Awaiting approval before Phase 4.
