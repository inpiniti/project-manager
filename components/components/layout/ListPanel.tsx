'use client';

import { useUiStore } from '@/store/uiStore';
import { useItemStore } from '@/store/itemStore';
import { getCategoryInfo } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Plus, Search } from 'lucide-react';
import { AnyItem } from '@/lib/types';

export function ListPanel() {
    const { selectedCategory, selectedItemId, setSelectedItemId, openForm } = useUiStore();
    const { getItemsByCategory } = useItemStore();

    if (!selectedCategory) {
        return (
            <div className="w-80 border-r bg-background flex items-center justify-center text-muted-foreground">
                <div className="text-center p-8">
                    <p className="text-lg">👈</p>
                    <p className="mt-2">카테고리를 선택하세요</p>
                </div>
            </div>
        );
    }

    const categoryInfo = getCategoryInfo(selectedCategory);
    const items = getItemsByCategory(selectedCategory);

    const handleItemClick = (itemId: string) => {
        setSelectedItemId(itemId);
    };

    const handleNewItem = () => {
        openForm('create');
    };

    return (
        <div className="w-80 border-r bg-background flex flex-col">
            {/* 헤더 */}
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">{categoryInfo.icon}</span>
                        <h2 className="text-xl font-bold">{categoryInfo.name}</h2>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleNewItem}
                        className="h-8 w-8 p-0"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                {/* 검색바 */}
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="검색..."
                        className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            {/* 아이템 목록 */}
            <ScrollArea className="flex-1">
                {items.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        <p className="text-4xl mb-2">📝</p>
                        <p className="text-sm">아이템이 없습니다</p>
                        <p className="text-xs mt-1">+ 버튼을 눌러 추가하세요</p>
                    </div>
                ) : (
                    <div className="p-2">
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
                "p-3 mb-2 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                isSelected
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "bg-card hover:bg-accent"
            )}
        >
            {/* 카테고리 뱃지 */}
            <div className="flex items-center gap-2 mb-2">
                <Badge
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                >
                    {categoryInfo.icon} {categoryInfo.name}
                </Badge>
            </div>

            {/* 제목 */}
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                {item.title}
            </h3>

            {/* 설명 */}
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                {item.description}
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>📅 {new Date(item.createdAt).toLocaleDateString('ko-KR')}</span>
                {item.createdBy && <span>👤 {item.createdBy}</span>}
            </div>
        </div>
    );
}
