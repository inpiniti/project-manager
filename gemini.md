# 프로젝트 관리 시스템 설계 문서

## 📋 프로젝트 개요

프로젝트 개발 과정에서 발생하는 다양한 리소스(화면, API, DB, SQL, Hook, Query, Store, Util)를 체계적으로 관리하기 위한 웹 기반 관리 시스템

### 기술 스택
- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Database**: TBD (로컬 스토리지 or 실제 DB)

---

## 🎨 UI/UX 설계

### 레이아웃 구조 (Mail App Style)

```
┌─────────────────────────────────────────────────────────┐
│  Header (프로젝트명, 검색, 설정)                           │
├──────┬──────────────┬───────────────────────────────────┤
│      │              │                                   │
│ Side │   List       │        Main Content               │
│ bar  │   Panel      │        (Detail View)              │
│      │              │                                   │
│ 아이콘 │   목록        │        상세 정보                   │
│      │              │                                   │
│      │              │                                   │
│      │              │                                   │
└──────┴──────────────┴───────────────────────────────────┘
```

### 1. Sidebar (좌측 네비게이션)
- **너비**: 60-80px (아이콘 전용)
- **구성요소**:
  - 카테고리별 아이콘 버튼
  - 활성 상태 표시
  - 하단에 설정/도움말 아이콘

**카테고리 아이콘 매핑**:
```typescript
{
  screen: "🖥️",    // 화면
  api: "🔌",       // API
  db: "🗄️",        // Database
  sql: "📊",       // SQL
  hook: "🪝",      // Hook
  query: "🔍",     // React Query
  store: "💾",     // Zustand Store
  util: "🛠️"       // Utility
}
```

### 2. List Panel (중앙 목록)
- **너비**: 300-400px (반응형)
- **구성요소**:
  - 카테고리 제목 + 새로 만들기 버튼
  - 검색/필터 바
  - 아이템 리스트 (가상 스크롤)
  
**리스트 아이템 카드**:
```
┌─────────────────────────────────┐
│ 📌 [구분 뱃지]                    │
│ 제목 (볼드)                       │
│ 설명 (2줄 말줄임)                 │
│ 📅 2025-12-01  👤 작성자          │
└─────────────────────────────────┘
```

### 3. Main Content (우측 상세)
- **너비**: 나머지 공간 (flex-1)
- **구성요소**:
  - 헤더 (제목, 수정/삭제 버튼)
  - 공통 정보 섹션
  - 카테고리별 특화 정보 섹션
  - 메타 정보 (생성일, 수정일, 작성자)

---

## 📊 데이터 모델 설계

### 공통 필드 (Base Model)

```typescript
interface BaseItem {
  id: string;                    // UUID
  category: CategoryType;        // 카테고리 구분
  title: string;                 // 제목
  description: string;           // 설명
  tags?: string[];               // 태그 (선택)
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 수정일
  createdBy?: string;            // 작성자
}

type CategoryType = 
  | 'screen' 
  | 'api' 
  | 'db' 
  | 'sql' 
  | 'hook' 
  | 'query' 
  | 'store' 
  | 'util';
```

### 카테고리별 특화 필드

#### 1. 화면 (Screen)
```typescript
interface ScreenItem extends BaseItem {
  category: 'screen';
  path: string;                  // 라우트 경로 (예: /dashboard/users)
  componentName: string;         // 컴포넌트명
  variables: Variable[];         // 변수 목록
  functions: Function[];         // 함수 목록
  dependencies: string[];        // 의존성 (다른 컴포넌트, 훅 등)
}

interface Variable {
  name: string;                  // 변수명
  type: string;                  // 타입 (string, number, etc.)
  defaultValue?: string;         // 기본값
  description?: string;          // 설명
}

interface Function {
  name: string;                  // 함수명
  parameters: Parameter[];       // 파라미터
  returnType: string;            // 반환 타입
  description?: string;          // 설명
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
}
```

