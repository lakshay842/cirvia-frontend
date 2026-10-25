export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-cirvia",
    question: "What is Cirvia?",
    answer:
      "Cirvia is a premium verified social discovery platform where people create and join real-world gatherings. It's designed for meaningful offline connections — not dating, not partying.",
  },
  {
    id: "verification",
    question: "How does verification work?",
    answer:
      "Members verify their identity with government ID and a selfie. Verified users receive a trust badge that helps hosts and guests feel confident about who they're meeting.",
  },
  {
    id: "host-event",
    question: "How do I host an event?",
    answer:
      "Apply to become a host, complete your profile verification, and create your first gathering. Our team reviews events to maintain quality and safety standards.",
  },
  {
    id: "safety",
    question: "Is Cirvia safe?",
    answer:
      "Safety is our foundation. Verified identities, trust scores, host ratings, reporting tools, and community guidelines work together to keep every gathering secure.",
  },
  {
    id: "pricing",
    question: "Is Cirvia free to use?",
    answer:
      "Browsing and joining free events is free. Some hosted experiences may have a ticket price set by the host. Premium features will be introduced in future releases.",
  },
  {
    id: "cities",
    question: "Which cities is Cirvia available in?",
    answer:
      "We're launching in major Indian metros first — Bangalore, Mumbai, Delhi NCR, Hyderabad, and Pune — with more cities coming soon.",
  },
];
