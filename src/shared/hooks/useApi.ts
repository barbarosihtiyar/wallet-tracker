import {
  useMutation as useTanstackMutation,
  type UseMutationOptions,
  useQuery,
  type QueryFunctionContext,
  type QueryKey,
  type UseQueryOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { notifyError } from "@/shared/lib/errorHandler";
import type { ApiResponse } from "@/shared/types/HttpTypes";

type QueryFn<TData> = (
  context: QueryFunctionContext,
) => Promise<ApiResponse<TData>>;

type ApiQueryOptions<TData> = Omit<
  UseQueryOptions<ApiResponse<TData>, Error, TData, QueryKey>,
  "queryKey" | "queryFn"
> & {
  onErrorMessageKey?: string;
  onError?: (err: Error) => void;
};

export const useApiQuery = <TData>(
  queryKey: QueryKey,
  queryFn: QueryFn<TData>,
  options?: ApiQueryOptions<TData>,
) => {
  const onErrorMessageKey = options?.onErrorMessageKey ?? "general.error.desc";

  const queryOptions: UseQueryOptions<
    ApiResponse<TData>,
    Error,
    TData,
    QueryKey
  > = {
    queryKey,
    queryFn: async (context) => {
      const response = await queryFn(context);
      return response;
    },
    select: (response) => response.data as TData,
    retry: options?.retry ?? 2,
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
    onError: (error: Error) => {
      notifyError(error, "general.error.title", onErrorMessageKey);
      options?.onError?.(error);
    },
    ...options,
  };

  return useQuery(queryOptions);
};

type ApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<ApiResponse<TData>, Error, TVariables>,
  "mutationFn"
> & { onErrorMessageKey?: string };

export const useApiMutation = <TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: ApiMutationOptions<TData, TVariables>,
) => {
  const { onErrorMessageKey = "general.error.desc", ...rest } = options ?? {};

  return useTanstackMutation<ApiResponse<TData>, Error, TVariables>({
    mutationFn,
    retry: rest.retry ?? 1,
    onError: (error: Error) => {
      notifyError(error, "general.error.title", onErrorMessageKey);
      rest.onError?.(error);
    },
    ...rest,
  });
};

export { useQueryClient };
