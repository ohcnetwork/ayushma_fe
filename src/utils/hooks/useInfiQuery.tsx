import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiQuery = (
  name: string[],
  fetchApi: ({ pageParam }: { pageParam?: number | undefined }) => Promise<any>,
  options: any = {},
) => {
  const query = useInfiniteQuery(name, fetchApi, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.has_next ? pages.length + 1 : undefined;
    },
    ...options,
  });

  const loadMore = () => {
    if (query.hasNextPage) query.fetchNextPage();
  };
  return { ...query, loadMore };
};
