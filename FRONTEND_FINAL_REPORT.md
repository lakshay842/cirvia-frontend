# Frontend Final Report — Sprint 6

**Project:** Cirvia `frontend-web`  
**Sprint:** 6 — Final Polish  
**Date:** June 25, 2026  
**Stack:** Next.js 15 · React 19 · TanStack Query · Tailwind CSS 4 · Framer Motion

---

## Executive Summary

Sprint 6 focused on production polish across accessibility, performance, SEO, loading/error UX, discover search/filters, infinite scroll, image optimization, and mobile responsiveness. All changes are frontend-only; no new backend APIs were introduced.

**Quality gate:** `npm run lint` · `npm run typecheck` · `npm run build` — see [Verification](#verification) below.

---

## Improvements Delivered

### Accessibility

| Area | Change |
|------|--------|
| Skip links | Shared `SkipLink` component added to marketing, discover, host, user, and auth layouts |
| Mobile nav | Focus trap, Escape to close, `aria-controls`, `aria-expanded`, `role="dialog"` on mobile menu |
| Discover search | `role="search"`, `type="search"`, labeled inputs, filter panel `role="region"` |
| Skeletons | `aria-hidden` on decorative skeletons; `aria-busy` / `aria-live` on loading states |
| Reduced motion | `motion-safe:` variants on pulse, spin, and image hover transforms |
| Error pages | `role="alert"` on segment and global error UIs |

### Animations

- Aurora background already respects `useReducedMotion`; motion orbs disabled when reduced motion is preferred.
- Event card hover lift disabled when `useReducedMotion()` is true (existing).
- Skeleton pulse uses `motion-safe:animate-pulse` to avoid animation for users who prefer reduced motion.

### Skeletons & Loading UX

- Shared `RouteLoading` for discover, host, and user route groups.
- Marketing `loading.tsx` wrapped with `aria-busy` and screen-reader label.
- Discover initial load shows `EventGridSkeleton` with live region announcement.

### Performance

- Discover uses `useInfiniteQuery` — loads 12 events per page instead of a single large fetch.
- Intersection Observer sentinel triggers `fetchNextPage` with 200px root margin (prefetch before viewport).
- Debounced search (400ms) and debounced city filter reduce API churn.
- `next/image` AVIF/WebP formats enabled in `next.config.ts`.
- Event list/detail images use blur placeholders to reduce layout shift (CLS).

### SEO

| File | Purpose |
|------|---------|
| `src/app/sitemap.ts` | Static sitemap for public marketing/discover routes |
| `src/app/robots.ts` | Crawl rules; disallows authenticated areas |
| `src/app/opengraph-image.tsx` | Dynamic OG image (1200×630) |
| `src/lib/seo.ts` | `buildPageMetadata()` helper for canonical, OG, Twitter |
| Event `generateMetadata` | Server-fetches event by slug for real title/description/OG image |

Root layout metadata updated with default OG image reference.

### Image Optimization

- `IMAGE_BLUR_DATA_URL` shared placeholder for `next/image` `blurDataURL`.
- Applied on `EventCard` and event detail hero.
- Extended `remotePatterns` for CloudFront, Cloudinary, localhost dev.

### Infinite Scroll (Discover)

- `useInfiniteEvents` / `useInfiniteSearchEvents` in `useEvents.ts`.
- Pagination via API `meta.hasNextPage`, `totalPages`, or item-count fallback.
- "Loading more events…" indicator with `role="status"`.
- Result count: "N events shown — scroll for more".

### Error UX

| Route group | File |
|-------------|------|
| Marketing | `(marketing)/error.tsx` → `PageError` |
| Discover | `(discover)/error.tsx` → `PageError` |
| Host | `(host)/error.tsx` → `PageError` |
| User | `(user)/error.tsx` → `PageError` |
| Auth | `(auth)/error.tsx` → `PageError` (auth-specific copy) |
| Global | `global-error.tsx` — branded 500 with digest ref, try again + home |

### 404

- `not-found.tsx` — metadata (`noIndex`), skip link, gradient 404, home + discover CTAs.

### Search & Filters UX

- Debounced keyword search (no manual "Search" click required).
- Filter panel toggle with `aria-expanded` / `aria-controls`.
- Active filter badge count on Filters button.
- Clear filters action in toolbar and empty state.
- Debounced city input.

### Mobile Responsiveness

- Discover filter grid: `sm:grid-cols-2 lg:grid-cols-4`.
- Event grid: `sm:grid-cols-2 lg:grid-cols-3`.
- Error/404 CTAs stack on small screens (`flex-col sm:flex-row`).
- Mobile nav dialog with body scroll lock.

---

## New / Updated Files

```
src/
├── app/
│   ├── opengraph-image.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── not-found.tsx          (metadata + skip link)
│   ├── global-error.tsx       (polished 500)
│   ├── layout.tsx             (OG image refs)
│   ├── (discover|host|user)/
│   │   ├── error.tsx
│   │   └── loading.tsx
│   └── (auth)/error.tsx
├── components/
│   ├── feedback/page-error.tsx
│   ├── feedback/route-loading.tsx
│   └── layout/skip-link.tsx
├── hooks/
│   ├── useDebounce.ts
│   ├── useIntersection.ts
│   └── useEvents.ts           (+ infinite queries)
├── lib/
│   ├── image-placeholder.ts
│   ├── seo.ts
│   └── server-api.ts
└── features/discover/discover-page.tsx  (infinite scroll, filters)
```

---

## Lighthouse-Oriented Notes

Recommended audit targets (run locally against production build on port 3001):

```bash
npm run build && npm run start
# Chrome DevTools → Lighthouse (Mobile + Desktop)
```

| Category | Expected impact |
|----------|-----------------|
| **Performance** | AVIF/WebP, blur placeholders, infinite scroll (smaller initial payload), font `display: swap` |
| **Accessibility** | Skip links, dialog a11y, form labels, live regions, reduced motion |
| **Best Practices** | HTTPS images, no console errors in happy path |
| **SEO** | sitemap, robots, canonical URLs, OG/Twitter cards, event metadata |

**Manual follow-ups for higher scores:**

1. Add event slugs to `sitemap.ts` via server fetch when public list API is stable.
2. Self-host or preload critical fonts if LCP regresses.
3. Run Lighthouse on `/discover`, `/event/[slug]`, and `/` after deploy with real `NEXT_PUBLIC_APP_URL`.

---

## Verification

```bash
cd frontend-web
npm run lint       # ✓ pass (0 errors)
npm run typecheck  # ✓ pass
npm run build      # ✓ pass — 39 routes (incl. sitemap.xml, robots.txt, opengraph-image)
```

Build completed successfully on Next.js 15.5.19.

---

## Out of Scope (unchanged)

- No new backend endpoints (reviews write, save/unsave events remain API gaps from Phase 4).
- No Lighthouse CI automation added (manual audit recommended).
- `gsap` remains in `package.json` but unused — safe to remove in a future cleanup PR.

---

## Route Count

39 App Router entries in production build (34 user-facing pages + `sitemap.xml`, `robots.txt`, `opengraph-image`, `_not-found`). Polish is additive UX/infra on existing flows.
