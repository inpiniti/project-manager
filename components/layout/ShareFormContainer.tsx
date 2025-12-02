'use client';

import { useUiStore } from "@/store/uiStore";
import { useProjectStore } from "@/store/projectStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ShareForm } from "@/components/forms/ShareForm";

export function ShareFormContainer() {
    const { isShareFormOpen, shareProjectId, closeShareForm } = useUiStore();
    const { getProjectById } = useProjectStore();

    if (!shareProjectId) return null;

    const project = getProjectById(shareProjectId);
    if (!project) return null;

    return (
        <Sheet open={isShareFormOpen} onOpenChange={(open) => !open && closeShareForm()}>
            <SheetContent className="sm:max-w-[500px] px-4">
                <SheetHeader className="mb-6">
                    <SheetTitle>Share Project</SheetTitle>
                </SheetHeader>
                <ShareForm
                    project={project}
                    onClose={closeShareForm}
                />
            </SheetContent>
        </Sheet>
    );
}
