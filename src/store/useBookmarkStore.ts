import { create } from 'zustand';
import { bookmarksApi } from '@/api/bookmarks.api';

interface BookmarkState {
  ids: Set<string>;
  isLoaded: boolean;
  isLoading: boolean;

  /** Fetch the user's bookmarked question ids once, after login. */
  load: () => Promise<void>;
  /** Optimistically toggle. Reverts on API error. */
  toggle: (questionId: string) => Promise<boolean>;
  /** Clear on logout. */
  reset: () => void;
  /** Pure check — useful in components. */
  has: (questionId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  ids: new Set<string>(),
  isLoaded:  false,
  isLoading: false,

  load: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const ids = await bookmarksApi.listIds();
      set({ ids: new Set(ids), isLoaded: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggle: async (questionId: string) => {
    const wasBookmarked = get().ids.has(questionId);
    const next = new Set(get().ids);
    if (wasBookmarked) next.delete(questionId);
    else                next.add(questionId);
    set({ ids: next }); // optimistic

    try {
      if (wasBookmarked) await bookmarksApi.remove(questionId);
      else               await bookmarksApi.add(questionId);
      return !wasBookmarked;
    } catch (err) {
      // revert
      const reverted = new Set(get().ids);
      if (wasBookmarked) reverted.add(questionId);
      else                reverted.delete(questionId);
      set({ ids: reverted });
      throw err;
    }
  },

  reset: () => set({ ids: new Set(), isLoaded: false, isLoading: false }),

  has: (questionId: string) => get().ids.has(questionId),
}));
