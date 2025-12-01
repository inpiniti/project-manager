import { create } from 'zustand';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    error: string | null;

    // Actions
    login: (email: string) => Promise<boolean>;
    signup: (email: string, name: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isLoggingIn: false,
    isSigningUp: false,
    error: null,

    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // Get profile info
                let { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                // Create profile if not exists
                if (profileError && profileError.code === 'PGRST116') {
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: session.user.id,
                            email: session.user.email!,
                            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'User',
                        })
                        .select()
                        .single();

                    if (insertError) {
                        console.error('Failed to create profile:', insertError);
                        set({ user: null, isAuthenticated: false, isLoading: false });
                        return;
                    }
                    profile = newProfile;
                }

                set({
                    user: {
                        id: session.user.id,
                        email: session.user.email!,
                        name: profile?.name || session.user.user_metadata.name || 'User',
                        createdAt: new Date(session.user.created_at),
                    },
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
            }
        } catch (error) {
            console.error('Session check failed:', error);
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (email) => {
        set({ isLoggingIn: true, error: null });
        try {
            // Magic Link Login
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                }
            });

            if (error) throw error;
            alert('A login link has been sent to your email. Please check your inbox.');
            return true;
        } catch (error: any) {
            console.error('Login failed:', error);

            // Mock Login
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.warn('Supabase not configured. Using mock login.');
                const mockUser: User = {
                    id: 'mock-user-1',
                    email,
                    name: 'Mock User',
                    createdAt: new Date(),
                };
                set({ user: mockUser, isAuthenticated: true });
                alert('Logged in with a test account because Supabase is not configured.');
                return true;
            }

            const errorMessage = error.message || 'An unknown error occurred.';
            set({ error: errorMessage });
            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    signup: async (email, name) => {
        set({ isSigningUp: true, error: null });
        try {
            // Signup
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    data: { name },
                }
            });

            if (error) throw error;
            alert('A signup link has been sent to your email. Please check your inbox.');
            return true;
        } catch (error: any) {
            console.error('Signup failed:', error);

            // Mock Signup
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.warn('Supabase not configured. Using mock signup.');
                const mockUser: User = {
                    id: 'mock-user-' + Date.now(),
                    email,
                    name,
                    createdAt: new Date(),
                };
                set({ user: mockUser, isAuthenticated: true });
                alert('Signed up with a test account because Supabase is not configured.');
                return true;
            }

            const errorMessage = error.message || 'An unknown error occurred.';
            set({ error: errorMessage });
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },
}));
