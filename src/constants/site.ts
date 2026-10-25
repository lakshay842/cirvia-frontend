export const SITE = {
  name: "Cirvia",
  tagline: "Find Your People. Build Real Connections.",
  description:
    "Cirvia is a premium verified social discovery platform. Create real-world gatherings and safely join verified communities.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1",
  razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? "",
} as const;

export const BRAND_STATS = [
  {
    label: "Verified Members",
    value: 12000,
    suffix: "+",
    icon: "users",
    color: "primary",
  },
  {
    label: "Verified Hosts",
    value: 850,
    suffix: "+",
    icon: "badge-check",
    color: "success",
  },
  {
    label: "Successful Gatherings",
    value: 4200,
    suffix: "+",
    icon: "calendar",
    color: "warning",
  },
] as const;

export const HERO_TRUST_ITEMS = [
  { label: "Verified Members", icon: "badge-check" },
  { label: "Safe & Secure", icon: "shield" },
  { label: "Real Connections", icon: "heart" },
] as const;

export const WHY_CIRVIA = [
  {
    title: "Verified Community",
    description:
      "Every member and host is background verified for your safety.",
    icon: "users",
    tone: "primary",
  },
  {
    title: "Safe & Secure",
    description: "Advanced safety measures and privacy protection.",
    icon: "shield-check",
    tone: "success",
  },
  {
    title: "Quality Events",
    description: "Curated events and genuine connections.",
    icon: "sparkles",
    tone: "accent",
  },
  {
    title: "Easy Booking",
    description: "Simple, secure booking process with instant confirmation.",
    icon: "zap",
    tone: "info",
  },
] as const;

export const APP_LINKS = {
  ios: "#",
  android: "#",
} as const;

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com/cirvia",
  instagram: "https://instagram.com/cirvia",
  linkedin: "https://linkedin.com/company/cirvia",
} as const;