#### 2. API
```typescript
interface ApiItem extends BaseItem {
  category: 'api';
  endpoint: string;              // API 엔드포인트 (예: /api/users)
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Header[];             // 헤더
  input: InputField[];           // 입력 (Request Body/Query)
  output: OutputField[];         // 출력 (Response)
  authentication?: string;       // 인증 방식
  rateLimit?: string;            // Rate Limit 정보
}

interface Header {
  key: string;
  value: string;
  required: boolean;
  description?: string;
}

interface InputField {
  name: string;
  type: string;                  // string, number, object, array
  required: boolean;
  description?: string;
  example?: string;
}

interface OutputField {
  name: string;
  type: string;
  description?: string;
  example?: string;
}
```

#### 3. DB (Database Table)
```typescript
interface DbItem extends BaseItem {
  category: 'db';
  tableName: string;             // 테이블명
  fields: DbField[];             // 필드 목록
  indexes?: Index[];             // 인덱스
  relations?: Relation[];        // 관계 (FK)
}

interface DbField {
  name: string;                  // 필드명
  type: string;                  // 데이터 타입 (VARCHAR, INT, etc.)
  length?: number;               // 길이
  nullable: boolean;             // NULL 허용 여부
  primaryKey: boolean;           // PK 여부
  unique: boolean;               // UNIQUE 여부
  defaultValue?: string;         // 기본값
  description?: string;          // 설명
}

interface Index {
  name: string;
  fields: string[];
  unique: boolean;
}

interface Relation {
  field: string;
  referencedTable: string;
  referencedField: string;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
  onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT';
}
```

#### 4. SQL
```typescript
interface SqlItem extends BaseItem {
  category: 'sql';
  queryType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'PROCEDURE' | 'FUNCTION';
  sqlContent: string;            // SQL 쿼리 내용
  parameters?: SqlParameter[];   // 파라미터
  returns?: string;              // 반환 타입/구조
  relatedTables: string[];       // 관련 테이블
  performance?: string;          // 성능 메모
}

interface SqlParameter {
  name: string;
  type: string;
  description?: string;
}
```

#### 5. Hook (Custom React Hook)
```typescript
interface HookItem extends BaseItem {
  category: 'hook';
  hookName: string;              // 훅 이름 (예: useAuth)
  parameters: Parameter[];       // 파라미터
  returns: ReturnValue[];        // 반환값
  dependencies: string[];        // 의존성 (다른 훅, 스토어 등)
  example?: string;              // 사용 예시 코드
}

interface ReturnValue {
  name: string;
  type: string;
  description?: string;
}
```

#### 6. Query (React Query)
```typescript
interface QueryItem extends BaseItem {
  category: 'query';
  queryKey: string[];            // Query Key
  queryFn: string;               // Query Function 이름
  apiEndpoint: string;           // 연결된 API
  staleTime?: number;            // Stale Time (ms)
  cacheTime?: number;            // Cache Time (ms)
  enabled?: string;              // 활성화 조건
  onSuccess?: string;            // 성공 시 동작
  onError?: string;              // 에러 시 동작
}
```

#### 7. Store (Zustand)
```typescript
interface StoreItem extends BaseItem {
  category: 'store';
  storeName: string;             // 스토어 이름
  states: StateField[];          // 상태 필드
  actions: Action[];             // 액션 (함수)
  persist?: boolean;             // 영속성 여부
  middleware?: string[];         // 미들웨어
}

interface StateField {
  name: string;
  type: string;
  initialValue?: string;
  description?: string;
}

interface Action {
  name: string;
  parameters: Parameter[];
  description?: string;
}
```

#### 8. Util (Utility Function)
```typescript
interface UtilItem extends BaseItem {
  category: 'util';
  functionName: string;          // 함수명
  parameters: Parameter[];       // 파라미터
  returnType: string;            // 반환 타입
  example?: string;              // 사용 예시
  testCases?: TestCase[];        // 테스트 케이스
}

interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}
```

---

## 🗂️ 폴더 구조

