# ROUTING_STRUCTURE.md

# Cirvia Frontend Routing Structure (Next.js App Router)

## Routing Principles

* Use Next.js App Router only.
* Prefer Server Components by default.
* Use Client Components only when required.
* Group related routes using Route Groups.
* Keep layouts reusable.
* Protect authenticated routes with middleware.
* Use meaningful URLs.
* Avoid deep nesting beyond what improves organization.

---

# Root Structure

```text
app/
│
├── (marketing)/
├── (auth)/
├── (discover)/
├── (host)/
├── (user)/
├── (settings)/
├── (legal)/
├── (dashboard)/
├── api/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── not-found.tsx
├── error.tsx
└── global-error.tsx
```

---

# Marketing Routes

Public routes.

```text
/

about

pricing

safety

trust

how-it-works

become-host

contact

faq

blog

blog/[slug]
```

Shared Layout

Marketing Navbar

Marketing Footer

Animated Hero

SEO Metadata

---

# Authentication Routes

```text
/login

/register

/forgot-password

/reset-password

/verify-email

/verify-phone

/complete-profile
```

Special Layout

Centered Card

Animated Background

Minimal Navigation

---

# Discover Routes

```text
/discover

/discover/map

/discover/category/[slug]

/discover/location/[city]

/event/[eventId]

/event/[eventId]/gallery

/event/[eventId]/reviews
```

---

# User Routes

Protected

```text
/profile

/profile/edit

/profile/security

/profile/privacy

/profile/verification

/profile/trust-score

/profile/followers

/profile/following
```

---

# Bookings

```text
/bookings

/bookings/upcoming

/bookings/history

/bookings/[bookingId]
```

---

# Saved

```text
/saved

/history

/notifications
```

---

# Host Routes

Protected

```text
/host

/host/onboarding

/host/dashboard

/host/events

/host/events/create

/host/events/[eventId]

/host/events/[eventId]/edit

/host/bookings

/host/revenue

/host/reviews

/host/analytics

/host/settings
```

---

# Dashboard Layout

Sidebar

Header

Breadcrumb

Content

Floating Action Button

---

# User Dashboard

```text
/dashboard

/dashboard/home

/dashboard/events

/dashboard/bookings

/dashboard/saved

/dashboard/messages

/dashboard/reviews

/dashboard/settings
```

---

# Settings

```text
/settings

/settings/profile

/settings/account

/settings/security

/settings/privacy

/settings/notifications

/settings/theme

/settings/devices
```

---

# Legal

```text
/privacy

/terms

/community-guidelines

/cookie-policy

/refund-policy
```

---

# Error Pages

```text
404

403

401

500

maintenance
```

Every error page must include

Illustration

CTA

Helpful Message

---

# Middleware Protection

Public

Landing

About

Pricing

FAQ

Contact

Discover

Event Detail

Protected

Dashboard

Bookings

Saved

Profile

Host

Settings

Admin (future)

Redirect unauthenticated users to login.

---

# Route Groups

```text
(marketing)

(auth)

(discover)

(host)

(user)

(settings)

(legal)

(dashboard)
```

Used only for organization.

Do not affect URLs.

---

# Dynamic Routes

```text
/event/[eventId]

/blog/[slug]

/discover/category/[slug]

/discover/location/[city]

/host/events/[eventId]

/bookings/[bookingId]

/profile/[username]
```

---

# Loading UI

Each major route must have:

loading.tsx

Use Skeleton UI.

No blank screens.

---

# Error Boundaries

Every feature module should include:

error.tsx

Recover Button

Retry

Support Link

---

# Metadata

Every route must define:

* title
* description
* Open Graph
* Twitter Card
* Canonical URL
* Structured Data (where relevant)

---

# Layout Hierarchy

Root Layout

↓

Marketing Layout

↓

Discover Layout

↓

Dashboard Layout

↓

Host Layout

Each layout should share common navigation and providers.

---

# Navigation Flow

Guest

Landing

↓

Discover

↓

Event Details

↓

Register

↓

Verification

↓

Booking

↓

Profile

Verified User

↓

Dashboard

↓

Upcoming Events

↓

Reviews

↓

Trust Score

Host

↓

Host Dashboard

↓

Create Event

↓

Manage Guests

↓

Analytics

---

# Route Naming Rules

Use lowercase.

Use hyphens for multi-word routes.

Examples:

```text
become-host
trust-score
forgot-password
community-guidelines
```

Avoid camelCase in URLs.

---

# SEO-Friendly URLs

Good

```text
/discover/game-night-delhi
```

Avoid

```text
/event?id=123
```

Prefer readable slugs where possible:

```text
/event/game-night-noida-abc123
```

---

# Future Routes

```text
/messages

/chat

/community

/groups

/referrals

/membership

/premium

/voice-room

/live-events

/travel

/experiences
```

Keep architecture ready without implementing them now.

---

# Navigation Components

Global Navbar

Dashboard Sidebar

Mobile Bottom Navigation

Breadcrumb

Command Palette

Quick Search

Notifications Panel

Profile Menu

All navigation components must be reusable.

---

# Final Routing Rules

* Every page must have a dedicated layout when needed.
* Never duplicate layouts.
* Keep URLs clean and human-readable.
* Protect private routes with middleware.
* Use loading and error boundaries for every major feature.
* Maintain consistent navigation across the entire product.
* Design the routing so future modules can be added without breaking existing URLs.
