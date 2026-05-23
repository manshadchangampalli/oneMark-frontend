import { useQuery } from '@tanstack/react-query';
import { bookmarksApi } from '@/api/bookmarks.api';

export function useBookmarksFirstPage(limit = 20) {
  return useQuery({
    queryKey: ['bookmarks', 'first', { limit }],
    queryFn:  () => bookmarksApi.list({ limit }),
    staleTime: 30 * 1000,
  });
}

/** Imperative loader for cursor-based "Load more". */
export function loadMoreBookmarks(limit: number, cursor: string) {
  return bookmarksApi.list({ limit, cursor });
}
