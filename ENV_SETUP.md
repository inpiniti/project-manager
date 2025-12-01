# 환경 변수 설정 가이드

## 개발 환경 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 운영 환경 (Vercel)

Vercel 대시보드 → Settings → Environment Variables에서 설정:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 중요: Supabase 리다이렉트 URL 설정

Supabase 대시보드 → Authentication → URL Configuration:

### 개발 환경
- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

### 운영 환경 (배포 후 추가)
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: 
  - `https://your-app.vercel.app/**`
  - `http://localhost:3000/**` (개발용 유지)

**주의:** 
- 배포 후 Vercel에서 생성된 실제 URL로 업데이트해야 합니다.
- 리다이렉트 URL을 설정하지 않으면 로그인 후 localhost로 리다이렉트됩니다.
