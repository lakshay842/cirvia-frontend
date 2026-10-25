export interface AuthUserProfile {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImage: string | null;
  city: string | null;
  trustScore: number | null;
}

export interface AuthUser {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: string;
  provider: string;
  roles: string[];
  profile: AuthUserProfile | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export type RefreshResponse = AuthTokens;
