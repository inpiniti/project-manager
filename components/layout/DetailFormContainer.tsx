'use client';

import { useUiStore } from "@/store/uiStore";
import { useDetailStore } from "@/store/detailStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { VariableForm } from "@/components/forms/VariableForm";
import { FunctionForm } from "@/components/forms/FunctionForm";
import { ObjectForm } from "@/components/forms/ObjectForm";
import { v4 as uuidv4 } from 'uuid';

export function DetailFormContainer() {
    const {
        isDetailFormOpen,
        detailFormType,
        detailFormMode,
        selectedItemId,
        closeDetailForm
    } = useUiStore();

    const {
        addVariable,
        addFunction,
        addObject,
        updateVariable,
        updateFunction,
        updateObject,
    } = useDetailStore();

    if (!selectedItemId || !detailFormType) return null;

    const handleVariableSubmit = (data: any) => {
        const now = new Date();
        if (detailFormMode === 'create') {
            addVariable({
                id: uuidv4(),
                itemId: selectedItemId,
                ...data,
                createdAt: now,
                updatedAt: now,
            });
        } else {
            // 수정 로직은 나중에 구현
            updateVariable(data.id, { ...data, updatedAt: now });
        }
        closeDetailForm();
    };

    const handleFunctionSubmit = (data: any) => {
        const now = new Date();
        if (detailFormMode === 'create') {
            addFunction({
                id: uuidv4(),
                itemId: selectedItemId,
                ...data,
                createdAt: now,
                updatedAt: now,
            });
        } else {
            updateFunction(data.id, { ...data, updatedAt: now });
        }
        closeDetailForm();
    };

    const handleObjectSubmit = (data: any) => {
        const now = new Date();
        if (detailFormMode === 'create') {
            addObject({
                id: uuidv4(),
                itemId: selectedItemId,
                ...data,
                createdAt: now,
                updatedAt: now,
            });
        } else {
            updateObject(data.id, { ...data, updatedAt: now });
        }
        closeDetailForm();
    };

    const getTitle = () => {
        const action = detailFormMode === 'create' ? '추가' : '수정';
        switch (detailFormType) {
            case 'variable':
                return `변수 ${action}`;
            case 'function':
                return `함수 ${action}`;
            case 'object':
                return `객체 ${action}`;
            default:
                return '';
        }
    };

    return (
        <Sheet open={isDetailFormOpen} onOpenChange={(open) => !open && closeDetailForm()}>
            <SheetContent className="sm:max-w-[500px] overflow-y-auto px-6">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-base">{getTitle()}</SheetTitle>
                </SheetHeader>

                {detailFormType === 'variable' && (
                    <VariableForm
                        onSubmit={handleVariableSubmit}
                        onCancel={closeDetailForm}
                    />
                )}

                {detailFormType === 'function' && (
                    <FunctionForm
                        onSubmit={handleFunctionSubmit}
                        onCancel={closeDetailForm}
                    />
                )}

                {detailFormType === 'object' && (
                    <ObjectForm
                        onSubmit={handleObjectSubmit}
                        onCancel={closeDetailForm}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
