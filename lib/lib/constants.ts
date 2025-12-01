import { CategoryType, CategoryInfo } from './types';

// 카테고리 정보
export const CATEGORIES: CategoryInfo[] = [
    {
        id: 'screen',
        name: '화면',
        icon: '🖥️',
        color: '#3b82f6', // Blue
    },
    {
        id: 'api',
        name: 'API',
        icon: '🔌',
        color: '#10b981', // Green
    },
    {
        id: 'db',
        name: 'DB',
        icon: '🗄️',
        color: '#f59e0b', // Amber
    },
    {
        id: 'sql',
        name: 'SQL',
        icon: '📊',
        color: '#8b5cf6', // Purple
    },
    {
        id: 'hook',
        name: 'Hook',
        icon: '🪝',
        color: '#ec4899', // Pink
    },
    {
        id: 'query',
        name: 'Query',
        icon: '🔍',
        color: '#06b6d4', // Cyan
    },
    {
        id: 'store',
        name: 'Store',
        icon: '💾',
        color: '#f97316', // Orange
    },
    {
        id: 'util',
        name: 'Util',
        icon: '🛠️',
        color: '#6366f1', // Indigo
    },
];

// 카테고리 ID로 정보 가져오기
export const getCategoryInfo = (categoryId: CategoryType): CategoryInfo => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) {
        throw new Error(`Category not found: ${categoryId}`);
    }
    return category;
};

// 카테고리 색상 가져오기
export const getCategoryColor = (categoryId: CategoryType): string => {
    return getCategoryInfo(categoryId).color;
};

// 카테고리 아이콘 가져오기
export const getCategoryIcon = (categoryId: CategoryType): string => {
    return getCategoryInfo(categoryId).icon;
};
