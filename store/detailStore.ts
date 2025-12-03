import { create } from 'zustand';
import { Variable, FunctionItem, ObjectItem, EffectItem } from '@/lib/types';
import { supabase } from '@/lib/supabase';

interface DetailStore {
    // 데이터
    variables: Variable[];
    functions: FunctionItem[];
    objects: ObjectItem[];
    effects: EffectItem[];

    // 데이터 로딩
    fetchProjectResources: (projectId: string) => Promise<void>;

    // Variable Actions
    addVariable: (variable: Variable) => Promise<void>;
    updateVariable: (id: string, variable: Partial<Variable>) => Promise<void>;
    deleteVariable: (id: string) => Promise<void>;
    getVariablesByItemId: (itemId: string) => Variable[];
    getVariableById: (id: string) => Variable | undefined;
    importVariable: (variableId: string, targetItemId: string) => Promise<void>;

    // Function Actions
    addFunction: (func: FunctionItem) => Promise<void>;
    updateFunction: (id: string, func: Partial<FunctionItem>) => Promise<void>;
    deleteFunction: (id: string) => Promise<void>;
    getFunctionsByItemId: (itemId: string) => FunctionItem[];
    getFunctionById: (id: string) => FunctionItem | undefined;
    importFunction: (functionId: string, targetItemId: string) => Promise<void>;

    // Object Actions
    addObject: (obj: ObjectItem) => Promise<void>;
    updateObject: (id: string, obj: Partial<ObjectItem>) => Promise<void>;
    deleteObject: (id: string) => Promise<void>;
    getObjectsByItemId: (itemId: string) => ObjectItem[];
    getObjectById: (id: string) => ObjectItem | undefined;
    importObject: (objectId: string, targetItemId: string) => Promise<void>;

    // Effect Actions
    addEffect: (effect: EffectItem) => Promise<void>;
    updateEffect: (id: string, effect: Partial<EffectItem>) => Promise<void>;
    deleteEffect: (id: string) => Promise<void>;
    getEffectsByItemId: (itemId: string) => EffectItem[];
    getEffectById: (id: string) => EffectItem | undefined;
    importEffect: (effectId: string, targetItemId: string) => Promise<void>;

    // Get all resources
    getAllVariables: () => Variable[];
    getAllFunctions: () => FunctionItem[];
    getAllObjects: () => ObjectItem[];
    getAllEffects: () => EffectItem[];
}

