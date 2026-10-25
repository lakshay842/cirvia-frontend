# COMPONENT_LIBRARY.md

# Cirvia Component Library v1.0

## Philosophy

Every component must be:

* Reusable
* Accessible
* Animated
* Responsive
* Theme-aware
* Type-safe
* Production-ready

Never create duplicate components.

Every component must support:

* Dark Mode
* Light Mode
* Loading State
* Disabled State
* Error State
* Success State

---

# Folder Structure

```
components/

core/
layout/
navigation/
forms/
cards/
modals/
feedback/
data-display/
dashboard/
profile/
event/
host/
admin/
animations/
shared/
```

---

# Core Components

## Button

Variants

* Primary
* Secondary
* Outline
* Ghost
* Danger
* Success
* Gradient
* Icon
* Link

States

* Default
* Hover
* Active
* Disabled
* Loading

Features

* Ripple Effect
* Magnetic Hover
* Icon Support
* Loading Spinner
* Left Icon
* Right Icon
* Full Width

---

## Icon Button

Rounded

Hover Glow

Tooltip Support

Keyboard Accessible

---

## Input

Types

* Text
* Email
* Password
* Phone
* Number
* Search

Features

* Floating Label
* Validation
* Password Toggle
* Prefix
* Suffix
* Clear Button

---

## Textarea

Auto Resize

Character Counter

Validation

---

## Select

Searchable

Grouped Options

Keyboard Navigation

Async Support

---

## Multi Select

Search

Tags

Remove Animation

---

## Checkbox

Animated Check

Indeterminate State

---

## Radio Group

Keyboard Accessible

Animated Selection

---

## Toggle Switch

Spring Animation

Accessible

---

## Slider

Animated Thumb

Tooltip

---

# Navigation

## Navbar

Transparent

Blur on Scroll

Sticky

Mega Menu

Animated Underline

CTA Button

Profile Menu

Notifications

---

## Sidebar

Collapsible

Icons

Badges

Active Indicator

Nested Navigation

---

## Mobile Bottom Navigation

Home

Discover

Create

Bookings

Profile

Animated Active State

---

## Breadcrumb

Responsive

Overflow Handling

---

# Cards

## Event Card

Cover Image

Category Badge

Host Avatar

Trust Score

Rating

Price

Location

Date

Join Button

Hover Lift

---

## Host Card

Avatar

Verified Badge

Rating

Events Hosted

Followers

Message Button

---

## User Card

Avatar

Verification

Bio

Trust Score

Mutual Connections

---

## Statistics Card

Icon

Animated Number

Trend

Mini Chart

---

## Review Card

Stars

Comment

User

Date

Verified Badge

---

# Forms

## Login Form

Email

Password

Google Login

OTP Login

Forgot Password

Validation

---

## Signup Form

Personal Details

Terms

OTP Verification

---

## KYC Form

Government ID Upload

Selfie Upload

Preview

Progress

Status

---

## Create Event Form

Basic Info

Media Upload

Location

Capacity

Pricing

Preview

Publish

Draft

---

# Event Components

## Event Gallery

Grid

Carousel

Lightbox

Zoom

---

## Event Timeline

Registration

Approval

Booking

Check-in

Completed

---

## Event Schedule

Agenda

Timeline

Sessions

---

## Guest List

Avatar Stack

Verified Badge

Search

Invite

---

## Ticket Card

QR Code

Booking ID

Event Info

Check-in Status

---

# Profile Components

## Profile Header

Cover

Avatar

Verification Badge

Trust Score

Stats

Actions

---

## Trust Score Widget

Circular Progress

Explanation

Level

History

---

## Activity Feed

Timeline

Likes

Comments

Event Actions

---

# Dashboard Components

## Analytics Card

Icon

Animated Counter

Trend

Tooltip

---

## Revenue Chart

Daily

Weekly

Monthly

Yearly

---

## User Table

Search

Filter

Pagination

Bulk Actions

Export

---

## Moderation Queue

Approve

Reject

View Documents

Notes

---

# Feedback Components

## Toast

Success

Error

Warning

Info

Action Button

---

## Alert Banner

Closable

Persistent

---

## Empty State

Illustration

Title

Description

CTA

---

## Error State

Retry

Support Link

---

## Loading

Skeleton

Progress

Pulse

Shimmer

---

# Modal Components

## Dialog

Confirmation

Delete

Warning

Success

---

## Drawer

Right

Left

Bottom

Responsive

---

## Bottom Sheet

Mobile Optimized

Gesture Support

---

# Search Components

## Global Search

Command Palette

Recent Searches

Popular Categories

Keyboard Shortcut

---

## Filters

Price

Distance

Date

Category

Host Rating

Availability

---

# Notification Components

## Notification Bell

Unread Count

Dropdown

Mark All Read

---

## Notification Item

Avatar

Message

Time

Action

---

# Media Components

## Image

Lazy Loading

Blur Placeholder

Fallback

---

## Avatar

Status

Verification Badge

Online Indicator

---

## Video Player

Adaptive

Fullscreen

Thumbnail

---

# Maps

## Interactive Map

Markers

Directions

Radius

Cluster

---

# Animations

## Fade In

## Slide Up

## Scale

## Rotate

## Stagger Children

## Floating

## Pulse

## Glow

## Count Up

Use Framer Motion for UI transitions.

Use GSAP only for complex page interactions.

---

# Theme Support

Every component must support:

* Light Theme
* Dark Theme
* System Theme

No hardcoded colors.

Use design tokens only.

---

# Accessibility

All components must include:

* Keyboard Navigation
* ARIA Labels
* Focus States
* Screen Reader Support
* High Contrast Support
* Reduced Motion Support

---

# Coding Standards

* Strict TypeScript
* No `any`
* Reusable Props
* Forward Refs where needed
* Memoize expensive components
* Lazy load heavy components
* No duplicated logic
* Composition over inheritance

---

# Component Naming

Examples

```
Button.tsx
EventCard.tsx
HostCard.tsx
ProfileHeader.tsx
AnalyticsCard.tsx
NotificationBell.tsx
TrustScore.tsx
CreateEventForm.tsx
UserTable.tsx
RevenueChart.tsx
```

---

# Future Components

* AI Recommendation Card
* Face Verification Status
* Live Event Status
* Real-time Chat Bubble
* Voice Room Card
* Community Badge
* Achievement Card
* Referral Widget
* Premium Membership Card

---

# Final Rule

Before creating a new component:

1. Check if an existing component can be reused.
2. Keep the API simple and consistent.
3. Follow the design tokens.
4. Add animations only where they improve UX.
5. Every component should look and feel like it belongs to the same premium product.
