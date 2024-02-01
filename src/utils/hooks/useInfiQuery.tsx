import { UseInfiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";

export type InfiQueryProps = {
  queryKey: string[],
  queryFn: (o: { pageParam?: number }) => Promise<any>,
  fetchLimit?: number,
} & Omit<UseInfiniteQueryOptions, 'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'>;

export type InfiQueryResult<T> = ReturnType<typeof useInfiniteQuery<any>> & {
  loadMore: () => void,
  fullData: T[],
}

export const useInfiQuery: (options: InfiQueryProps) => InfiQueryResult<any> = (options: InfiQueryProps) => {

  const { fetchLimit, queryFn, queryKey, ...otherOptions } = options;

  const query = (useInfiniteQuery as any)({
    ...otherOptions,
    queryKey,
    queryFn,
    initialPageParam: 0,
    getNextPageParam: (lastPage: any) => lastPage.has_next ? (lastPage.offset ?? 0) + (fetchLimit ?? 10) : undefined,
  });

  const loadMore = () => {
    if (query.hasNextPage) query.fetchNextPage();
  }

  const fullData = query.data?.pages.map((page: any) => page.results).flat();

  return { ...query, loadMore, fullData }
}