export const useDetailStore = create<DetailStore>((set, get) => ({
    variables: [],
    functions: [],
    objects: [],
    effects: [],

    fetchProjectResources: async (projectId) => {
        // Variables
        const { data: variables } = await supabase
            .from('variables')
            .select('*, items!inner(project_id)')
            .eq('items.project_id', projectId);

        // Functions
        const { data: functions } = await supabase
            .from('functions')
            .select('*, items!inner(project_id)')
            .eq('items.project_id', projectId);

        // Objects
        const { data: objects } = await supabase
            .from('objects')
            .select('*, items!inner(project_id)')
            .eq('items.project_id', projectId);

        // Effects
        const { data: effects } = await supabase
            .from('effects')
            .select('*, items!inner(project_id)')
            .eq('items.project_id', projectId);

        set({
            variables: (variables || []).map(mapVariableFromDb),
            functions: (functions || []).map(mapFunctionFromDb),
            objects: (objects || []).map(mapObjectFromDb),
            effects: (effects || []).map(mapEffectFromDb),
        });
    },

    // Variable Actions
    addVariable: async (variable) => {
        const { error } = await supabase.from('variables').insert(mapVariableToDb(variable));
        if (error) {
            console.error('Error adding variable:', error);
            return;
        }
        set((state) => ({ variables: [variable, ...state.variables] }));
    },

    updateVariable: async (id, updatedVariable) => {
        const currentVariable = get().getVariableById(id);
        if (!currentVariable) return;

        // 1. Update the specific variable (including isReturn)
        const { error } = await supabase
            .from('variables')
            .update(mapVariableToDb({ ...currentVariable, ...updatedVariable }))
            .eq('id', id);

        if (error) {
            console.error('Error updating variable:', error);
            return;
        }

        // 2. Propagate changes to related variables (excluding isReturn)
        const rootSourceId = currentVariable.isImported && currentVariable.sourceId
            ? currentVariable.sourceId
            : id;

        const sharedUpdates = {
            name: updatedVariable.name,
            type: updatedVariable.type,
            default_value: updatedVariable.defaultValue,
            description: updatedVariable.description,
            updated_at: new Date().toISOString(),
        };

        const { error: syncError } = await supabase
            .from('variables')
            .update(sharedUpdates)
            .or(`id.eq.${rootSourceId},source_id.eq.${rootSourceId}`)
            .neq('id', id);

        if (syncError) {
            console.error('Error syncing related variables:', syncError);
        }

        // 3. Update local state
        set((state) => ({
            variables: state.variables.map((v) => {
                if (v.id === id) {
                    return { ...v, ...updatedVariable };
                }
                const isRelated = v.id === rootSourceId || v.sourceId === rootSourceId;
                if (isRelated) {
                    return {
                        ...v,
                        name: updatedVariable.name ?? v.name,
                        type: updatedVariable.type ?? v.type,
                        defaultValue: updatedVariable.defaultValue ?? v.defaultValue,
                        description: updatedVariable.description ?? v.description,
                    };
                }
                return v;
            }),
        }));
    },

    deleteVariable: async (id) => {
        const variableToDelete = get().variables.find((v) => v.id === id);
        if (!variableToDelete) return;

        const isOriginal = !variableToDelete.isImported;

        await supabase.from('variables').delete().eq('id', id);

        if (isOriginal) {
            await supabase.from('variables').delete().eq('source_id', id);
        }

        set((state) => ({
            variables: state.variables.filter((v) => {
                if (v.id === id) return false;
                if (isOriginal && v.isImported && v.sourceId === id) return false;
                return true;
            }),
        }));
    },

    getVariablesByItemId: (itemId) => get().variables.filter((v) => v.itemId === itemId),
    getVariableById: (id) => get().variables.find((v) => v.id === id),

    importVariable: async (variableId, targetItemId) => {
        const sourceVariable = get().variables.find((v) => v.id === variableId);
        if (!sourceVariable) return;

        const rootSourceId = sourceVariable.isImported && sourceVariable.sourceId
            ? sourceVariable.sourceId
            : variableId;

        const rootSourceItemId = sourceVariable.isImported && sourceVariable.sourceItemId
            ? sourceVariable.sourceItemId
            : sourceVariable.itemId;

        const now = new Date();
        // ID는 Supabase가 생성하도록 할 수도 있지만, 클라이언트에서 생성해서 보내는 것이 상태 관리에 유리할 수 있음.
        // 하지만 여기서는 DB 기본값(uuid)을 따르기 위해 insert 후 반환된 값을 사용하는 것이 정석.
        // 편의상 클라이언트 생성 ID 사용 (Supabase 테이블도 UUID PK이므로 문제 없음)
        // 단, uuid 라이브러리가 필요함. 기존 코드에서 uuidv4를 쓰고 있었으므로 여기서도 생성해서 보냄.
        // 하지만 importVariable 호출 시점에는 ID를 생성하지 않고 내부에서 생성해야 함.
        // 여기서는 간단히 crypto.randomUUID() 사용 (최신 브라우저) 또는 uuid 라이브러리 사용.
        // store 파일에는 uuid import가 없으므로, insert 후 반환값을 사용하는 방식으로 변경.

        const newVariablePayload = {
            item_id: targetItemId,
            name: sourceVariable.name,
            type: sourceVariable.type,
            default_value: sourceVariable.defaultValue,
            description: sourceVariable.description,
            is_imported: true,
            is_return: false,
            source_item_id: rootSourceItemId,
            source_id: rootSourceId,
        };

        const { data, error } = await supabase
            .from('variables')
            .insert(newVariablePayload)
            .select()
            .single();

        if (error || !data) {
            console.error('Error importing variable:', error);
            return;
        }

        const importedVariable = mapVariableFromDb(data);
        set((state) => ({ variables: [importedVariable, ...state.variables] }));
    },

    // Function Actions
    addFunction: async (func) => {
        const { error } = await supabase.from('functions').insert(mapFunctionToDb(func));
        if (error) {
            console.error('Error adding function:', error);
            return;
        }
        set((state) => ({ functions: [func, ...state.functions] }));
    },

    updateFunction: async (id, updatedFunction) => {
        const currentFunction = get().getFunctionById(id);
        if (!currentFunction) return;

        // 1. Update the specific function (including isReturn)
        const { error } = await supabase
            .from('functions')
            .update(mapFunctionToDb({ ...currentFunction, ...updatedFunction }))
            .eq('id', id);

        if (error) {
            console.error('Error updating function:', error);
            return;
        }

        // 2. Propagate changes to related functions (excluding isReturn)
        const rootSourceId = currentFunction.isImported && currentFunction.sourceId
            ? currentFunction.sourceId
            : id;

        const sharedUpdates = {
            name: updatedFunction.name,
            return_type: updatedFunction.returnType,
            parameters: updatedFunction.parameters,
            description: updatedFunction.description,
            updated_at: new Date().toISOString(),
        };

        const { error: syncError } = await supabase
            .from('functions')
            .update(sharedUpdates)
            .or(`id.eq.${rootSourceId},source_id.eq.${rootSourceId}`)
            .neq('id', id);

        if (syncError) {
            console.error('Error syncing related functions:', syncError);
        }

        // 3. Update local state
        set((state) => ({
            functions: state.functions.map((f) => {
                if (f.id === id) {
                    return { ...f, ...updatedFunction };
                }
                const isRelated = f.id === rootSourceId || f.sourceId === rootSourceId;
                if (isRelated) {
                    return {
                        ...f,
                        name: updatedFunction.name ?? f.name,
                        returnType: updatedFunction.returnType ?? f.returnType,
                        parameters: updatedFunction.parameters ?? f.parameters,
                        description: updatedFunction.description ?? f.description,
                    };
                }
                return f;
            }),
        }));
    },

    deleteFunction: async (id) => {
        const functionToDelete = get().functions.find((f) => f.id === id);
        if (!functionToDelete) return;

        const isOriginal = !functionToDelete.isImported;

        await supabase.from('functions').delete().eq('id', id);

        if (isOriginal) {
            await supabase.from('functions').delete().eq('source_id', id);
        }

        set((state) => ({
            functions: state.functions.filter((f) => {
                if (f.id === id) return false;
                if (isOriginal && f.isImported && f.sourceId === id) return false;
                return true;
            }),
        }));
    },

    getFunctionsByItemId: (itemId) => get().functions.filter((f) => f.itemId === itemId),
    getFunctionById: (id) => get().functions.find((f) => f.id === id),

    importFunction: async (functionId, targetItemId) => {
        const sourceFunction = get().functions.find((f) => f.id === functionId);
        if (!sourceFunction) return;

        const rootSourceId = sourceFunction.isImported && sourceFunction.sourceId
            ? sourceFunction.sourceId
            : functionId;

        const rootSourceItemId = sourceFunction.isImported && sourceFunction.sourceItemId
            ? sourceFunction.sourceItemId
            : sourceFunction.itemId;

        const newFunctionPayload = {
            item_id: targetItemId,
            name: sourceFunction.name,
            return_type: sourceFunction.returnType,
            parameters: sourceFunction.parameters,
            description: sourceFunction.description,
            is_imported: true,
            is_return: false,
            source_item_id: rootSourceItemId,
            source_id: rootSourceId,
        };

        const { data, error } = await supabase
            .from('functions')
            .insert(newFunctionPayload)
            .select()
            .single();

        if (error || !data) {
            console.error('Error importing function:', error);
            return;
        }

        const importedFunction = mapFunctionFromDb(data);
        set((state) => ({ functions: [importedFunction, ...state.functions] }));
    },

    // Object Actions
    addObject: async (obj) => {
        const { error } = await supabase.from('objects').insert(mapObjectToDb(obj));
        if (error) {
            console.error('Error adding object:', error);
            return;
        }
        set((state) => ({ objects: [obj, ...state.objects] }));
    },

    updateObject: async (id, updatedObject) => {
        const currentObject = get().getObjectById(id);
        if (!currentObject) return;

        // 1. Update the specific object (including isReturn)
        const { error } = await supabase
            .from('objects')
            .update(mapObjectToDb({ ...currentObject, ...updatedObject }))
            .eq('id', id);

        if (error) {
            console.error('Error updating object:', error);
            return;
        }

        // 2. Propagate changes to related objects (excluding isReturn)
        const rootSourceId = currentObject.isImported && currentObject.sourceId
            ? currentObject.sourceId
            : id;

        const sharedUpdates = {
            name: updatedObject.name,
            type: updatedObject.type,
            properties: updatedObject.properties,
            description: updatedObject.description,
            updated_at: new Date().toISOString(),
        };

        const { error: syncError } = await supabase
            .from('objects')
            .update(sharedUpdates)
            .or(`id.eq.${rootSourceId},source_id.eq.${rootSourceId}`)
            .neq('id', id);

        if (syncError) {
            console.error('Error syncing related objects:', syncError);
        }

        // 3. Update local state
        set((state) => ({
            objects: state.objects.map((o) => {
                if (o.id === id) {
                    return { ...o, ...updatedObject };
                }
                const isRelated = o.id === rootSourceId || o.sourceId === rootSourceId;
                if (isRelated) {
                    return {
                        ...o,
                        name: updatedObject.name ?? o.name,
                        type: updatedObject.type ?? o.type,
                        properties: updatedObject.properties ?? o.properties,
                        description: updatedObject.description ?? o.description,
                    };
                }
                return o;
            }),
        }));
    },

    deleteObject: async (id) => {
        const objectToDelete = get().objects.find((o) => o.id === id);
        if (!objectToDelete) return;

        const isOriginal = !objectToDelete.isImported;

        await supabase.from('objects').delete().eq('id', id);

        if (isOriginal) {
            await supabase.from('objects').delete().eq('source_id', id);
        }

        set((state) => ({
            objects: state.objects.filter((o) => {
                if (o.id === id) return false;
                if (isOriginal && o.isImported && o.sourceId === id) return false;
                return true;
            }),
        }));
    },

    getObjectsByItemId: (itemId) => get().objects.filter((o) => o.itemId === itemId),
    getObjectById: (id) => get().objects.find((o) => o.id === id),

    importObject: async (objectId, targetItemId) => {
        const sourceObject = get().objects.find((o) => o.id === objectId);
        if (!sourceObject) return;

        const rootSourceId = sourceObject.isImported && sourceObject.sourceId
            ? sourceObject.sourceId
            : objectId;

        const rootSourceItemId = sourceObject.isImported && sourceObject.sourceItemId
            ? sourceObject.sourceItemId
            : sourceObject.itemId;

        const newObjectPayload = {
            item_id: targetItemId,
            name: sourceObject.name,
            type: sourceObject.type,
            properties: sourceObject.properties,
            description: sourceObject.description,
            is_imported: true,
            is_return: false,
            source_item_id: rootSourceItemId,
            source_id: rootSourceId,
        };

        const { data, error } = await supabase
            .from('objects')
            .insert(newObjectPayload)
            .select()
            .single();

        if (error || !data) {
            console.error('Error importing object:', error);
            return;
        }

        const importedObject = mapObjectFromDb(data);
        set((state) => ({ objects: [importedObject, ...state.objects] }));
    },

    // Effect Actions
    addEffect: async (effect) => {
        const { error } = await supabase.from('effects').insert(mapEffectToDb(effect));
        if (error) {
            console.error('Error adding effect:', error);
            return;
        }
        set((state) => ({ effects: [effect, ...state.effects] }));
    },

    updateEffect: async (id, updatedEffect) => {
        const { error } = await supabase
            .from('effects')
            .update(mapEffectToDb({ ...get().getEffectById(id)!, ...updatedEffect }))
            .eq('id', id);

        if (error) {
            console.error('Error updating effect:', error);
            return;
        }

        set((state) => ({
            effects: state.effects.map((e) =>
                e.id === id ? { ...e, ...updatedEffect } : e
            ),
        }));
    },

    deleteEffect: async (id) => {
        const effectToDelete = get().effects.find((e) => e.id === id);
        if (!effectToDelete) return;

        const isOriginal = !effectToDelete.isImported;

        await supabase.from('effects').delete().eq('id', id);

        if (isOriginal) {
            await supabase.from('effects').delete().eq('source_id', id);
        }

        set((state) => ({
            effects: state.effects.filter((e) => {
                if (e.id === id) return false;
                if (isOriginal && e.isImported && e.sourceId === id) return false;
                return true;
            }),
        }));
    },

    getEffectsByItemId: (itemId) => get().effects.filter((e) => e.itemId === itemId),
    getEffectById: (id) => get().effects.find((e) => e.id === id),

    importEffect: async (effectId, targetItemId) => {
        const sourceEffect = get().effects.find((e) => e.id === effectId);
        if (!sourceEffect) return;

        const rootSourceId = sourceEffect.isImported && sourceEffect.sourceId
            ? sourceEffect.sourceId
            : effectId;

        const rootSourceItemId = sourceEffect.isImported && sourceEffect.sourceItemId
            ? sourceEffect.sourceItemId
            : sourceEffect.itemId;

        const newEffectPayload = {
            item_id: targetItemId,
            dependencies: sourceEffect.dependencies,
            code: sourceEffect.code,
            description: sourceEffect.description,
            is_imported: true,
            source_item_id: rootSourceItemId,
            source_id: rootSourceId,
        };

        const { data, error } = await supabase
            .from('effects')
            .insert(newEffectPayload)
            .select()
            .single();

        if (error || !data) {
            console.error('Error importing effect:', error);
            return;
        }

        const importedEffect = mapEffectFromDb(data);
        set((state) => ({ effects: [importedEffect, ...state.effects] }));
    },

    getAllVariables: () => get().variables,
    getAllFunctions: () => get().functions,
    getAllObjects: () => get().objects,
    getAllEffects: () => get().effects,
}));

