'use client';

import { useUiStore } from '@/store/uiStore';
import { useItemStore } from '@/store/itemStore';
import { getCategoryInfo } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Edit, Trash2 } from 'lucide-react';

export function MainContent() {
    const { selectedCategory, selectedItemId, openForm } = useUiStore();
    const { getItemById, deleteItem } = useItemStore();

    if (!selectedCategory) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-6xl mb-4">📁</p>
                    <h2 className="text-2xl font-bold mb-2">프로젝트 관리 시스템</h2>
                    <p className="text-muted-foreground">
                        좌측에서 카테고리를 선택하여 시작하세요
                    </p>
                </div>
            </div>
        );
    }

    if (!selectedItemId) {
        const categoryInfo = getCategoryInfo(selectedCategory);
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-6xl mb-4">{categoryInfo.icon}</p>
                    <h2 className="text-2xl font-bold mb-2">{categoryInfo.name}</h2>
                    <p className="text-muted-foreground">
                        목록에서 아이템을 선택하거나 새로 만들어보세요
                    </p>
                </div>
            </div>
        );
    }

    const item = getItemById(selectedCategory, selectedItemId);

    if (!item) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                    <p className="text-6xl mb-4">❌</p>
                    <h2 className="text-2xl font-bold mb-2">아이템을 찾을 수 없습니다</h2>
                    <p className="text-muted-foreground">
                        다른 아이템을 선택해주세요
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
        if (confirm('정말 삭제하시겠습니까?')) {
            deleteItem(selectedCategory, selectedItemId);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-background">
            {/* 헤더 */}
            <div className="border-b p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                variant="secondary"
                                style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
                            >
                                {categoryInfo.icon} {categoryInfo.name}
                            </Badge>
                            {item.tags && item.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                        <p className="text-muted-foreground">{item.description}</p>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                        </Button>
                    </div>
                </div>
            </div>

            {/* 내용 */}
            <ScrollArea className="flex-1">
                <div className="p-6">
                    {/* 공통 정보 섹션 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="생성일" value={new Date(item.createdAt).toLocaleString('ko-KR')} />
                            <InfoItem label="수정일" value={new Date(item.updatedAt).toLocaleString('ko-KR')} />
                            {item.createdBy && <InfoItem label="작성자" value={item.createdBy} />}
                        </div>
                    </section>

                    <Separator className="my-6" />

                    {/* 카테고리별 특화 정보 */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">상세 정보</h2>
                        <div className="bg-muted/30 rounded-lg p-6">
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(item, null, 2)}
                            </pre>
                        </div>
                    </section>
                </div>
            </ScrollArea>
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
            <dt className="text-sm font-medium text-muted-foreground mb-1">{label}</dt>
            <dd className="text-sm">{value}</dd>
        </div>
    );
}