```
src/
├── app/
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈 페이지
│   └── dashboard/
│       └── page.tsx               # 메인 대시보드
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            # 사이드바 (카테고리 아이콘)
│   │   ├── ListPanel.tsx          # 목록 패널
│   │   └── MainContent.tsx        # 상세 내용 영역
│   ├── items/
│   │   ├── ItemCard.tsx           # 목록 아이템 카드
│   │   ├── ItemDetail.tsx         # 상세 정보 (공통)
│   │   ├── ScreenDetail.tsx       # 화면 상세
│   │   ├── ApiDetail.tsx          # API 상세
│   │   ├── DbDetail.tsx           # DB 상세
│   │   ├── SqlDetail.tsx          # SQL 상세
│   │   ├── HookDetail.tsx         # Hook 상세
│   │   ├── QueryDetail.tsx        # Query 상세
│   │   ├── StoreDetail.tsx        # Store 상세
│   │   └── UtilDetail.tsx         # Util 상세
│   ├── forms/
│   │   ├── ScreenForm.tsx         # 화면 등록/수정 폼
│   │   ├── ApiForm.tsx            # API 등록/수정 폼
│   │   └── ...                    # 각 카테고리별 폼
│   └── ui/                        # shadcn/ui 컴포넌트
├── hooks/
│   ├── useItems.ts                # 아이템 관리 훅
│   └── useCategory.ts             # 카테고리 관리 훅
├── store/
│   ├── itemStore.ts               # 아이템 전역 상태 (Zustand)
│   └── uiStore.ts                 # UI 상태 (선택된 카테고리, 아이템 등)
├── lib/
│   ├── api.ts                     # API 클라이언트
│   ├── storage.ts                 # 로컬 스토리지 유틸
│   └── types.ts                   # 타입 정의
└── utils/
    ├── validation.ts              # 유효성 검사
    └── formatter.ts               # 포맷팅 함수
```

---

## 🔄 주요 기능 흐름

### 1. 아이템 조회 흐름
```
사용자 → Sidebar 클릭 → 카테고리 선택 
→ ListPanel 업데이트 (해당 카테고리 아이템 목록 표시)
→ 아이템 클릭 → MainContent 업데이트 (상세 정보 표시)
```

### 2. 아이템 생성 흐름
```
사용자 → "새로 만들기" 버튼 클릭 
→ 모달/슬라이드 폼 표시 (카테고리별 폼)
→ 정보 입력 → 저장 
→ Store 업데이트 → ListPanel 갱신
```

### 3. 아이템 수정/삭제 흐름
```
사용자 → MainContent에서 수정/삭제 버튼 클릭
→ 수정: 폼 모달 표시 → 저장
→ 삭제: 확인 다이얼로그 → 삭제 → Store 업데이트
```

---

## 🎯 상태 관리 전략

### Zustand Store 구조

```typescript
// store/itemStore.ts
interface ItemStore {
  items: Record<CategoryType, BaseItem[]>;  // 카테고리별 아이템
  
  // Actions
  addItem: (category: CategoryType, item: BaseItem) => void;
  updateItem: (category: CategoryType, id: string, item: Partial<BaseItem>) => void;
  deleteItem: (category: CategoryType, id: string) => void;
  getItemsByCategory: (category: CategoryType) => BaseItem[];
  getItemById: (category: CategoryType, id: string) => BaseItem | undefined;
}

// store/uiStore.ts
interface UiStore {
  selectedCategory: CategoryType | null;
  selectedItemId: string | null;
  isFormOpen: boolean;
  formMode: 'create' | 'edit';
  
  // Actions
  setSelectedCategory: (category: CategoryType) => void;
  setSelectedItemId: (id: string | null) => void;
  openForm: (mode: 'create' | 'edit') => void;
  closeForm: () => void;
}
```

---

## 🎨 UI 컴포넌트 (shadcn/ui)

### 사용할 컴포넌트 목록
- `Button` - 액션 버튼
- `Card` - 아이템 카드
- `Dialog` - 확인 다이얼로그
- `Form` - 폼 관리
- `Input` - 텍스트 입력
- `Textarea` - 긴 텍스트 입력
- `Select` - 드롭다운
- `Badge` - 카테고리/태그 뱃지
- `Separator` - 구분선
- `ScrollArea` - 스크롤 영역
- `Tabs` - 탭 (상세 정보 섹션 구분)
- `Table` - 필드/파라미터 목록 표시
- `Sheet` - 사이드 패널 (모바일)

---

