import { ReactNode } from 'react';
import { CategoryType, CategoryInfo } from './types';
import {
    Monitor,
    Plug,
    Database,
    FileCode,
    Webhook,
    Search,
    Package,
    Wrench,
} from "lucide-react";

export const CATEGORIES: CategoryInfo[] = [
    {
        id: 'screen',
        name: 'Screen',
        icon: <Monitor className="h-full w-full" />,
        color: 'blue',
    },
    {
        id: 'api',
        name: 'API',
        icon: <Plug className="h-full w-full" />,
        color: 'green',
    },
    {
        id: 'db',
        name: 'Database',
        icon: <Database className="h-full w-full" />,
        color: 'purple',
    },
    {
        id: 'sql',
        name: 'SQL',
        icon: <FileCode className="h-full w-full" />,
        color: 'orange',
    },
    {
        id: 'hook',
        name: 'Hook',
        icon: <Webhook className="h-full w-full" />,
        color: 'pink',
    },
    {
        id: 'query',
        name: 'Query',
        icon: <Search className="h-full w-full" />,
        color: 'cyan',
    },
    {
        id: 'store',
        name: 'Store',
        icon: <Package className="h-full w-full" />,
        color: 'indigo',
    },
    {
        id: 'util',
        name: 'Utility',
        icon: <Wrench className="h-full w-full" />,
        color: 'yellow',
    },
];

export const getCategoryInfo = (categoryId: CategoryType): CategoryInfo => {
    const category = CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) {
        throw new Error(`Category not found: ${categoryId}`);
    }
    return category;
};

export const getCategoryColor = (categoryId: CategoryType): string => {
    return getCategoryInfo(categoryId).color;
};

export const getCategoryIcon = (categoryId: CategoryType): ReactNode => {
    return getCategoryInfo(categoryId).icon;
};
