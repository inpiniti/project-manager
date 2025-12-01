import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Variable, FunctionItem, ObjectItem } from '@/lib/types';

interface DetailStore {
    // 데이터
    variables: Variable[];
    functions: FunctionItem[];
    objects: ObjectItem[];

    // Variable Actions
    addVariable: (variable: Variable) => void;
    updateVariable: (id: string, variable: Partial<Variable>) => void;
    deleteVariable: (id: string) => void;
    getVariablesByItemId: (itemId: string) => Variable[];

    // Function Actions
    addFunction: (func: FunctionItem) => void;
    updateFunction: (id: string, func: Partial<FunctionItem>) => void;
    deleteFunction: (id: string) => void;
    getFunctionsByItemId: (itemId: string) => FunctionItem[];

    // Object Actions
    addObject: (obj: ObjectItem) => void;
    updateObject: (id: string, obj: Partial<ObjectItem>) => void;
    deleteObject: (id: string) => void;
    getObjectsByItemId: (itemId: string) => ObjectItem[];
}

export const useDetailStore = create<DetailStore>()(
    persist(
        (set, get) => ({
            variables: [],
            functions: [],
            objects: [],

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
                set((state) => ({
                    variables: state.variables.filter((v) => v.id !== id),
                })),

            getVariablesByItemId: (itemId) => {
                return get().variables.filter((v) => v.itemId === itemId);
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
                set((state) => ({
                    functions: state.functions.filter((f) => f.id !== id),
                })),

            getFunctionsByItemId: (itemId) => {
                return get().functions.filter((f) => f.itemId === itemId);
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
                set((state) => ({
                    objects: state.objects.filter((o) => o.id !== id),
                })),

            getObjectsByItemId: (itemId) => {
                return get().objects.filter((o) => o.itemId === itemId);
            },
        }),
        {
            name: 'project-manager-details',
        }
    )
);
