import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Variable, FunctionItem, ObjectItem, EffectItem } from '@/lib/types';

interface DetailStore {
    // 데이터
    variables: Variable[];
    functions: FunctionItem[];
    objects: ObjectItem[];
    effects: EffectItem[];

    // Variable Actions
    addVariable: (variable: Variable) => void;
    updateVariable: (id: string, variable: Partial<Variable>) => void;
    deleteVariable: (id: string) => void;
    getVariablesByItemId: (itemId: string) => Variable[];
    getVariableById: (id: string) => Variable | undefined;
    importVariable: (variableId: string, targetItemId: string) => void;

    // Function Actions
    addFunction: (func: FunctionItem) => void;
    updateFunction: (id: string, func: Partial<FunctionItem>) => void;
    deleteFunction: (id: string) => void;
    getFunctionsByItemId: (itemId: string) => FunctionItem[];
    getFunctionById: (id: string) => FunctionItem | undefined;
    importFunction: (functionId: string, targetItemId: string) => void;

    // Object Actions
    addObject: (obj: ObjectItem) => void;
    updateObject: (id: string, obj: Partial<ObjectItem>) => void;
    deleteObject: (id: string) => void;
    getObjectsByItemId: (itemId: string) => ObjectItem[];
    getObjectById: (id: string) => ObjectItem | undefined;
    importObject: (objectId: string, targetItemId: string) => void;

    // Effect Actions
    addEffect: (effect: EffectItem) => void;
    updateEffect: (id: string, effect: Partial<EffectItem>) => void;
    deleteEffect: (id: string) => void;
    getEffectsByItemId: (itemId: string) => EffectItem[];
    getEffectById: (id: string) => EffectItem | undefined;
    importEffect: (effectId: string, targetItemId: string) => void;

    // Get all resources (for import selection)
    getAllVariables: () => Variable[];
    getAllFunctions: () => FunctionItem[];
    getAllObjects: () => ObjectItem[];
    getAllEffects: () => EffectItem[];
}

