'use client';

import { useProjectStore } from '@/store/projectStore';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Plus, FolderOpen, Calendar, Trash2, LogOut, Share2 } from 'lucide-react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useEffect } from 'react';

export function ProjectList() {
    const { deleteProject, getProjectsByUserId, shareProject, fetchProjects } = useProjectStore();
    const { setCurrentView, setCurrentProjectId, openProjectForm, openShareForm } = useUiStore();
    const { user, logout } = useAuthStore();

    useEffect(() => {
        if (user) {
            fetchProjects(user.id);
        }
    }, [user, fetchProjects]);

    const handleCreateProject = () => {
        openProjectForm();
    };

    const handleOpenProject = (projectId: string) => {
        setCurrentProjectId(projectId);
        setCurrentView('projectDetail');
    };

    const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(projectId);
        }
    };

    const handleShareProject = (projectId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        openShareForm(projectId);
    };

    // 비로그인 상태 UI
    if (!user) {
        return (
            <div className="h-screen flex flex-col bg-background">
                <div className="border-b p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Project Manager</h1>
                    <div className="flex gap-2 items-center">
                        <ModeToggle />
                        <Button onClick={() => setCurrentView('login')}>Log In</Button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in duration-500">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Build in a weekend<br />Scale to millions
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                        Supabase is the Postgres development platform.<br />
                        Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.
                    </p>
                    <div className="flex gap-4">
                        <Button size="lg" onClick={() => setCurrentView('login')} className="text-lg px-8 py-6">
                            Start your project
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const projects = getProjectsByUserId(user.id);

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* 헤더 */}
            <div className="border-b p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Project Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome, {user.name}! Select a project or create a new one
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <ModeToggle />
                        <Button variant="outline" onClick={logout} className="gap-2">
                            <LogOut className="h-4 w-4" />
                            Log Out
                        </Button>
                        <Button onClick={handleCreateProject} className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Project
                        </Button>
                    </div>
                </div>
            </div>

            {/* 프로젝트 목록 */}
            <div className="flex-1 overflow-y-auto p-6">
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <FolderOpen className="h-20 w-20 text-muted-foreground/50 mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Start your first project</h2>
                        <p className="text-muted-foreground mb-8 max-w-md text-lg">
                            Create a new project to start managing your screens, APIs, databases, and more in one place.
                        </p>
                        <Button size="lg" onClick={handleCreateProject} className="gap-2 text-lg px-8">
                            <Plus className="h-5 w-5" />
                            Create New Project
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {projects.map((project) => {
                            const isOwner = project.userId === user.id;

                            return (
                                <div
                                    key={project.id}
                                    onClick={() => handleOpenProject(project.id)}
                                    className="group relative border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer bg-card hover:border-primary flex flex-col h-[200px]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <FolderOpen className={`h-8 w-8 ${isOwner ? 'text-primary' : 'text-blue-500'}`} />
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {isOwner && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => handleShareProject(project.id, e)}
                                                        title="Invite"
                                                    >
                                                        <Share2 className="h-4 w-4 text-muted-foreground" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                        {project.name}
                                        {!isOwner && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-100">Shared</span>}
                                    </h3>

                                    {project.description && (
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 flex-1">
                                            {project.description}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(project.createdAt).toLocaleDateString('en-US')}
                                        </div>
                                        {!isOwner && (
                                            <span className="text-xs text-muted-foreground">
                                                By {project.createdBy || 'Unknown'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
