import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Required for cookies (refresh tokens)
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoints that must NEVER trigger refresh-on-401.
// Refreshing on these creates the "any email logs in" bug, because a stale
// refresh_token cookie would silently re-authenticate the previous user.
const AUTH_ENDPOINTS = ['/auth/login', '/auth/signup', '/auth/refresh', '/auth/logout'];

// Single-flight refresh so parallel 401s don't all hit /auth/refresh.
let refreshPromise: Promise<string> | null = null;
function doRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ accessToken: string }>(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => res.data.accessToken)
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = (originalRequest?.url ?? '') as string;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((p) => url.endsWith(p));
    const hasUser = !!useAuthStore.getState().accessToken;

    // Only attempt refresh if:
    //  1. it's a 401
    //  2. we haven't already retried this request
    //  3. the failing request isn't one of the auth endpoints
    //  4. we actually had a session to refresh (don't try on first-load 401s)
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint && hasUser) {
      originalRequest._retry = true;
      try {
        const accessToken = await doRefresh();
        // Refresh succeeded — keep current user object; it'll be re-fetched on
        // next page mount via the auth-store hydration path.
        const currentUser = useAuthStore.getState().user;
        if (currentUser) useAuthStore.getState().setAuth(currentUser, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
