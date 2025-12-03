'use client';

import { useUiStore } from '@/store/uiStore';
import { useItemStore } from '@/store/itemStore';
import { useDetailStore } from '@/store/detailStore';
import { getCategoryInfo } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2, Plus, FolderOpen, Layers, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MainContent() {
    const { selectedCategory, selectedItemId, openForm, openDetailForm, openImportDialog } = useUiStore();
    const { getItemById, deleteItem } = useItemStore();
    const {
        getVariablesByItemId,
        getFunctionsByItemId,
        getObjectsByItemId,
        deleteVariable,
        deleteFunction,
        deleteObject,
        getEffectsByItemId,
        deleteEffect,
    } = useDetailStore();

    if (!selectedCategory) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center p-8">
                    <FolderOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
                    <h2 className="text-xl font-semibold mb-2 text-foreground">Project Management System</h2>
                    <p className="text-sm text-muted-foreground">
                        Select a category from the sidebar to get started
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedItemId) {
        const categoryInfo = getCategoryInfo(selectedCategory);
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center p-8">
                    <div className="h-16 w-16 mx-auto mb-4 flex items-center justify-center text-muted-foreground/40">
                        {categoryInfo.icon}
                    </div>
                    <h2 className="text-xl font-semibold mb-2 text-foreground">{categoryInfo.name}</h2>
                    <p className="text-sm text-muted-foreground">
                        Select an item from the list or create a new one
                    </p>
                </div>
            </div>
        );
    }

    const item = getItemById(selectedItemId);

    if (!item) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-6xl mb-4">❌</p>
                    <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
                    <p className="text-muted-foreground">
                        Please select another item
                    </p>
                </div>
            </div>
        );
    }

    const categoryInfo = getCategoryInfo(item.category);

    const handleEdit = () => {
        openForm('edit');
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this?')) {
            deleteItem(selectedItemId);
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="border-b p-4 flex-shrink-0">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                variant="secondary"
                                className="text-[10px] px-1 py-0 h-5 font-normal"
                            >
                                {categoryInfo.icon} <span className="ml-1">{categoryInfo.name}</span>
                            </Badge>
                            {item.tags && item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-5 font-normal">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-xl font-bold mb-1">{item.title}</h1>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEdit} className="h-7 text-xs px-2">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete} className="h-7 text-xs px-2">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-4">
                    {/* Common Info Section */}
                    <section className="mb-6">
                        <h2 className="text-sm font-semibold mb-3">Basic Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Created At" value={new Date(item.createdAt).toLocaleString('en-US')} />
                            <InfoItem label="Updated At" value={new Date(item.updatedAt).toLocaleString('en-US')} />
                            {item.createdBy && <InfoItem label="Created By" value={item.createdBy} />}
                        </div>
                    </section>

                    <Separator className="my-4" />



                    {/* Resource Tabs */}
                    <Tabs defaultValue="variable" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="variable" className="flex items-center gap-2">
                                Variables
                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] min-w-[20px] justify-center">
                                    {getVariablesByItemId(selectedItemId).length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="function" className="flex items-center gap-2">
                                Functions
                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] min-w-[20px] justify-center">
                                    {getFunctionsByItemId(selectedItemId).length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="object" className="flex items-center gap-2">
                                Objects
                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] min-w-[20px] justify-center">
                                    {getObjectsByItemId(selectedItemId).length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="effect" className="flex items-center gap-2">
                                useEffect
                                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] min-w-[20px] justify-center">
                                    {getEffectsByItemId(selectedItemId).length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="variable" className="mt-0">
                            <DetailSection
                                title=""
                                items={getVariablesByItemId(selectedItemId)}
                                onAdd={() => openDetailForm('variable', 'create')}
                                onImport={() => openImportDialog('variable')}
                                onEdit={(id) => openDetailForm('variable', 'edit', id)}
                                onDelete={deleteVariable}
                                renderItem={(v) => `${v.name}: ${v.type}${v.defaultValue ? ` = ${v.defaultValue}` : ''}`}
                            />
                        </TabsContent>

                        <TabsContent value="function" className="mt-0">
                            <DetailSection
                                title=""
                                items={getFunctionsByItemId(selectedItemId)}
                                onAdd={() => openDetailForm('function', 'create')}
                                onImport={() => openImportDialog('function')}
                                onEdit={(id) => openDetailForm('function', 'edit', id)}
                                onDelete={deleteFunction}
                                renderItem={(f) => `${f.name}(): ${f.returnType}`}
                            />
                        </TabsContent>

                        <TabsContent value="object" className="mt-0">
                            <DetailSection
                                title=""
                                items={getObjectsByItemId(selectedItemId)}
                                onAdd={() => openDetailForm('object', 'create')}
                                onImport={() => openImportDialog('object')}
                                onEdit={(id) => openDetailForm('object', 'edit', id)}
                                onDelete={deleteObject}
                                renderItem={(o) => `${o.name} (${o.type})`}
                            />
                        </TabsContent>

                        <TabsContent value="effect" className="mt-0">
                            <DetailSection
                                title=""
                                items={getEffectsByItemId(selectedItemId)}
                                onAdd={() => openDetailForm('effect', 'create')}
                                onImport={() => openImportDialog('effect')}
                                onEdit={(id) => openDetailForm('effect', 'edit', id)}
                                onDelete={deleteEffect}
                                renderItem={(e: any) => `useEffect(${e.dependencies})`}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

interface InfoItemProps {
    label: string;
    value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div>
            <dt className="text-xs font-medium text-muted-foreground mb-1">{label}</dt>
            <dd className="text-xs">{value}</dd>
        </div>
    );
}

