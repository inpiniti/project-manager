import { create } from 'zustand';
import { ProjectItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ItemStore {
    items: ProjectItem[];
    isLoading: boolean;

    // Actions
    fetchItems: (projectId: string) => Promise<void>;
    addItem: (item: Omit<ProjectItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateItem: (id: string, updatedItem: Partial<ProjectItem>) => Promise<void>;
    deleteItem: (id: string) => Promise<void>;
    getItemById: (id: string) => ProjectItem | undefined;
    getItemsByCategory: (category: string, projectId: string) => ProjectItem[];
}

export const useItemStore = create<ItemStore>((set, get) => ({
    items: [],
    isLoading: false,

    fetchItems: async (projectId) => {
        console.log('Fetching items for project:', projectId);
        set({ isLoading: true });
        try {
            const { data, error } = await supabase
                .from('items')
                .select('*')
                .eq('project_id', projectId);

            if (error) {
                console.error('Supabase error fetching items:', error);
                throw error;
            }

            console.log('Fetched items from Supabase:', data);

            const items: ProjectItem[] = (data || []).map((item: any) => ({
                id: item.id,
                projectId: item.project_id,
                category: item.category,
                title: item.title,
                description: item.description,
                status: item.status,
                priority: item.priority,
                tags: item.tags || [],
                details: item.details || {},
                createdAt: new Date(item.created_at),
                updatedAt: new Date(item.updated_at),
            }));

            console.log('Mapped items:', items);

            set({ items, isLoading: false });
            console.log('Items state updated');
        } catch (error) {
            console.error('Failed to fetch items:', error);
            set({ isLoading: false });
        }
    },

    addItem: async (item) => {
        try {
            const { data, error } = await supabase
                .from('items')
                .insert({
                    project_id: item.projectId,
                    category: item.category,
                    title: item.title,
                    description: item.description,
                    status: item.status || 'todo',
                    priority: item.priority || 'medium',
                    tags: item.tags || [],
                    details: item.details || {},
                })
                .select()
                .single();

            if (error) throw error;

            const newItem: ProjectItem = {
                id: data.id,
                projectId: data.project_id,
                category: data.category,
                title: data.title,
                description: data.description,
                status: data.status,
                priority: data.priority,
                tags: data.tags || [],
                details: data.details || {},
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };

            set((state) => ({
                items: [newItem, ...state.items],
            }));
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    },

    updateItem: async (id, updatedItem) => {
        try {
            const updateData: any = {
                updated_at: new Date().toISOString(),
            };

            if (updatedItem.title !== undefined) updateData.title = updatedItem.title;
            if (updatedItem.description !== undefined) updateData.description = updatedItem.description;
            if (updatedItem.status !== undefined) updateData.status = updatedItem.status;
            if (updatedItem.priority !== undefined) updateData.priority = updatedItem.priority;
            if (updatedItem.tags !== undefined) updateData.tags = updatedItem.tags;
            if (updatedItem.details !== undefined) updateData.details = updatedItem.details;

            const { error } = await supabase
                .from('items')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                items: state.items.map((item) =>
                    item.id === id ? { ...item, ...updatedItem, updatedAt: new Date() } : item
                ),
            }));
        } catch (error) {
            console.error('Failed to update item:', error);
        }
    },

    deleteItem: async (id) => {
        try {
            const { error } = await supabase
                .from('items')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    },

    getItemById: (id) => {
        return get().items.find((item) => item.id === id);
    },

    getItemsByCategory: (category, projectId) => {
        return get().items.filter(
            (item) => item.category === category && item.projectId === projectId
        );
    },
}));
