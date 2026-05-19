import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';

export function useSignup() {
  return useMutation({
    mutationFn: authApi.signup,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: logout,
  });
}

export function useGetMe(token?: string) {
  return useQuery({
    queryKey: ['me', token],
    queryFn: () => authApi.getMe(token),
    enabled: !!token,
    retry: false,
  });
}
