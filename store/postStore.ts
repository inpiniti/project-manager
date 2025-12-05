import { create } from 'zustand';
import { Post, Comment } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface PostStore {
    posts: Post[];
    currentPost: Post | null;
    comments: Comment[];

    // Posts
    fetchPosts: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
    createPost: (title: string, content: string) => Promise<void>;
    updatePost: (id: string, title: string, content: string) => Promise<void>;
    deletePost: (id: string) => Promise<void>;

    // Comments
    fetchComments: (postId: string) => Promise<void>;
    createComment: (postId: string, content: string) => Promise<void>;
    deleteComment: (id: string) => Promise<void>;

    // UI
    setCurrentPost: (post: Post | null) => void;
}

export const usePostStore = create<PostStore>((set, get) => ({
    posts: [],
    currentPost: null,
    comments: [],

    fetchPosts: async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return;
        }

        const posts: Post[] = (data || []).map((item: any) => ({
            id: item.id,
            title: item.title,
            content: item.content,
            authorId: item.author_id,
            authorName: item.author_id.substring(0, 8) + '...', // 임시로 ID 일부 표시
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
        }));

        set({ posts });
    },

    fetchPostById: async (id: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching post:', error);
            return;
        }

        const post: Post = {
            id: data.id,
            title: data.title,
            content: data.content,
            authorId: data.author_id,
            authorName: data.author_id.substring(0, 8) + '...', // 임시로 ID 일부 표시
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };

        set({ currentPost: post });
    },

    createPost: async (title: string, content: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // profiles 테이블에 사용자 정보가 있는지 확인
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        // 없으면 생성
        if (!profile) {
            await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    name: user.email?.split('@')[0] || '익명',
                    email: user.email,
                });
        }

        const { error } = await supabase
            .from('posts')
            .insert({
                title,
                content,
                author_id: user.id,
            });

        if (error) {
            console.error('Error creating post:', error);
            return;
        }

        await get().fetchPosts();
    },

    updatePost: async (id: string, title: string, content: string) => {
        const { error } = await supabase
            .from('posts')
            .update({
                title,
                content,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating post:', error);
            return;
        }

        await get().fetchPosts();
        if (get().currentPost?.id === id) {
            await get().fetchPostById(id);
        }
    },

    deletePost: async (id: string) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting post:', error);
            return;
        }

        set({
            posts: get().posts.filter(p => p.id !== id),
            currentPost: get().currentPost?.id === id ? null : get().currentPost
        });
    },

    fetchComments: async (postId: string) => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        const comments: Comment[] = (data || []).map((item: any) => ({
            id: item.id,
            postId: item.post_id,
            content: item.content,
            authorId: item.author_id,
            authorName: item.author_id.substring(0, 8) + '...', // 임시로 ID 일부 표시
            createdAt: new Date(item.created_at),
            updatedAt: new Date(item.updated_at),
        }));

        set({ comments });
    },

    createComment: async (postId: string, content: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // profiles 테이블에 사용자 정보가 있는지 확인
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        // 없으면 생성
        if (!profile) {
            await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    name: user.email?.split('@')[0] || '익명',
                    email: user.email,
                });
        }

        const { error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                content,
                author_id: user.id,
            });

        if (error) {
            console.error('Error creating comment:', error);
            return;
        }

        await get().fetchComments(postId);
    },

    deleteComment: async (id: string) => {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting comment:', error);
            return;
        }

        set({ comments: get().comments.filter(c => c.id !== id) });
    },

    setCurrentPost: (post: Post | null) => {
        set({ currentPost: post, comments: [] });
    },
}));
