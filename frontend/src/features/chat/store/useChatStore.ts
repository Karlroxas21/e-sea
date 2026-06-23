import { create } from "zustand";

interface ChatStore {
    isChatOpen: boolean;
    setIsChatOpen: (isChatOpen: boolean) => void;
    hasUnreadMessages: boolean;
    setHasUnreadMessages: (hasUnreadMessages: boolean) => void;
    reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    isChatOpen: false,
    setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
    hasUnreadMessages: false,
    setHasUnreadMessages: (hasUnreadMessages) => set({ hasUnreadMessages }),
    reset: () => set({ isChatOpen: false, hasUnreadMessages: false }),
}));