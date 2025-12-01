'use client';

import { CATEGORIES } from '@/lib/constants';
import { useUiStore } from '@/store/uiStore';
import { CategoryType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function Sidebar() {
    const { selectedCategory, setSelectedCategory } = useUiStore();

    const handleCategoryClick = (categoryId: CategoryType) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="w-20 border-r bg-background flex flex-col items-center py-4 gap-2">
            {/* 로고/타이틀 */}
            <div className="mb-4 text-2xl font-bold">
                📁
            </div>

            <Separator className="w-12" />

            {/* 카테고리 아이콘 버튼들 */}
            <div className="flex flex-col gap-2 mt-4">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={cn(
                            "w-14 h-14 rounded-lg flex items-center justify-center text-2xl transition-all hover:scale-110",
                            "hover:shadow-md",
                            selectedCategory === category.id
                                ? "bg-primary text-primary-foreground shadow-lg scale-110"
                                : "bg-secondary hover:bg-secondary/80"
                        )}
                        title={category.name}
                        style={{
                            backgroundColor: selectedCategory === category.id ? category.color : undefined,
                        }}
                    >
                        {category.icon}
                    </button>
                ))}
            </div>

            {/* 하단 아이콘들 */}
            <div className="mt-auto flex flex-col gap-2">
                <Separator className="w-12 mb-2" />
                <button
                    className="w-14 h-14 rounded-lg flex items-center justify-center text-xl bg-secondary hover:bg-secondary/80 transition-all hover:scale-110"
                    title="Settings"
                >
                    ⚙️
                </button>
            </div>
        </div>
    );
}