export const useDetailStore = create<DetailStore>()(
    persist(
        (set, get) => ({
            variables: [],
            functions: [],
            objects: [],
            effects: [],

            // Variable Actions
            addVariable: (variable) =>
                set((state) => ({
                    variables: [variable, ...state.variables],
                })),

            updateVariable: (id, updatedVariable) =>
                set((state) => ({
                    variables: state.variables.map((v) =>
                        v.id === id ? { ...v, ...updatedVariable } : v
                    ),
                })),

            deleteVariable: (id) =>
                set((state) => {
                    const variableToDelete = state.variables.find((v) => v.id === id);
                    if (!variableToDelete) return state;

                    const isOriginal = !variableToDelete.isImported;

                    return {
                        variables: state.variables.filter((v) => {
                            // 삭제 대상 자체 제외
                            if (v.id === id) return false;
                            // 원본 삭제 시, 해당 원본을 참조하는 import된 변수들도 제외
                            if (isOriginal && v.isImported && v.sourceId === id) {
                                return false;
                            }
                            return true;
                        }),
                    };
                }),

            getVariablesByItemId: (itemId) => {
                return get().variables.filter((v) => v.itemId === itemId);
            },

            getVariableById: (id) => {
                return get().variables.find((v) => v.id === id);
            },

            // Function Actions
            addFunction: (func) =>
                set((state) => ({
                    functions: [func, ...state.functions],
                })),

            updateFunction: (id, updatedFunction) =>
                set((state) => ({
                    functions: state.functions.map((f) =>
                        f.id === id ? { ...f, ...updatedFunction } : f
                    ),
                })),

            deleteFunction: (id) =>
                set((state) => {
                    const functionToDelete = state.functions.find((f) => f.id === id);
                    if (!functionToDelete) return state;

                    const isOriginal = !functionToDelete.isImported;

                    return {
                        functions: state.functions.filter((f) => {
                            if (f.id === id) return false;
                            if (isOriginal && f.isImported && f.sourceId === id) {
                                return false;
                            }
                            return true;
                        }),
                    };
                }),

            getFunctionsByItemId: (itemId) => {
                return get().functions.filter((f) => f.itemId === itemId);
            },

            getFunctionById: (id) => {
                return get().functions.find((f) => f.id === id);
            },

            // Object Actions
            addObject: (obj) =>
                set((state) => ({
                    objects: [obj, ...state.objects],
                })),

            updateObject: (id, updatedObject) =>
                set((state) => ({
                    objects: state.objects.map((o) =>
                        o.id === id ? { ...o, ...updatedObject } : o
                    ),
                })),

            deleteObject: (id) =>
                set((state) => {
                    const objectToDelete = state.objects.find((o) => o.id === id);
                    if (!objectToDelete) return state;

                    const isOriginal = !objectToDelete.isImported;

                    return {
                        objects: state.objects.filter((o) => {
                            if (o.id === id) return false;
                            if (isOriginal && o.isImported && o.sourceId === id) {
                                return false;
                            }
                            return true;
                        }),
                    };
                }),

            getObjectsByItemId: (itemId) => {
                return get().objects.filter((o) => o.itemId === itemId);
            },

            getObjectById: (id) => {
                return get().objects.find((o) => o.id === id);
            },

            // Import methods
            importVariable: (variableId, targetItemId) => {
                const sourceVariable = get().variables.find((v) => v.id === variableId);
                if (!sourceVariable) return;

                // Root ID 찾기: 이미 import된 리소스라면 그 리소스의 sourceId를 사용
                const rootSourceId = sourceVariable.isImported && sourceVariable.sourceId
                    ? sourceVariable.sourceId
                    : variableId;

                const rootSourceItemId = sourceVariable.isImported && sourceVariable.sourceItemId
                    ? sourceVariable.sourceItemId
                    : sourceVariable.itemId;

                const now = new Date();
                const importedVariable: Variable = {
                    ...sourceVariable,
                    id: `${rootSourceId}-imported-${Date.now()}`,
                    itemId: targetItemId,
                    isImported: true,
                    sourceItemId: rootSourceItemId,
                    sourceId: rootSourceId, // 항상 Root ID 저장
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    variables: [importedVariable, ...state.variables],
                }));
            },

            importFunction: (functionId, targetItemId) => {
                const sourceFunction = get().functions.find((f) => f.id === functionId);
                if (!sourceFunction) return;

                const rootSourceId = sourceFunction.isImported && sourceFunction.sourceId
                    ? sourceFunction.sourceId
                    : functionId;

                const rootSourceItemId = sourceFunction.isImported && sourceFunction.sourceItemId
                    ? sourceFunction.sourceItemId
                    : sourceFunction.itemId;

                const now = new Date();
                const importedFunction: FunctionItem = {
                    ...sourceFunction,
                    id: `${rootSourceId}-imported-${Date.now()}`,
                    itemId: targetItemId,
                    isImported: true,
                    sourceItemId: rootSourceItemId,
                    sourceId: rootSourceId,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    functions: [importedFunction, ...state.functions],
                }));
            },

            importObject: (objectId, targetItemId) => {
                const sourceObject = get().objects.find((o) => o.id === objectId);
                if (!sourceObject) return;

                const rootSourceId = sourceObject.isImported && sourceObject.sourceId
                    ? sourceObject.sourceId
                    : objectId;

                const rootSourceItemId = sourceObject.isImported && sourceObject.sourceItemId
                    ? sourceObject.sourceItemId
                    : sourceObject.itemId;

                const now = new Date();
                const importedObject: ObjectItem = {
                    ...sourceObject,
                    id: `${rootSourceId}-imported-${Date.now()}`,
                    itemId: targetItemId,
                    isImported: true,
                    sourceItemId: rootSourceItemId,
                    sourceId: rootSourceId,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    objects: [importedObject, ...state.objects],
                }));
            },

            // Get all resources
            getAllVariables: () => {
                return get().variables;
            },

            getAllFunctions: () => {
                return get().functions;
            },

            getAllObjects: () => {
                return get().objects;
            },

            // Effect Actions
            addEffect: (effect) =>
                set((state) => ({
                    effects: [effect, ...state.effects],
                })),

            updateEffect: (id, updatedEffect) =>
                set((state) => ({
                    effects: state.effects.map((e) =>
                        e.id === id ? { ...e, ...updatedEffect } : e
                    ),
                })),

            deleteEffect: (id) =>
                set((state) => {
                    const effectToDelete = state.effects.find((e) => e.id === id);
                    if (!effectToDelete) return state;

                    const isOriginal = !effectToDelete.isImported;

                    return {
                        effects: state.effects.filter((e) => {
                            if (e.id === id) return false;
                            if (isOriginal && e.isImported && e.sourceId === id) {
                                return false;
                            }
                            return true;
                        }),
                    };
                }),

            getEffectsByItemId: (itemId) => {
                return get().effects.filter((e) => e.itemId === itemId);
            },

            getEffectById: (id) => {
                return get().effects.find((e) => e.id === id);
            },

            importEffect: (effectId, targetItemId) => {
                const sourceEffect = get().effects.find((e) => e.id === effectId);
                if (!sourceEffect) return;

                const rootSourceId = sourceEffect.isImported && sourceEffect.sourceId
                    ? sourceEffect.sourceId
                    : effectId;

                const rootSourceItemId = sourceEffect.isImported && sourceEffect.sourceItemId
                    ? sourceEffect.sourceItemId
                    : sourceEffect.itemId;

                const now = new Date();
                const importedEffect: EffectItem = {
                    ...sourceEffect,
                    id: `${rootSourceId}-imported-${Date.now()}`,
                    itemId: targetItemId,
                    isImported: true,
                    sourceItemId: rootSourceItemId,
                    sourceId: rootSourceId,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    effects: [importedEffect, ...state.effects],
                }));
            },

            getAllEffects: () => {
                return get().effects;
            },
        }),
        {
            name: 'project-manager-details',
        }
    )
);
