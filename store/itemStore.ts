import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CategoryType, AnyItem } from '@/lib/types';

interface ItemStore {
    // 카테고리별 아이템 저장
    items: Record<CategoryType, AnyItem[]>;

    // Actions
    addItem: (category: CategoryType, item: AnyItem) => void;
    updateItem: (category: CategoryType, id: string, item: Partial<AnyItem>) => void;
    deleteItem: (category: CategoryType, id: string) => void;
    getItemsByCategory: (category: CategoryType) => AnyItem[];
    getItemById: (category: CategoryType, id: string) => AnyItem | undefined;
}

export const useItemStore = create<ItemStore>()(
    persist(
        (set, get) => ({
            items: {
                screen: [],
                api: [],
                db: [],
                sql: [],
                hook: [],
                query: [],
                store: [],
                util: [],
            },

            addItem: (category, item) =>
                set((state) => ({
                    items: {
                        ...state.items,
                        [category]: [...state.items[category], item],
                    },
                })),

            updateItem: (category, id, updatedItem) =>
                set((state) => ({
                    items: {
                        ...state.items,
                        [category]: state.items[category].map((item) =>
                            item.id === id ? { ...item, ...updatedItem } : item
                        ),
                    },
                })),

            deleteItem: (category, id) =>
                set((state) => ({
                    items: {
                        ...state.items,
                        [category]: state.items[category].filter((item) => item.id !== id),
                    },
                })),

            getItemsByCategory: (category) => {
                return get().items[category] || [];
            },

            getItemById: (category, id) => {
                return get().items[category].find((item) => item.id === id);
            },
        }),
        {
            name: 'project-manager-items',
        }
    )
);
