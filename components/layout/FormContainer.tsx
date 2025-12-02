'use client';

import { useUiStore } from "@/store/uiStore";
import { useItemStore } from "@/store/itemStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { CommonForm } from "@/components/forms/CommonForm";
import { v4 as uuidv4 } from 'uuid';
import { ProjectItem } from "@/lib/types";

export function FormContainer() {
    const { isFormOpen, formMode, selectedCategory, selectedItemId, currentProjectId, closeForm } = useUiStore();
    const { addItem, updateItem, getItemById } = useItemStore();

    if (!selectedCategory || !currentProjectId) return null;

    const item = selectedItemId ? getItemById(selectedItemId) : undefined;

    const handleSubmit = (data: any) => {
        const now = new Date();

        // 태그 문자열을 배열로 변환
        const tags = data.tags
            ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
            : [];

        if (formMode === 'create') {
            const newItem: ProjectItem = {
                id: uuidv4(),
                projectId: currentProjectId,
                category: selectedCategory,
                createdAt: now,
                updatedAt: now,
                createdBy: 'User',
                title: data.title,
                description: data.description,
                tags,
            };

            addItem(newItem);
        } else if (formMode === 'edit' && selectedItemId) {
            updateItem(selectedItemId, {
                title: data.title,
                description: data.description,
                tags,
                updatedAt: now,
            });
        }

        closeForm();
    };

    // 초기값 설정
    const defaultValues = item ? {
        title: item.title,
        description: item.description,
        tags: item.tags?.join(', '),
    } : undefined;

    return (
        <Sheet open={isFormOpen} onOpenChange={(open) => !open && closeForm()}>
            <SheetContent className="sm:max-w-[600px] overflow-y-auto px-4">
                <SheetHeader className="mb-6">
                    <SheetTitle>
                        {formMode === 'create' ? 'Add New Item' : 'Edit Item'}
                    </SheetTitle>
                </SheetHeader>

                <CommonForm
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    onCancel={closeForm}
                />
            </SheetContent>
        </Sheet>
    );
}
