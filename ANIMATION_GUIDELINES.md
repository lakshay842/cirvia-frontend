# ANIMATION_GUIDELINES.md

# Cirvia Motion Design System v1.0

---

# Motion Philosophy

Cirvia should feel alive.

Never flashy.

Never distracting.

Every animation must communicate:

* Feedback
* Hierarchy
* State Change
* Delight
* Confidence

The user should never think

"Nice animation"

Instead they should feel

"This app feels premium."

---

# Inspiration

Reference Only

Apple

Linear

Airbnb

Arc Browser

Spotify

Notion

Raycast

Vercel

Stripe

Motion.dev

---

# Animation Stack

Primary

Framer Motion

Secondary

GSAP

Optional

Lottie (only onboarding or illustrations)

Never animate using CSS when Framer Motion is better.

Never animate layout manually if Layout Animation is available.

---

# Animation Principles

Motion must be

Fast

Smooth

Predictable

Consistent

Purposeful

Natural

---

# Timing

Instant

100ms

Micro Interaction

150–200ms

Standard

250–350ms

Modal

300–450ms

Large Transition

500–700ms

Hero Animation

800–1200ms

Never exceed 1200ms.

---

# Easing

Default

easeOut

Content Reveal

easeInOut

Spring

Use natural spring.

Avoid bouncy cartoon effects.

---

# Global Page Transitions

Every page transition should include

Fade

Slight Scale

Slide

Shared Layout where applicable

Use route transitions.

No hard cuts.

---

# Loading Experience

Never display a blank screen.

Always show:

* Skeleton
* Placeholder
* Shimmer
* Progressive loading

Never rely only on spinners.

---

# Hero Section

Animated mesh gradient

Aurora background

Floating blurred circles

Headline reveal

Character-by-character or word-by-word

CTA fade + slide

Statistics count-up

Cards float gently

Subtle mouse parallax

Everything starts smoothly.

---

# Navbar

Transparent at top

Blur after scroll

Logo fade

Menu underline animation

Mobile drawer slide

Profile dropdown scale

Notification dropdown spring

---

# Buttons

Hover

Scale 1.03

Shadow increase

Gradient shift

Press

Scale 0.98

Loading

Spinner + label transition

Success

Check animation

Ripple

Optional

Never bounce.

---

# Cards

Hover Lift

Shadow Increase

Border Glow

Scale 1.01

Image Zoom

2–4%

Content Fade

Never rotate cards.

---

# Forms

Input Focus Glow

Floating Labels

Validation Shake (very subtle)

Success Icon Fade

Error Message Slide

Password Reveal Fade

Progressive Form Steps

---

# Authentication

Login card

Scale + Fade

OTP boxes

Auto-focus transition

Success

Screen transition

Error

Subtle shake

---

# Dashboard

Sidebar expand/collapse

Smooth width animation

Charts

Animated values

Cards

Count-up numbers

Recent Activity

Stagger reveal

Notifications

Slide from top

---

# Event Cards

Hover image zoom

Host avatar fade

Rating star glow

CTA slide in

Bookmark morph

Trust badge pulse

---

# Modals

Backdrop blur

Fade

Scale 0.95 → 1

Close animation

Reverse

ESC closes

Click outside closes

---

# Drawers

Slide from right

Overlay fade

Gesture-ready

Mobile optimized

---

# Lists

Use stagger animations

Never reveal everything simultaneously.

Cards

40ms stagger

Large lists

20ms stagger

---

# Tables

Row hover

Background fade

Filter panel slide

Pagination fade

Loading skeleton

---

# Charts

Animated line drawing

Bar grow

Pie reveal

Counter sync

Tooltip fade

---

# Empty States

Illustration fade

CTA slide

Floating illustration

Never static.

---

# Toast

Slide from bottom-right

Fade

Auto dismiss

Progress indicator

Action button

---

# Notifications

Bell bounce (subtle)

Unread badge pulse

Dropdown fade

Item hover

---

# Profile

Avatar reveal

Cover image parallax

Trust score animation

Achievements stagger

Followers count

Animated

---

# Trust Score

Circular progress

Animated from 0

Color transition

Tooltip

History chart

---

# Maps

Marker drop

Cluster expand

Selected marker bounce (small)

Route draw

Location pulse

---

# Gallery

Image fade

Lightbox zoom

Carousel slide

Thumbnail animation

---

# Scroll Animations

Use GSAP

Reveal sections

Fade Up

Slide

Scale

Pinning (only for storytelling)

Horizontal Scroll (only when useful)

Parallax

Never overuse.

---

# Cursor Effects

Desktop only

Soft glow

Follower

Magnetic buttons

Interactive cards

Disable on mobile.

---

# Background Motion

Aurora

Gradient Mesh

Floating Blobs

Noise Texture

Stars (very subtle)

Do not create distracting backgrounds.

---

# Statistics

Count-up

Progress bars

Circular charts

Animated badges

---

# Skeleton Loading

Card Skeleton

Avatar Skeleton

Text Skeleton

Chart Skeleton

List Skeleton

Grid Skeleton

Always match the final layout.

---

# Micro Interactions

Like

Heart burst

Bookmark

Morph

Copy

Toast

Delete

Confirmation

Save

Check animation

Expand

Smooth

Collapse

Smooth

Tabs

Animated underline

Accordion

Height animation

---

# Gesture Support

Swipe Cards (mobile)

Pull to Refresh

Long Press

Drag Sheet

Bottom Drawer

---

# Reduced Motion

Respect user's OS preference.

Disable

Parallax

Floating objects

Large transitions

Keep

Fade

Essential feedback

---

# Performance Rules

Do not animate expensive DOM trees.

Animate transform.

Animate opacity.

Avoid layout thrashing.

Lazy-load heavy animations.

Use will-change only when necessary.

Keep 60 FPS.

---

# Motion Checklist

Before adding animation ask:

* Does it improve clarity?
* Does it improve usability?
* Is it performant?
* Is it accessible?
* Is it consistent with the design system?
* Does it work on mobile?
* Does it respect reduced-motion settings?

If the answer is "no", don't animate it.

---

# Library Usage Rules

Use Framer Motion for:

* Components
* Buttons
* Cards
* Modals
* Lists
* Page transitions
* Layout animations
* Hover states

Use GSAP for:

* Landing page storytelling
* Scroll-triggered sections
* Hero reveals
* Parallax
* Pinned sections
* Horizontal scrolling
* Complex timelines

Do not mix Framer Motion and GSAP on the same element unless absolutely necessary.

---

# Premium Signature Effects

Cirvia should include these signature experiences:

* Aurora animated hero background
* Floating glass cards
* Smooth route transitions
* Animated trust score ring
* Count-up statistics
* Glass navigation with blur-on-scroll
* Animated event cards
* Elegant onboarding flow
* Subtle magnetic CTA buttons
* Premium loading skeletons
* Interactive dashboard widgets
* Soft cursor glow (desktop)
* Beautiful empty states
* Animated QR ticket reveal
* Celebration animation after successful booking

---

# Final Motion Rule

Motion is part of the product's identity.

If an animation makes the interface slower, distracting, or confusing, remove it.

Every animation should make Cirvia feel like a premium, trustworthy, world-class product.
