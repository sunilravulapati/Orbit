import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      otherUsers: null,
      profile: null,
      onlineUsers: [],

      setUser: (user) => set({ user }),
      setOtherUsers: (otherUsers) => set({ otherUsers }),
      setProfile: (profile) => set({ profile }),
      setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

      updateUser: (updates) => set({
        user: { ...get().user, ...updates }
      }),

      followingUpdate: (id) => {
        const user = get().user;
        if (!user) return;
        const isFollowing = user.following?.some(
          (f) => (f.userId?._id ?? f.userId)?.toString() === id
        );
        set({
          user: {
            ...user,
            following: isFollowing
              ? user.following.filter(
                (f) => (f.userId?._id ?? f.userId)?.toString() !== id
              )
              : [...(user.following || []), { userId: id }],
          },
        });
      },
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;