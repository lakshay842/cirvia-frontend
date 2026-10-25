import type { AuthUser } from "@/types/auth.types";
import type { FullUser } from "@/types/user.types";

export function fullUserToAuthUser(full: FullUser, existing: AuthUser | null): AuthUser {
  return {
    id: full.id,
    email: full.email,
    phone: full.phone,
    emailVerified: full.emailVerified,
    phoneVerified: full.phoneVerified,
    accountStatus: existing?.accountStatus ?? "ACTIVE",
    provider: full.provider,
    roles: full.roles,
    profile: full.profile
      ? {
          firstName: full.profile.firstName,
          lastName: full.profile.lastName,
          username: full.profile.username,
          profileImage: full.profile.profileImage,
          city: full.profile.city,
          trustScore: full.profile.trustScore,
        }
      : null,
  };
}
