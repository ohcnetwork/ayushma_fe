import { UseInfiniteQueryOptions, UseInfiniteQueryResult, useInfiniteQuery } from "@tanstack/react-query";

export type InfiQueryProps<T> = {
  queryFn: (o: { pageParam?: number }) => Promise<T>,
  fetchLimit?: number,
} & Omit<UseInfiniteQueryOptions<T>, 'queryFn' | 'initialPageParam' | 'getNextPageParam'>;

export type InfiQueryResult<T> = UseInfiniteQueryResult<T> & {
  loadMore: () => void,
  fullData: T[] | undefined,
}

export type Page<T> = {
  results: T[],
  has_next: boolean,
  has_previous: boolean,
  offset: number,
}

export function useInfiQuery<T>(options: InfiQueryProps<Page<T>>): InfiQueryResult<Page<T>> {

  const { fetchLimit, queryFn, ...otherOptions } = options;

  const query = useInfiniteQuery<Page<T>>({
    queryKey: ["s"],
    queryFn: ({ pageParam }) => queryFn,

  });

  const loadMore = () => {
    if (query.hasNextPage) query.fetchNextPage();
  }

  const fullData = query.data?.pages.map((page) => page.results).flat();

  return { ...query, loadMore, fullData }
}