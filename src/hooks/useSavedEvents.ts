import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";

export function useSavedEvents() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: QUERY_KEYS.users.savedEvents,
    queryFn: async () => {
      const res = await userService.getSavedEvents({ limit: 50 });
      return res.data.events;
    },
    enabled: isAuthenticated,
  });
}
