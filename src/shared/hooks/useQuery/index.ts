import {
  type QueryKey,
  useMutation as useTanStackMutation,
  type UseMutationOptions,
  useQuery as useTanStackQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';

import type { HttpResponse } from '@/shared/types';

export const useQuery = <TData = unknown, TError = Error>(
  queryKey: QueryKey,
  queryFn: () => Promise<HttpResponse<TData>>,
  options?: Omit<
    UseQueryOptions<HttpResponse<TData>, TError, TData>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useTanStackQuery({
    queryKey,
    queryFn,
    select: (data: HttpResponse<TData>) => {
      return data && 'data' in data ? data.data : null;
    },
    ...options,
  });
};

export const useMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = Error,
>(
  mutationFn: (variables: TVariables) => Promise<HttpResponse<TData>>,
  options?: Omit<
    UseMutationOptions<HttpResponse<TData>, TError, TVariables>,
    'mutationFn'
  >,
) => {
  return useTanStackMutation({
    mutationFn,
    ...options,
  });
};

export { useQueryClient };
