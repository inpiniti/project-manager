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
import { EffectForm } from "@/components/forms/EffectForm";
import { v4 as uuidv4 } from 'uuid';

export function DetailFormContainer() {
    const {
        isDetailFormOpen,
        detailFormType,
        detailFormMode,
        selectedItemId,
        selectedDetailId,
        closeDetailForm
    } = useUiStore();

    const {
        addVariable,
        addFunction,
        addObject,
        updateVariable,
        updateFunction,
        updateObject,
        updateEffect,
        getVariableById,
        getFunctionById,
        getObjectById,
        getEffectById,
        addEffect,
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
        } else if (selectedDetailId) {
            updateVariable(selectedDetailId, { ...data, updatedAt: now });
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
        } else if (selectedDetailId) {
            updateFunction(selectedDetailId, { ...data, updatedAt: now });
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
        } else if (selectedDetailId) {
            updateObject(selectedDetailId, { ...data, updatedAt: now });
        }
        closeDetailForm();
    };

    const handleEffectSubmit = (data: any) => {
        const now = new Date();
        if (detailFormMode === 'create') {
            addEffect({
                id: uuidv4(),
                itemId: selectedItemId,
                ...data,
                createdAt: now,
                updatedAt: now,
            });
        } else if (selectedDetailId) {
            updateEffect(selectedDetailId, { ...data, updatedAt: now });
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
            case 'effect':
                return `useEffect ${action}`;
            default:
                return '';
        }
    };

    return (
        <Sheet open={isDetailFormOpen} onOpenChange={(open) => !open && closeDetailForm()}>
            <SheetContent className="sm:max-w-[500px] overflow-y-auto px-4">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-base">{getTitle()}</SheetTitle>
                </SheetHeader>

                {detailFormType === 'variable' && (
                    <VariableForm
                        defaultValues={
                            detailFormMode === 'edit' && selectedDetailId
                                ? getVariableById(selectedDetailId)
                                : undefined
                        }
                        onSubmit={handleVariableSubmit}
                        onCancel={closeDetailForm}
                    />
                )}

                {detailFormType === 'function' && (
                    <FunctionForm
                        defaultValues={
                            detailFormMode === 'edit' && selectedDetailId
                                ? getFunctionById(selectedDetailId)
                                : undefined
                        }
                        onSubmit={handleFunctionSubmit}
                        onCancel={closeDetailForm}
                    />
                )}

                {detailFormType === 'object' && (
                    <ObjectForm
                        defaultValues={
                            detailFormMode === 'edit' && selectedDetailId
                                ? getObjectById(selectedDetailId)
                                : undefined
                        }
                        onSubmit={handleObjectSubmit}
                        onCancel={closeDetailForm}
                    />
                )}

                {detailFormType === 'effect' && (
                    <EffectForm
                        defaultValues={
                            detailFormMode === 'edit' && selectedDetailId
                                ? getEffectById(selectedDetailId)
                                : undefined
                        }
                        onSubmit={handleEffectSubmit}
                        onCancel={closeDetailForm}
                    />
                )}
            </SheetContent>
        </Sheet>
    );
}
