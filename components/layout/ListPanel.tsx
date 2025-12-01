'use client';

import { useUiStore } from '@/store/uiStore';
import { useItemStore } from '@/store/itemStore';
import { getCategoryInfo } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Plus, Search, ChevronRight, FileText } from 'lucide-react';
import { AnyItem } from '@/lib/types';

export function ListPanel() {
    const { selectedCategory, selectedItemId, currentProjectId, setSelectedItemId, openForm } = useUiStore();
    const { getItemsByCategory } = useItemStore();

    if (!selectedCategory || !currentProjectId) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background">
                <div className="text-center p-8">
                    <ChevronRight className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">카테고리를 선택하세요</p>
                </div>
            </div>
        );
    }

    const categoryInfo = getCategoryInfo(selectedCategory);
    const items = getItemsByCategory(selectedCategory, currentProjectId);

    console.log('ListPanel - Category:', selectedCategory, 'ProjectId:', currentProjectId);
    console.log('ListPanel - Items:', items);

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleNewItem = () => {
        openForm('create');
    };

    return (
        <div className="h-full w-full flex flex-col bg-background">
            {/* 헤더 */}
            <div className="p-2 border-b">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryInfo.icon}</span>
                        <h2 className="text-sm font-semibold">{categoryInfo.name}</h2>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleNewItem}
                        className="h-6 w-6 p-0"
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>

                {/* 검색바 */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="검색..."
                        className="w-full pl-7 pr-2 py-1 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {/* 아이템 목록 */}
            <ScrollArea className="flex-1">
                {items.length === 0 ? (
                    <div className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                        <p className="text-xs text-muted-foreground">아이템이 없습니다</p>
                    </div>
                ) : (
                    <div className="p-1">
                        {items.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                isSelected={selectedItemId === item.id}
                                onClick={() => handleItemClick(item.id)}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

interface ItemCardProps {
    item: AnyItem;
    isSelected: boolean;
    onClick: () => void;
}

function ItemCard({ item, isSelected, onClick }: ItemCardProps) {
    const categoryInfo = getCategoryInfo(item.category);

    return (
        <div
            onClick={onClick}
            className={cn(
                "p-2 mb-1 rounded-md border cursor-pointer transition-all hover:shadow-sm",
                isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card hover:bg-accent"
            )}
        >
            {/* 카테고리 뱃지 */}
            <div className="flex items-center gap-1 mb-1">
                <Badge
                    variant="secondary"
                    className="text-[10px] px-1 py-0 h-4 font-normal"
                >
                    {categoryInfo.icon} <span className="ml-1">{categoryInfo.name}</span>
                </Badge>
            </div>

            {/* 제목 */}
            <h3 className="font-medium text-xs mb-0.5 line-clamp-1">
                {item.title}
            </h3>

            {/* 설명 */}
            <p className="text-[10px] text-muted-foreground line-clamp-2 mb-1">
                {item.description}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                {item.createdBy && <span>{item.createdBy}</span>}
            </div>
        </div>
    );
}
