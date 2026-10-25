import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { fullUserToAuthUser } from "@/lib/auth-user";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/stores/auth-store";

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: QUERY_KEYS.users.me,
    queryFn: async () => {
      const res = await userService.getMe();
      const full = res.data.user;
      const existing = useAuthStore.getState().user;
      if (existing) {
        setUser(fullUserToAuthUser(full, existing));
      }
      return full;
    },
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (body: Record<string, unknown>) => userService.updateProfile(body),
    onSuccess: (res) => {
      qc.setQueryData(QUERY_KEYS.users.me, res.data.user);
      const existing = useAuthStore.getState().user;
      if (existing) {
        setUser(fullUserToAuthUser(res.data.user, existing));
      }
    },
  });
}
