'use client';

import { useUiStore } from "@/store/uiStore";
import { useProjectStore } from "@/store/projectStore";
import { useAuthStore } from "@/store/authStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ProjectForm } from "@/components/forms/ProjectForm";

export function ProjectFormContainer() {
    const { isProjectFormOpen, closeProjectForm } = useUiStore();
    const { addProject } = useProjectStore();
    const { user } = useAuthStore();

    if (!user) return null;

    const handleSubmit = async (data: any) => {
        await addProject({
            userId: user.id,
            name: data.name,
            description: data.description || '',
            createdBy: user.name,
        });
        closeProjectForm();
    };

    return (
        <Sheet open={isProjectFormOpen} onOpenChange={(open) => !open && closeProjectForm()}>
            <SheetContent className="sm:max-w-[500px] px-4">
                <SheetHeader className="mb-6">
                    <SheetTitle>Create New Project</SheetTitle>
                </SheetHeader>
                <ProjectForm
                    onSubmit={handleSubmit}
                    onCancel={closeProjectForm}
                />
            </SheetContent>
        </Sheet>
    );
}
