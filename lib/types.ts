import { ReactNode } from 'react';

// 카테고리 타입
export type CategoryType =
  | 'screen'
  | 'api'
  | 'db'
  | 'sql'
  | 'hook'
  | 'query'
  | 'store'
  | 'util'
  | 'component';

// 카테고리 정보
export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: ReactNode;
  color: string;
}

// ============================================
// 사용자 타입
// ============================================

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ============================================
// 프로젝트 타입
// ============================================

export interface Project {
  id: string;
  userId: string; // 프로젝트 소유자
  name: string;
  description: string;
  sharedWith?: string[]; // 공유된 사용자 ID 목록
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// ============================================
// 아이템 타입
// ============================================

// 통합된 단일 아이템 타입
export interface ProjectItem {
  id: string;
  projectId: string;
  category: CategoryType;
  title: string;
  description: string;
  status?: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  details?: Record<string, any>; // JSONB 필드 (유연한 상세 정보)
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// 기존 AnyItem 타입을 ProjectItem으로 대체
export type AnyItem = ProjectItem;

// ============================================
// 아이템 상세 정보 타입들 (변수, 함수, 객체)
// ============================================

// 변수
export interface Variable {
  id: string;
  itemId: string; // 어떤 아이템에 속하는지
  name: string;
  type: string; // 데이터 타입 (string, number, boolean 등)
  defaultValue?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 함수
export interface FunctionItem {
  id: string;
  itemId: string;
  name: string;
  returnType: string;
  parameters?: string; // 파라미터 설명 (간단하게 문자열로)
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 객체
export interface ObjectItem {
  id: string;
  itemId: string;
  name: string;
  type: string; // 객체 타입 (class, interface, type 등)
  properties?: string; // 속성 설명
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
