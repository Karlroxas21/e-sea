import { create } from 'zustand';

interface AssignmentStore {
    isAddingAssignment: boolean;
    setIsAddingAssignment: (isAdding: boolean) => void;
    reset: () => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
    isAddingAssignment: false,
    setIsAddingAssignment: (isAdding) => set({ isAddingAssignment: isAdding }),
    reset: () => set({ isAddingAssignment: false }),
}));
