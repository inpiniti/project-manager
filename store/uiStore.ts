import { create } from 'zustand';
import { CategoryType } from '@/lib/types';

type DetailFormType = 'variable' | 'function' | 'object' | 'effect' | null;
type ViewType = 'projectList' | 'projectDetail' | 'login';

interface UiStore {
    // 현재 뷰
    currentView: ViewType;

    // 현재 프로젝트
    currentProjectId: string | null;

    // 선택된 카테고리
    selectedCategory: CategoryType | null;

    // 선택된 아이템 ID
    selectedItemId: string | null;

    // 폼 상태 (아이템)
    isFormOpen: boolean;
    formMode: 'create' | 'edit';

    // 상세 정보 폼 상태 (변수/함수/객체)
    isDetailFormOpen: boolean;
    detailFormType: DetailFormType;
    detailFormMode: 'create' | 'edit';
    selectedDetailId: string | null; // 수정 시 사용

    // Import 다이얼로그 상태
    isImportDialogOpen: boolean;
    importResourceType: DetailFormType; // 어떤 타입의 리소스를 import할지

    // 프로젝트 폼 상태
    isProjectFormOpen: boolean;

    // 공유 폼 상태
    isShareFormOpen: boolean;
    shareProjectId: string | null;

    // 사이드바 상태 (모바일)
    isSidebarOpen: boolean;

    // Actions
    setCurrentView: (view: ViewType) => void;
    setCurrentProjectId: (id: string | null) => void;
    setSelectedCategory: (category: CategoryType | null) => void;
    setSelectedItemId: (id: string | null) => void;
    openForm: (mode: 'create' | 'edit') => void;
    closeForm: () => void;

    // 상세 정보 폼 액션
    openDetailForm: (type: DetailFormType, mode: 'create' | 'edit', detailId?: string) => void;
    closeDetailForm: () => void;

    // Import 다이얼로그 액션
    openImportDialog: (type: DetailFormType) => void;
    closeImportDialog: () => void;

    // 프로젝트 폼 액션
    openProjectForm: () => void;
    closeProjectForm: () => void;

    // 공유 폼 액션
    openShareForm: (projectId: string) => void;
    closeShareForm: () => void;

    toggleSidebar: () => void;
    setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    currentView: 'projectList',
    currentProjectId: null,
    selectedCategory: null,
    selectedItemId: null,
    isFormOpen: false,
    formMode: 'create',

    isDetailFormOpen: false,
    detailFormType: null,
    detailFormMode: 'create',
    selectedDetailId: null,

    isImportDialogOpen: false,
    importResourceType: null,

    isProjectFormOpen: false,

    isShareFormOpen: false,
    shareProjectId: null,

    isSidebarOpen: false,

    setCurrentView: (view) =>
        set({ currentView: view }),

    setCurrentProjectId: (id) =>
        set({ currentProjectId: id, selectedCategory: null, selectedItemId: null }),

    setSelectedCategory: (category) =>
        set({ selectedCategory: category, selectedItemId: null }),

    setSelectedItemId: (id) =>
        set({ selectedItemId: id }),

    openForm: (mode) =>
        set({ isFormOpen: true, formMode: mode }),

    closeForm: () =>
        set({ isFormOpen: false }),

    openDetailForm: (type, mode, detailId) =>
        set({
            isDetailFormOpen: true,
            detailFormType: type,
            detailFormMode: mode,
            selectedDetailId: detailId || null,
        }),

    closeDetailForm: () =>
        set({ isDetailFormOpen: false, detailFormType: null, selectedDetailId: null }),

    openImportDialog: (type) =>
        set({ isImportDialogOpen: true, importResourceType: type }),

    closeImportDialog: () =>
        set({ isImportDialogOpen: false, importResourceType: null }),

    openProjectForm: () =>
        set({ isProjectFormOpen: true }),

    closeProjectForm: () =>
        set({ isProjectFormOpen: false }),

    openShareForm: (projectId) =>
        set({ isShareFormOpen: true, shareProjectId: projectId }),

    closeShareForm: () =>
        set({ isShareFormOpen: false, shareProjectId: null }),

    toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

    setSidebarOpen: (isOpen) =>
        set({ isSidebarOpen: isOpen }),
}));