## 📱 반응형 디자인

### Breakpoints
- **Mobile** (< 768px): 
  - Sidebar 숨김 → 햄버거 메뉴
  - ListPanel 전체 너비
  - MainContent 별도 페이지로 이동
  
- **Tablet** (768px - 1024px):
  - Sidebar 표시
  - ListPanel + MainContent 분할
  
- **Desktop** (> 1024px):
  - 3단 레이아웃 (Sidebar + List + Main)

---

## 🔍 검색 및 필터링

### 검색 기능
- 전체 검색 (헤더)
- 카테고리 내 검색 (ListPanel)
- 검색 대상: 제목, 설명, 태그

### 필터링
- 생성일 기준 정렬
- 수정일 기준 정렬
- 태그 필터
- 작성자 필터 (다중 사용자 환경 시)

---

## 💾 데이터 저장 방식

### Phase 1: 로컬 스토리지
- `localStorage`를 사용한 클라이언트 저장
- JSON 직렬화/역직렬화
- 간단한 CRUD 구현

### Phase 2: 서버 DB (향후 확장)
- Next.js API Routes
- Prisma + PostgreSQL/MySQL
- 다중 사용자 지원
- 실시간 동기화 (옵션)

---

## 🚀 개발 우선순위

### MVP (Minimum Viable Product)
1. ✅ 기본 레이아웃 구성 (Sidebar + List + Main)
2. ✅ 카테고리 전환 기능
3. ✅ 아이템 목록 표시
4. ✅ 아이템 상세 보기
5. ✅ 아이템 생성/수정/삭제 (1개 카테고리)

### Phase 2
6. 모든 카테고리 폼 구현
7. 검색 기능
8. 필터링 및 정렬
9. 태그 시스템

### Phase 3
10. 데이터 내보내기/가져오기 (JSON, CSV)
11. 다크 모드
12. 키보드 단축키
13. 반응형 최적화

---

## 🎨 디자인 시스템

### 색상 팔레트
```css
/* Primary - 메인 액션 */
--primary: 222.2 47.4% 11.2%;

/* Secondary - 보조 액션 */
--secondary: 210 40% 96.1%;

/* Accent - 강조 */
--accent: 210 40% 96.1%;

/* 카테고리별 색상 */
--screen: #3b82f6;    /* Blue */
--api: #10b981;       /* Green */
--db: #f59e0b;        /* Amber */
--sql: #8b5cf6;       /* Purple */
--hook: #ec4899;      /* Pink */
--query: #06b6d4;     /* Cyan */
--store: #f97316;     /* Orange */
--util: #6366f1;      /* Indigo */
`
### 타이포그래피
- **제목**: `font-bold text-2xl`
- **부제목**: `font-semibold text-lg`
- **본문**: `font-normal text-base`
- **캡션**: `font-normal text-sm text-muted-foreground`

---

## 📝 추가 고려사항

### 1. 버전 관리
- 아이템 수정 이력 추적 (옵션)
- 변경 사항 비교 기능

### 2. 협업 기능 (향후)
- 댓글/노트 추가
- 공유 링크 생성
- 권한 관리

### 3. 통합 기능
- GitHub 연동 (코드 자동 파싱)
- Swagger/OpenAPI 임포트 (API)
- DB 스키마 자동 임포트

### 4. 성능 최적화
- 가상 스크롤 (긴 목록)
- 이미지 레이지 로딩
- 코드 스플리팅

---

## 📚 참고 레이아웃

이 설계는 다음과 같은 앱의 레이아웃을 참고했습니다:
- Gmail/Outlook (메일 앱 레이아웃)
- Notion (사이드바 + 콘텐츠)
- Linear (프로젝트 관리)
- Postman (API 관리)

---

## ✅ 다음 단계

1. shadcn/ui 컴포넌트 설치
2. 기본 레이아웃 컴포넌트 구현
3. Zustand 스토어 설정
4. 타입 정의 파일 작성
5. 첫 번째 카테고리(화면) MVP 구현
6. 점진적으로 다른 카테고리 추가

---

**작성일**: 2025-12-01  
**버전**: 1.0  
**작성자**: Gemini AI Assistant
