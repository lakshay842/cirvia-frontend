# CODING_STANDARDS.md

# Cirvia Engineering Standards v1.0

## Purpose

These rules apply to the entire Cirvia project.

Every generated file must follow these standards.

Quality is more important than speed.

Never sacrifice maintainability for convenience.

---

# Core Principles

* Write production-ready code.
* Prefer readability over cleverness.
* Keep modules small and focused.
* Make components reusable.
* Keep business logic outside UI.
* Build for long-term maintenance.
* Every feature should be testable.
* Every feature should be replaceable.

---

# Tech Stack

Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS v4
* Shadcn UI
* Framer Motion
* GSAP
* TanStack Query
* React Hook Form
* Zod

Backend

* Node.js
* Express
* TypeScript
* Prisma
* PostgreSQL
* Redis

---

# TypeScript Rules

* Enable strict mode.
* Never use `any`.
* Prefer `unknown` when appropriate.
* Define interfaces/types for all API contracts.
* Use enums only for stable domain values.
* Use type aliases for reusable structures.
* Export shared types from a central package.
* Never ignore TypeScript errors.

---

# Folder Structure

Feature-first architecture.

```text
src/
  app/
  features/
  components/
  hooks/
  services/
  lib/
  utils/
  types/
  providers/
  contexts/
  constants/
  styles/
```

Keep feature code together.

Avoid unrelated utilities inside feature folders.

---

# Component Rules

* One responsibility per component.
* Reuse before creating new components.
* Accept props, not hardcoded values.
* Keep components small.
* Split large components into smaller pieces.
* Memoize only when it provides measurable value.
* Avoid deeply nested JSX.

---

# React Rules

* Prefer Server Components by default.
* Use Client Components only when needed.
* Avoid unnecessary `useEffect`.
* Keep state as local as possible.
* Lift state only when required.
* Prefer composition over inheritance.
* Avoid prop drilling; use context or dedicated state management when appropriate.

---

# State Management

* Server state → TanStack Query.
* Local UI state → React state.
* Global UI state → Zustand (if required).
* Forms → React Hook Form.

Never duplicate server state locally.

---

# API Layer

* Never call `fetch` directly inside UI components.
* Use a dedicated service layer.
* Centralize API configuration.
* Handle errors consistently.
* Use typed request and response models.

---

# Validation

* Validate all forms with Zod.
* Validate API responses where practical.
* Never trust client-side input.
* Display user-friendly error messages.

---

# Naming Conventions

Components

```text
EventCard.tsx
HostCard.tsx
ProfileHeader.tsx
```

Hooks

```text
useAuth.ts
useEvents.ts
```

Services

```text
event.service.ts
auth.service.ts
```

Utilities

```text
formatDate.ts
calculateTrustScore.ts
```

Constants

```text
routes.ts
theme.ts
roles.ts
```

Types

```text
event.types.ts
user.types.ts
```

Use PascalCase for components.

Use camelCase for functions and variables.

Use kebab-case for route segments.

---

# Imports

Order imports consistently:

1. React / framework
2. Third-party libraries
3. Internal aliases
4. Relative imports
5. Styles (if any)

Prefer path aliases over long relative paths.

---

# Styling Rules

* Tailwind CSS only.
* No inline styles unless dynamic and minimal.
* Use design tokens.
* Keep spacing consistent.
* Reuse utility classes through shared components where appropriate.
* Respect light and dark themes.

---

# Accessibility

Every interactive element must have:

* Keyboard support
* Visible focus state
* ARIA labels where needed
* Sufficient color contrast

Support reduced motion preferences.

---

# Animations

* Use Framer Motion for UI transitions.
* Use GSAP for advanced scroll interactions.
* Keep animations subtle.
* Avoid blocking user interaction.
* Respect reduced motion settings.

---

# Error Handling

Never fail silently.

Provide:

* User-friendly messages
* Retry option when appropriate
* Logging hooks for diagnostics
* Graceful fallback UI

---

# Logging

* Avoid `console.log` in production.
* Use structured logging where applicable.
* Log unexpected errors only.
* Never expose sensitive information.

---

# Security

Frontend

* Never store secrets.
* Avoid exposing internal identifiers unnecessarily.
* Sanitize user-generated content before rendering.
* Use HTTPS-only assumptions.

Backend (for shared understanding)

* Validate all requests.
* Verify authorization.
* Protect sensitive endpoints.

---

# Performance

* Lazy-load heavy components.
* Optimize images.
* Use code splitting.
* Avoid unnecessary re-renders.
* Debounce expensive searches.
* Virtualize large lists when needed.
* Keep Lighthouse score above 95 where practical.

---

# Forms

* React Hook Form + Zod.
* Inline validation.
* Accessible labels.
* Preserve user input when possible.
* Show loading and success states.

---

# Data Fetching

* Use TanStack Query.
* Define cache keys centrally.
* Handle loading, success and error states.
* Invalidate caches after mutations.

---

# Routing

* Use App Router.
* Prefer Server Components.
* Protect authenticated routes.
* Keep URLs readable.
* Use loading and error boundaries.

---

# Git Conventions

Branch examples:

```text
feature/create-event
feature/host-dashboard
fix/login-validation
refactor/profile-module
```

Commit examples:

```text
feat: add event creation flow
fix: resolve booking validation
refactor: simplify profile service
docs: update API contract
```

---

# Documentation

Every major feature should include:

* Purpose
* Data flow
* API usage
* Edge cases
* Future considerations

Keep README files updated.

---

# Code Review Checklist

Before considering a feature complete:

* No TypeScript errors.
* No ESLint errors.
* No duplicated logic.
* Reusable components used.
* Responsive layout verified.
* Accessibility checked.
* Loading and error states implemented.
* Theme support verified.
* Performance considered.
* Documentation updated.

---

# Future-Proofing

When adding a feature:

* Think about scalability.
* Keep APIs generic where reasonable.
* Avoid hardcoded business rules.
* Make extension easier than modification.

---

# Final Engineering Rules

* Write code for humans first.
* Optimize only after correctness.
* Prefer clarity over abstraction.
* Keep modules independent.
* Every screen should feel premium.
* Every component should be reusable.
* Every API should be typed.
* Every feature should be maintainable.
* Every decision should support a long-term product vision.

Cirvia should feel like a product built by a world-class engineering team, not a collection of disconnected screens.
