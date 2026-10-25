export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarInitials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Product Designer, Bangalore",
    quote:
      "Cirvia helped me find a community of creatives in my city. Every meetup feels safe, curated, and genuinely welcoming.",
    avatarInitials: "PS",
  },
  {
    id: "2",
    name: "Arjun Mehta",
    role: "Startup Founder, Mumbai",
    quote:
      "As a host, I love how verification builds trust upfront. My networking events have grown into a loyal community.",
    avatarInitials: "AM",
  },
  {
    id: "3",
    name: "Sneha Reddy",
    role: "Software Engineer, Hyderabad",
    quote:
      "Finally a platform that isn't about dating or parties. Real people, real gatherings, real connections.",
    avatarInitials: "SR",
  },
  {
    id: "4",
    name: "Rahul Kapoor",
    role: "Photography Enthusiast, Delhi",
    quote:
      "The trust score and host ratings make it easy to pick experiences. I've attended five events and each one exceeded expectations.",
    avatarInitials: "RK",
  },
];
