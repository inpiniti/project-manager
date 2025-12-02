'use client';

import { useUiStore } from "@/store/uiStore";
import { useDetailStore } from "@/store/detailStore";
import { useItemStore } from "@/store/itemStore";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function ImportResourceSheet() {
    const {
        isImportDialogOpen,
        importResourceType,
        selectedItemId,
        closeImportDialog
    } = useUiStore();

    const {
        getAllVariables,
        getAllFunctions,
        getAllObjects,
        getAllEffects,
        importVariable,
        importFunction,
        importObject,
        importEffect,
    } = useDetailStore();

    const { getItemById } = useItemStore();

    const [searchQuery, setSearchQuery] = useState("");

    if (!selectedItemId || !importResourceType) return null;

    const getTitle = () => {
        switch (importResourceType) {
            case 'variable':
                return '변수 Import';
            case 'function':
                return '함수 Import';
            case 'object':
                return '객체 Import';
            case 'effect':
                return 'useEffect Import';
            default:
                return 'Import';
        }
    };

    const getResources = () => {
        let resources: any[] = [];
        switch (importResourceType) {
            case 'variable':
                resources = getAllVariables();
                break;
            case 'function':
                resources = getAllFunctions();
                break;
            case 'object':
                resources = getAllObjects();
                break;
            case 'effect':
                resources = getAllEffects();
                break;
        }

        // 현재 아이템의 리소스는 제외
        resources = resources.filter(r => r.itemId !== selectedItemId);

        // 검색 필터
        if (searchQuery) {
            resources = resources.filter(r =>
                (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (r.code && r.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
                r.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return resources;
    };

    const handleImport = (resourceId: string) => {
        switch (importResourceType) {
            case 'variable':
                importVariable(resourceId, selectedItemId);
                break;
            case 'function':
                importFunction(resourceId, selectedItemId);
                break;
            case 'object':
                importObject(resourceId, selectedItemId);
                break;
            case 'effect':
                importEffect(resourceId, selectedItemId);
                break;
        }
        closeImportDialog();
    };

    const resources = getResources();

    // 아이템별로 그룹화
    const groupedResources = resources.reduce((acc, resource) => {
        const itemId = resource.itemId;
        if (!acc[itemId]) {
            acc[itemId] = [];
        }
        acc[itemId].push(resource);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <Sheet open={isImportDialogOpen} onOpenChange={(open) => !open && closeImportDialog()}>
            <SheetContent className="sm:max-w-[600px] flex flex-col px-4">
                <SheetHeader>
                    <SheetTitle>{getTitle()}</SheetTitle>
                    <SheetDescription>
                        다른 아이템에서 생성된 리소스를 선택하여 import하세요.
                    </SheetDescription>
                </SheetHeader>

                {/* 검색 */}
                <div className="relative mt-4">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>

                {/* 리소스 목록 */}
                <ScrollArea className="flex-1 mt-4 -mx-4 px-4">
                    {Object.keys(groupedResources).length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Import 가능한 리소스가 없습니다.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(groupedResources).map(([itemId, resources]) => {
                                const item = getItemById(itemId);
                                if (!item) return null;

                                return (
                                    <div key={itemId}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-sm font-semibold">{item.title}</h3>
                                            <Badge variant="secondary" className="text-[10px]">
                                                {item.category}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            {(resources as any[]).map((resource) => (
                                                <div
                                                    key={resource.id}
                                                    className="flex items-center justify-between p-2 bg-muted/20 rounded-md hover:bg-muted/30 transition-colors"
                                                >
                                                    <div className="flex-1">
                                                        <div className="text-xs font-medium">{resource.name || `useEffect(${resource.dependencies})`}</div>
                                                        {resource.description && (
                                                            <div className="text-[10px] text-muted-foreground mt-0.5">
                                                                {resource.description}
                                                            </div>
                                                        )}
                                                        {resource.type && (
                                                            <div className="text-[10px] text-muted-foreground">
                                                                Type: {resource.type}
                                                            </div>
                                                        )}
                                                        {resource.returnType && (
                                                            <div className="text-[10px] text-muted-foreground">
                                                                Returns: {resource.returnType}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleImport(resource.id)}
                                                        className="h-7 text-xs px-2 ml-2"
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Import
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={closeImportDialog}>
                        닫기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
