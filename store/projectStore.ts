import { create } from 'zustand';
import { Project } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface ProjectStore {
    projects: Project[];
    isLoading: boolean;

    // Actions
    fetchProjects: (userId: string) => Promise<void>;
    addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updateProject: (id: string, updatedProject: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProjectById: (id: string) => Project | undefined;
    getProjectsByUserId: (userId: string) => Project[];
    shareProject: (projectId: string, userId: string) => Promise<void>;
    unshareProject: (projectId: string, userId: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    isLoading: false,

    fetchProjects: async (userId) => {
        set({ isLoading: true });
        try {
            // 본인 소유 프로젝트 + 공유받은 프로젝트 조회
            const { data: ownProjects, error: ownError } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId);

            if (ownError) throw ownError;

            // 공유받은 프로젝트 조회
            const { data: sharedProjectIds, error: sharedError } = await supabase
                .from('project_members')
                .select('project_id')
                .eq('user_id', userId);

            if (sharedError) throw sharedError;

            let sharedProjects: any[] = [];
            if (sharedProjectIds && sharedProjectIds.length > 0) {
                const ids = sharedProjectIds.map(p => p.project_id);
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .in('id', ids);

                if (error) throw error;
                sharedProjects = data || [];
            }

            // 병합 및 중복 제거
            const allProjects = [...(ownProjects || []), ...sharedProjects];
            const uniqueProjects = Array.from(
                new Map(allProjects.map(p => [p.id, p])).values()
            );

            // sharedWith 정보 추가
            const projectsWithMembers = await Promise.all(
                uniqueProjects.map(async (project) => {
                    const { data: members } = await supabase
                        .from('project_members')
                        .select('user_id')
                        .eq('project_id', project.id);

                    return {
                        ...project,
                        userId: project.user_id,
                        sharedWith: members?.map(m => m.user_id) || [],
                        createdAt: new Date(project.created_at),
                        updatedAt: new Date(project.updated_at),
                    };
                })
            );

            set({ projects: projectsWithMembers, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            set({ isLoading: false });
        }
    },

    addProject: async (project) => {
        try {
            console.log('Creating project:', project);

            const { data, error } = await supabase
                .from('projects')
                .insert({
                    user_id: project.userId,
                    name: project.name,
                    description: project.description,
                    created_by: project.createdBy,
                })
                .select()
                .single();

            if (error) {
                console.error('Supabase error:', error);
                alert(`프로젝트 생성 실패: ${error.message}`);
                throw error;
            }

            console.log('Project created:', data);

            const newProject: Project = {
                ...data,
                userId: data.user_id,
                sharedWith: [],
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };

            set((state) => ({
                projects: [newProject, ...state.projects],
            }));

            alert('프로젝트가 생성되었습니다!');
        } catch (error: any) {
            console.error('Failed to add project:', error);
            alert(`프로젝트 생성 중 오류: ${error.message || '알 수 없는 오류'}`);
        }
    },

    updateProject: async (id, updatedProject) => {
        try {
            const { error } = await supabase
                .from('projects')
                .update({
                    name: updatedProject.name,
                    description: updatedProject.description,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                projects: state.projects.map((p) =>
                    p.id === id ? { ...p, ...updatedProject, updatedAt: new Date() } : p
                ),
            }));
        } catch (error) {
            console.error('Failed to update project:', error);
        }
    },

    deleteProject: async (id) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            set((state) => ({
                projects: state.projects.filter((p) => p.id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    },

    getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
    },

    getProjectsByUserId: (userId) => {
        return get().projects.filter(
            (p) => p.userId === userId || p.sharedWith?.includes(userId)
        );
    },

    shareProject: async (projectId, userId) => {
        try {
            const { error } = await supabase
                .from('project_members')
                .insert({
                    project_id: projectId,
                    user_id: userId,
                    role: 'editor',
                });

            if (error) throw error;

            set((state) => ({
                projects: state.projects.map((p) => {
                    if (p.id === projectId) {
                        const sharedWith = p.sharedWith || [];
                        if (!sharedWith.includes(userId)) {
                            return { ...p, sharedWith: [...sharedWith, userId] };
                        }
                    }
                    return p;
                }),
            }));
        } catch (error) {
            console.error('Failed to share project:', error);
        }
    },

    unshareProject: async (projectId, userId) => {
        try {
            const { error } = await supabase
                .from('project_members')
                .delete()
                .eq('project_id', projectId)
                .eq('user_id', userId);

            if (error) throw error;

            set((state) => ({
                projects: state.projects.map((p) => {
                    if (p.id === projectId) {
                        const sharedWith = p.sharedWith || [];
                        return { ...p, sharedWith: sharedWith.filter((id) => id !== userId) };
                    }
                    return p;
                }),
            }));
        } catch (error) {
            console.error('Failed to unshare project:', error);
        }
    },
}));