// Mappers
function mapVariableFromDb(dbItem: any): Variable {
    return {
        id: dbItem.id,
        itemId: dbItem.item_id,
        name: dbItem.name,
        type: dbItem.type,
        defaultValue: dbItem.default_value,
        description: dbItem.description,
        isImported: dbItem.is_imported,
        isReturn: dbItem.is_return,
        sourceItemId: dbItem.source_item_id,
        sourceId: dbItem.source_id,
        createdAt: new Date(dbItem.created_at),
        updatedAt: new Date(dbItem.updated_at),
    };
}

function mapVariableToDb(item: Variable) {
    return {
        id: item.id,
        item_id: item.itemId,
        name: item.name,
        type: item.type,
        default_value: item.defaultValue,
        description: item.description,
        is_imported: item.isImported,
        is_return: item.isReturn,
        source_item_id: item.sourceItemId,
        source_id: item.sourceId,
        created_at: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updated_at: new Date().toISOString(),
    };
}

function mapFunctionFromDb(dbItem: any): FunctionItem {
    return {
        id: dbItem.id,
        itemId: dbItem.item_id,
        name: dbItem.name,
        returnType: dbItem.return_type,
        parameters: dbItem.parameters,
        description: dbItem.description,
        isImported: dbItem.is_imported,
        isReturn: dbItem.is_return,
        sourceItemId: dbItem.source_item_id,
        sourceId: dbItem.source_id,
        createdAt: new Date(dbItem.created_at),
        updatedAt: new Date(dbItem.updated_at),
    };
}

