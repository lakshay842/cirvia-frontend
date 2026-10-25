import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { SITE } from "@/constants/site";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api.types";
import { ApiClientError } from "@/types/api.types";
import type { RefreshResponse } from "@/types/auth.types";

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  refreshQueue = [];
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: SITE.apiUrl,
    headers: { "Content-Type": "application/json" },
    timeout: 20000,
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;

      if (status === 401 && original && !original._retry && !original.url?.includes("/auth/")) {
        original._retry = true;
        const refreshToken = useAuthStore.getState().refreshToken;

        if (!refreshToken) {
          useAuthStore.getState().clearAuth();
        } else if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { data } = await axios.post<ApiSuccessResponse<RefreshResponse>>(
              `${SITE.apiUrl}/auth/refresh`,
              { refreshToken },
            );
            const tokens = data.data;
            useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
            processQueue(null, tokens.accessToken);
            if (original.headers) {
              original.headers.Authorization = `Bearer ${tokens.accessToken}`;
            }
            return client(original);
          } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearAuth();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          return new Promise((resolve, reject) => {
            refreshQueue.push({
              resolve: (token: string) => {
                if (original.headers) original.headers.Authorization = `Bearer ${token}`;
                resolve(client(original));
              },
              reject,
            });
          });
        }
      }

      const data = error.response?.data;
      const message = data?.message ?? error.message ?? "Request failed";
      const code = data?.error?.code ?? "NETWORK_ERROR";
      const field = data?.error?.field;
      const fieldErrors = data?.error?.errors ?? [];
      throw new ApiClientError(message, code, error.response?.status, field, fieldErrors);
    },
  );

  return client;
}

export const apiClient = createApiClient();

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<ApiSuccessResponse<T>> {
  const { data } = await apiClient.get<ApiSuccessResponse<T>>(url, { params });
  return data;
}

export async function post<T>(url: string, body?: unknown): Promise<ApiSuccessResponse<T>> {
  const { data } = await apiClient.post<ApiSuccessResponse<T>>(url, body);
  return data;
}

export async function patch<T>(url: string, body?: unknown): Promise<ApiSuccessResponse<T>> {
  const { data } = await apiClient.patch<ApiSuccessResponse<T>>(url, body);
  return data;
}

export async function del<T>(url: string): Promise<ApiSuccessResponse<T>> {
  const { data } = await apiClient.delete<ApiSuccessResponse<T>>(url);
  return data;
}

export async function postForm<T>(url: string, formData: FormData): Promise<ApiSuccessResponse<T>> {
  const { data } = await apiClient.post<ApiSuccessResponse<T>>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
