# Vercel 배포 가이드

## 📦 배포 전 준비사항

### 1. 환경 변수 설정
`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인하세요:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 2. 파비콘 및 아이콘 준비
다음 이미지 파일들을 `public/` 폴더에 추가하세요:

- `favicon.ico` (16x16, 32x32, 48x48)
- `icon.png` (32x32)
- `apple-icon.png` (180x180)
- `icon-192.png` (192x192) - PWA용
- `icon-512.png` (512x512) - PWA용
- `og-image.png` (1200x630) - SNS 공유용

**아이콘 생성 도구:**
- [Favicon.io](https://favicon.io/) - 무료 파비콘 생성기
- [RealFaviconGenerator](https://realfavicongenerator.net/) - 모든 플랫폼용 아이콘 생성

## 🚀 Vercel 배포 단계

### 방법 1: GitHub 연동 (권장)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   ```

2. **Vercel 대시보드에서 배포**
   - [Vercel](https://vercel.com) 접속 및 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 환경 변수 입력:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `NEXT_PUBLIC_APP_URL` (배포 후 자동 생성된 URL 입력)
   - "Deploy" 클릭

### 방법 2: Vercel CLI

1. **Vercel CLI 설치**
   ```bash
   npm i -g vercel
   ```

2. **로그인**
   ```bash
   vercel login
   ```

3. **배포**
   ```bash
   vercel
   ```

4. **프로덕션 배포**
   ```bash
   vercel --prod
   ```

## 🔧 배포 후 설정

### 1. 환경 변수 업데이트
Vercel 대시보드에서:
- Settings → Environment Variables
- `NEXT_PUBLIC_APP_URL`을 실제 배포된 URL로 업데이트

### 2. Supabase 설정 업데이트

**중요:** 배포 후 반드시 Supabase 리다이렉트 URL을 업데이트해야 합니다!

Supabase 대시보드에서:
- **Authentication** → **URL Configuration**
- **Site URL**: `https://your-app.vercel.app` (실제 배포된 URL로 변경)
- **Redirect URLs**에 추가:
  ```
  https://your-app.vercel.app/**
  http://localhost:3000/**
  ```

**이 설정을 하지 않으면 로그인 후 localhost:3000으로 리다이렉트됩니다!**

### 3. 커스텀 도메인 연결 (선택사항)
Vercel 대시보드에서:
- Settings → Domains
- 도메인 추가 및 DNS 설정

## 🌐 Google Search Console 등록

### 1. 소유권 확인
1. [Google Search Console](https://search.google.com/search-console) 접속
2. "속성 추가" → URL 입력
3. 소유권 확인 방법 선택:
   - **HTML 파일 업로드** (권장)
   - DNS 레코드
   - Google Analytics
   - Google Tag Manager

### 2. HTML 파일 방법
Vercel에서 제공하는 확인 파일을 `public/` 폴더에 추가:
```bash
# 예시
public/google1234567890abcdef.html
```

### 3. Sitemap 제출
- Google Search Console → Sitemaps
- `https://your-domain.com/sitemap.xml` 제출

## 📊 성능 최적화

### 1. 이미지 최적화
Next.js Image 컴포넌트 사용:
```tsx
import Image from 'next/image'

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

### 2. 빌드 확인
로컬에서 프로덕션 빌드 테스트:
```bash
npm run build
npm run start
```

### 3. Lighthouse 점수 확인
Chrome DevTools → Lighthouse → "Generate report"

## 🔒 보안 설정

### 1. 환경 변수 보호
- `.env.local`을 `.gitignore`에 추가 (이미 포함됨)
- Vercel 환경 변수는 암호화되어 저장됨

### 2. CORS 설정
Supabase에서 허용된 도메인만 접근 가능하도록 설정

## 📱 PWA 테스트

1. Chrome DevTools → Application → Manifest
2. "Add to Home Screen" 테스트
3. 오프라인 동작 확인

## 🐛 트러블슈팅

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# 캐시 삭제 후 재시도
rm -rf .next
npm run build
```

### 환경 변수 미적용
- Vercel 대시보드에서 환경 변수 재확인
- 재배포 (Deployments → ... → Redeploy)

### Supabase 연결 실패
- `.env.local`과 Vercel 환경 변수 일치 확인
- Supabase URL Configuration 확인

## 📈 모니터링

### Vercel Analytics
- Settings → Analytics 활성화
- 실시간 방문자 및 성능 모니터링

### Supabase Logs
- Supabase Dashboard → Logs
- API 요청 및 에러 모니터링

---

## 체크리스트

배포 전:
- [ ] 환경 변수 설정 완료
- [ ] 파비콘 및 아이콘 추가
- [ ] 로컬 빌드 성공 확인
- [ ] Supabase 테이블 생성 완료

배포 후:
- [ ] 환경 변수 업데이트
- [ ] Supabase URL 설정
- [ ] Google Search Console 등록
- [ ] Sitemap 제출
- [ ] PWA 동작 확인

도메인 연결 시:
- [ ] 커스텀 도메인 추가
- [ ] DNS 설정
- [ ] SSL 인증서 확인
- [ ] 환경 변수 URL 업데이트
