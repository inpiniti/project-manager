import { create } from 'zustand';
import { User } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

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

    checkSession: async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                // 프로필 정보 가져오기
                let { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                // 프로필이 없으면 생성
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
            // 환경 변수가 없거나 에러 발생 시 로컬 스토리지 폴백 (기존 로직 유지 가능하지만 여기서는 초기화)
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    login: async (email) => {
        try {
            // Magic Link 로그인
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false, // 회원가입이 아니면 false
                }
            });

            if (error) throw error;
            alert('이메일로 로그인 링크가 전송되었습니다. 확인해주세요.');
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            // Mock 로그인 (Supabase 설정 없을 때 테스트용)
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.warn('Supabase not configured. Using mock login.');
                const mockUser: User = {
                    id: 'mock-user-1',
                    email,
                    name: 'Mock User',
                    createdAt: new Date(),
                };
                set({ user: mockUser, isAuthenticated: true });
                return true;
            }
            return false;
        }
    },

    signup: async (email, name) => {
        try {
            // 회원가입 (메타데이터에 이름 저장)
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    data: { name },
                }
            });

            if (error) throw error;
            alert('이메일로 가입 링크가 전송되었습니다. 확인해주세요.');
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            // Mock 회원가입
            if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
                console.warn('Supabase not configured. Using mock signup.');
                const mockUser: User = {
                    id: 'mock-user-' + Date.now(),
                    email,
                    name,
                    createdAt: new Date(),
                };
                set({ user: mockUser, isAuthenticated: true });
                return true;
            }
            return false;
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
    },
}));
