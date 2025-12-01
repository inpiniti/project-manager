// 카테고리 타입
export type CategoryType = 
  | 'screen' 
  | 'api' 
  | 'db' 
  | 'sql' 
  | 'hook' 
  | 'query' 
  | 'store' 
  | 'util';

// 카테고리 정보
export interface CategoryInfo {
  id: CategoryType;
  name: string;
  icon: string;
  color: string;
}

// 공통 필드
export interface BaseItem {
  id: string;
  category: CategoryType;
  title: string;
  description: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

// 파라미터 (공통)
export interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

// 1. 화면 (Screen)
export interface Variable {
  name: string;
  type: string;
  defaultValue?: string;
  description?: string;
}

export interface Function {
  name: string;
  parameters: Parameter[];
  returnType: string;
  description?: string;
}

export interface ScreenItem extends BaseItem {
  category: 'screen';
  path: string;
  componentName: string;
  variables: Variable[];
  functions: Function[];
  dependencies: string[];
}

// 2. API
export interface Header {
  key: string;
  value: string;
  required: boolean;
  description?: string;
}

export interface InputField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: string;
}

export interface OutputField {
  name: string;
  type: string;
  description?: string;
  example?: string;
}

export interface ApiItem extends BaseItem {
  category: 'api';
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Header[];
  input: InputField[];
  output: OutputField[];
  authentication?: string;
  rateLimit?: string;
}

// 3. DB
export interface DbField {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Index {
  name: string;
  fields: string[];
  unique: boolean;
}

export interface Relation {
  field: string;
  referencedTable: string;
  referencedField: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}

export interface DbItem extends BaseItem {
  category: 'db';
  tableName: string;
  fields: DbField[];
  indexes?: Index[];
  relations?: Relation[];
}

// 4. SQL
export interface SqlParameter {
  name: string;
  type: string;
  description?: string;
}

export interface SqlItem extends BaseItem {
  category: 'sql';
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'PROCEDURE' | 'FUNCTION';
  sqlContent: string;
  parameters?: SqlParameter[];
  returns?: string;
  relatedTables: string[];
  performance?: string;
}

// 5. Hook
export interface ReturnValue {
  name: string;
  type: string;
  description?: string;
}

export interface HookItem extends BaseItem {
  category: 'hook';
  hookName: string;
  parameters: Parameter[];
  returns: ReturnValue[];
  dependencies: string[];
  example?: string;
}

// 6. Query (React Query)
export interface QueryItem extends BaseItem {
  category: 'query';
  queryKey: string[];
  queryFn: string;
  apiEndpoint: string;
  staleTime?: number;
  cacheTime?: number;
  enabled?: string;
  onSuccess?: string;
  onError?: string;
}

// 7. Store (Zustand)
export interface StateField {
  name: string;
  type: string;
  initialValue?: string;
  description?: string;
}

export interface Action {
  name: string;
  parameters: Parameter[];
  description?: string;
}

export interface StoreItem extends BaseItem {
  category: 'store';
  storeName: string;
  states: StateField[];
  actions: Action[];
  persist?: boolean;
  middleware?: string[];
}

// 8. Util
export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface UtilItem extends BaseItem {
  category: 'util';
  functionName: string;
  parameters: Parameter[];
  returnType: string;
  example?: string;
  testCases?: TestCase[];
}

// 모든 아이템 타입의 유니온
export type AnyItem = 
  | ScreenItem 
  | ApiItem 
  | DbItem 
  | SqlItem 
  | HookItem 
  | QueryItem 
  | StoreItem 
  | UtilItem;
