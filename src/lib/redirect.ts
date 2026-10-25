import { ROUTES } from "@/constants/routes";

export function getSafeRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return ROUTES.discover;
  }
  if (path.startsWith(ROUTES.login) || path.startsWith(ROUTES.register)) {
    return ROUTES.discover;
  }
  return path;
}
