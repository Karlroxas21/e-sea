import { create } from "zustand";

interface ChatStore {
    isChatOpen: boolean;
    setIsChatOpen: (isChatOpen: boolean) => void;
    hasUnreadMessages: boolean;
    unreadCounts: Record<string, number>;
    setUnreadCounts: (unreadCounts: Record<string, number>) => void;
    incrementUnreadCount: (userId: string) => void;
    clearUnreadCount: (userId: string) => void;
    reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    isChatOpen: false,
    setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
    hasUnreadMessages: false,
    unreadCounts: {},
    setUnreadCounts: (unreadCounts) => set({
        unreadCounts,
        hasUnreadMessages: Object.values(unreadCounts).some(count => count > 0)
    }),
    incrementUnreadCount: (userId) => set((state) => {
        const key = userId.toLowerCase();
        const currentCount = state.unreadCounts[key] || 0;
        const newUnreadCounts = {
            ...state.unreadCounts,
            [key]: currentCount + 1
        };
        return {
            unreadCounts: newUnreadCounts,
            hasUnreadMessages: true
        };
    }),
    clearUnreadCount: (userId) => set((state) => {
        const key = userId.toLowerCase();
        if (state.unreadCounts[key] === undefined) return {};
        const newUnreadCounts = { ...state.unreadCounts };
        delete newUnreadCounts[key];
        return {
            unreadCounts: newUnreadCounts,
            hasUnreadMessages: Object.values(newUnreadCounts).some(count => count > 0)
        };
    }),
    reset: () => set({ isChatOpen: false, hasUnreadMessages: false, unreadCounts: {} }),
}));