'use client';

import { useProjectStore } from '@/store/projectStore';
import { useUiStore } from '@/store/uiStore';
import { useItemStore } from '@/store/itemStore';
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ListPanel } from "@/components/layout/ListPanel";
import { MainContent } from "@/components/layout/MainContent";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useEffect } from 'react';

export function ProjectDetail() {
    const { currentProjectId, setCurrentView, setCurrentProjectId } = useUiStore();
    const { getProjectById } = useProjectStore();
    const { fetchItems } = useItemStore();

    const project = currentProjectId ? getProjectById(currentProjectId) : null;

    useEffect(() => {
        if (currentProjectId) {
            fetchItems(currentProjectId);
        }
    }, [currentProjectId, fetchItems]);

    if (!currentProjectId) {
        return null;
    }

    if (!project) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
                    <Button
                        onClick={() => {
                            setCurrentProjectId(null);
                            setCurrentView('projectList');
                        }}
                    >
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const handleBackToList = () => {
        setCurrentProjectId(null);
        setCurrentView('projectList');
    };

    return (
        <div className="h-screen flex flex-col">
            {/* 프로젝트 헤더 */}
            <div className="border-b px-4 py-2 flex items-center justify-between bg-background flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToList}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Projects
                    </Button>
                    <div className="h-4 w-px bg-border" />
                    <div>
                        <h2 className="font-semibold text-sm">{project.name}</h2>
                        {project.description && (
                            <p className="text-xs text-muted-foreground">{project.description}</p>
                        )}
                    </div>
                </div>
                <ModeToggle />
            </div>

            {/* 기존 프로젝트 관리 화면 */}
            <div className="flex-1 overflow-hidden">
                <SidebarProvider defaultOpen={false} className="h-full overflow-hidden">
                    <AppSidebar />
                    <SidebarInset className="flex-1 overflow-hidden">
                        <ResizablePanelGroup direction="horizontal" className="h-full items-stretch">
                            {/* 2단: 리스트 패널 */}
                            <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="min-w-[300px]">
                                <div className="h-full overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                    <ListPanel />
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle />

                            {/* 3단: 메인 콘텐츠 */}
                            <ResizablePanel defaultSize={75}>
                                <div className="h-full">
                                    <MainContent />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </div>
    );
}
