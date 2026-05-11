import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useTweetStore = create(
  persist(
    (set, get) => ({
      tweets: null,
      bookmarks: [],
      refresh: false,
      isActive: true,

      setAllTweets: (tweets) => set({ tweets }),

      toggleBookmark: (tweet) => {
        const { bookmarks } = get();
        const isBookmarked = bookmarks.some((b) => b._id === tweet._id);
        if (isBookmarked) {
          set({ bookmarks: bookmarks.filter((b) => b._id !== tweet._id) });
          toast.success("Removed from bookmarks");
        } else {
          set({ bookmarks: [...bookmarks, tweet] });
          toast.success("Saved to bookmarks");
        }
      },

      addNewPost: (post) =>
        set((state) => ({
          tweets: [post, ...(state.tweets || [])]  // prepend to feed
        })),

      toggleRefresh: () => set({ refresh: !get().refresh }),
      setIsActive: (isActive) => set({ isActive }),
      composerFocus: false,
      setComposerFocus: (value) => set({ composerFocus: value }),
      openComposer: () => set({ composerFocus: true }),
      clearComposerFocus: () => set({ composerFocus: false }),
    }),
    { name: 'tweet-storage' }
  )
);

export default useTweetStore;