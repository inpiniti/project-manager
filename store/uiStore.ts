import { create } from 'zustand';
import { CategoryType } from '@/lib/types';

interface UiStore {
    // 선택된 카테고리
    selectedCategory: CategoryType | null;

    // 선택된 아이템 ID
    selectedItemId: string | null;

    // 폼 상태
    isFormOpen: boolean;
    formMode: 'create' | 'edit';

    // 사이드바 상태 (모바일)
    isSidebarOpen: boolean;

    // Actions
    setSelectedCategory: (category: CategoryType | null) => void;
    setSelectedItemId: (id: string | null) => void;
    openForm: (mode: 'create' | 'edit') => void;
    closeForm: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    selectedCategory: null,
    selectedItemId: null,
    isFormOpen: false,
    formMode: 'create',
    isSidebarOpen: false,

    setSelectedCategory: (category) =>
        set({ selectedCategory: category, selectedItemId: null }),

    setSelectedItemId: (id) =>
        set({ selectedItemId: id }),

    openForm: (mode) =>
        set({ isFormOpen: true, formMode: mode }),

    closeForm: () =>
        set({ isFormOpen: false }),

    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen) =>
        set({ isSidebarOpen: isOpen }),
}));
