# Supabase 연동 가이드

이 프로젝트는 Supabase를 사용하여 사용자 인증 및 데이터 관리를 수행합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성합니다.
2. 새 프로젝트를 생성합니다.
3. 프로젝트 대시보드에서 **Settings > API**로 이동합니다.
4. 다음 정보를 복사합니다:
   - `Project URL`
   - `anon public` API 키

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. 데이터베이스 스키마 적용

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣습니다.
3. **Run** 버튼을 클릭하여 스키마를 생성합니다.

## 4. 이메일 인증 설정 (선택사항)

Supabase는 기본적으로 Magic Link 로그인을 사용합니다.

1. **Authentication > Email Templates**에서 이메일 템플릿을 커스터마이징할 수 있습니다.
2. **Authentication > URL Configuration**에서 리다이렉트 URL을 설정합니다:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`

## 5. Mock 모드 (Supabase 미설정 시)

환경 변수가 설정되지 않은 경우, 앱은 자동으로 Mock 모드로 동작합니다.
- 로컬 스토리지를 사용하여 데이터를 저장합니다.
- 실제 이메일 인증 없이 즉시 로그인됩니다.

## 데이터베이스 구조

### Tables

1. **profiles**: 사용자 프로필 정보
2. **projects**: 프로젝트 정보
3. **project_members**: 프로젝트 공유 멤버
4. **items**: 프로젝트 아이템 (Screen, API, DB 등)

자세한 스키마는 `supabase/schema.sql`을 참고하세요.

## 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 앱을 확인합니다.
