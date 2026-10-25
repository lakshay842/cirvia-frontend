import type { Metadata } from "next";
import { ProfilePage } from "@/features/profile/profile-page";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfileRoutePage() {
  return <ProfilePage />;
}
