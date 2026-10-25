export interface UserProfile {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  bio: string | null;
  gender: string | null;
  dob: string | null;
  profileImage: string | null;
  coverImage: string | null;
  occupation: string | null;
  company: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  trustScore: number | null;
  followersCount: number;
  followingCount: number;
  eventsJoined: number;
  eventsHosted: number;
  averageRating: number | null;
}

export interface UserSocialLinks {
  instagram: string | null;
  linkedin: string | null;
  twitter: string | null;
  github: string | null;
  website: string | null;
}

export interface FullUser {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  provider: string;
  roles: string[];
  profile: UserProfile | null;
  interests: string[];
  socialLinks: UserSocialLinks | null;
}

export interface PublicUserProfile {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  profileImage: string | null;
  coverImage: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  trustScore: number | null;
  followersCount: number;
  followingCount: number;
  eventsJoined: number;
  eventsHosted: number;
  averageRating: number | null;
  interests: string[];
  isFollowing?: boolean;
}
