import { create } from "zustand";

interface ChatStore {
    isChatOpen: boolean;
    setIsChatOpen: (isChatOpen: boolean) => void;
    reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    isChatOpen: false,
    setIsChatOpen: (isChatOpen) => set({ isChatOpen }),
    reset: () => set({ isChatOpen: false }),
}));