import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { categoryService } from "@/services/event.service";

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories.all,
    queryFn: async () => {
      const response = await categoryService.getAll();
      return response.data.categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategory(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.categories.detail(slug),
    queryFn: async () => {
      const response = await categoryService.getBySlug(slug);
      return response.data.category;
    },
    enabled: Boolean(slug),
  });
}