function mapFunctionToDb(item: FunctionItem) {
    return {
        id: item.id,
        item_id: item.itemId,
        name: item.name,
        return_type: item.returnType,
        parameters: item.parameters,
        description: item.description,
        is_imported: item.isImported,
        is_return: item.isReturn,
        source_item_id: item.sourceItemId,
        source_id: item.sourceId,
        created_at: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updated_at: new Date().toISOString(),
    };
}

function mapObjectFromDb(dbItem: any): ObjectItem {
    return {
        id: dbItem.id,
        itemId: dbItem.item_id,
        name: dbItem.name,
        type: dbItem.type,
        properties: dbItem.properties,
        description: dbItem.description,
        isImported: dbItem.is_imported,
        isReturn: dbItem.is_return,
        sourceItemId: dbItem.source_item_id,
        sourceId: dbItem.source_id,
        createdAt: new Date(dbItem.created_at),
        updatedAt: new Date(dbItem.updated_at),
    };
}

function mapObjectToDb(item: ObjectItem) {
    return {
        id: item.id,
        item_id: item.itemId,
        name: item.name,
        type: item.type,
        properties: item.properties,
        description: item.description,
        is_imported: item.isImported,
        is_return: item.isReturn,
        source_item_id: item.sourceItemId,
        source_id: item.sourceId,
        created_at: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updated_at: new Date().toISOString(),
    };
}

function mapEffectFromDb(dbItem: any): EffectItem {
    return {
        id: dbItem.id,
        itemId: dbItem.item_id,
        dependencies: dbItem.dependencies,
        code: dbItem.code,
        description: dbItem.description,
        isImported: dbItem.is_imported,
        sourceItemId: dbItem.source_item_id,
        sourceId: dbItem.source_id,
        createdAt: new Date(dbItem.created_at),
        updatedAt: new Date(dbItem.updated_at),
    };
}

function mapEffectToDb(item: EffectItem) {
    return {
        id: item.id,
        item_id: item.itemId,
        dependencies: item.dependencies,
        code: item.code,
        description: item.description,
        is_imported: item.isImported,
        source_item_id: item.sourceItemId,
        source_id: item.sourceId,
        created_at: item.createdAt instanceof Date ? item.createdAt.toISOString() : item.createdAt,
        updated_at: new Date().toISOString(),
    };
}