interface DetailSectionProps<T extends { id: string; name?: string; description?: string; isImported?: boolean; isReturn?: boolean; sourceItemId?: string }> {
    title: string;
    items: T[];
    onAdd: () => void;
    onImport: () => void;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    renderItem: (item: T) => string;
}

function DetailSection<T extends { id: string; name?: string; description?: string; isImported?: boolean; isReturn?: boolean; sourceItemId?: string }>({
    title,
    items,
    onAdd,
    onImport,
    onDelete,
    onEdit,
    renderItem,
}: DetailSectionProps<T>) {
    const { getItemById } = useItemStore();

    return (
        <section>
            <div className="flex items-center justify-between mb-3">
                {title ? <h2 className="text-sm font-semibold">{title}</h2> : <div></div>}
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onImport}
                        className="h-6 text-xs px-2"
                    >
                        <Download className="h-3 w-3 mr-1" />
                        Import
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onAdd}
                        className="h-6 text-xs px-2"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                    </Button>
                </div>
            </div>
            {items.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-4 bg-muted/20 rounded-md">
                    No items found
                </div>
            ) : (
                <div className="space-y-1">
                    {items.map((item) => {
                        const sourceItem = item.isImported && item.sourceItemId ? getItemById(item.sourceItemId) : null;

                        return (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer ${item.isImported
                                    ? 'bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-800'
                                    : 'bg-muted/20 hover:bg-muted/30'
                                    }`}
                                onClick={() => onEdit(item.id)}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs font-medium">{renderItem(item)}</div>
                                        {item.isReturn && (
                                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700">
                                                Return
                                            </Badge>
                                        )}
                                        {item.isImported && (
                                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700">
                                                <Download className="h-2 w-2 mr-0.5" />
                                                {sourceItem ? sourceItem.title : 'Imported'}
                                            </Badge>
                                        )}
                                    </div>
                                    {item.description && (
                                        <div className="text-[10px] text-muted-foreground mt-0.5">
                                            {item.description}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm('Are you sure you want to delete this?')) {
                                            onDelete(item.id);
                                        }
                                    }}
                                    className="h-6 w-6 p-0 ml-2"
                                >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
