# 파비콘 및 아이콘 생성 가이드

배포 전에 다음 이미지 파일들을 `public/` 폴더에 추가해야 합니다.

## 필요한 파일 목록

```
public/
├── favicon.ico          # 16x16, 32x32, 48x48 (멀티 사이즈)
├── icon.png             # 32x32
├── apple-icon.png       # 180x180 (Apple Touch Icon)
├── icon-192.png         # 192x192 (PWA)
├── icon-512.png         # 512x512 (PWA)
└── og-image.png         # 1200x630 (SNS 공유)
```

## 빠른 생성 방법

### 옵션 1: Favicon.io (권장)
1. [https://favicon.io/](https://favicon.io/) 접속
2. "Text" 탭 선택
3. 설정:
   - Text: "PM" 또는 "프매"
   - Background: #3b82f6 (파란색)
   - Font: Roboto Bold
   - Font Size: 80
4. "Download" 클릭
5. 압축 해제 후 파일들을 `public/` 폴더에 복사

### 옵션 2: RealFaviconGenerator
1. [https://realfavicongenerator.net/](https://realfavicongenerator.net/) 접속
2. 로고 이미지 업로드 (최소 260x260px)
3. 각 플랫폼별 설정
4. "Generate your Favicons and HTML code" 클릭
5. 다운로드 후 `public/` 폴더에 복사

### 옵션 3: Canva로 직접 제작
1. [https://www.canva.com/](https://www.canva.com/) 접속
2. 커스텀 크기로 디자인 생성
3. 각 크기별로 내보내기:
   - 512x512 → `icon-512.png`
   - 192x192 → `icon-192.png`
   - 180x180 → `apple-icon.png`
   - 32x32 → `icon.png`
   - 1200x630 → `og-image.png`

## 디자인 가이드

### 색상 팔레트
- Primary: #3b82f6 (파란색)
- Secondary: #8b5cf6 (보라색)
- Background: #ffffff (흰색)

### 아이콘 컨셉
- 폴더 + 레이어 조합
- 간결하고 모던한 디자인
- 정사각형 중앙 정렬

## 임시 파비콘 (테스트용)

배포 테스트를 위해 임시로 단색 파비콘을 사용할 수 있습니다:

1. [https://favicon.io/favicon-generator/](https://favicon.io/favicon-generator/) 접속
2. 간단한 텍스트 파비콘 생성
3. 다운로드 후 사용

## 확인 방법

파비콘이 제대로 적용되었는지 확인:

1. 로컬 서버 실행: `npm run dev`
2. 브라우저 탭에서 파비콘 확인
3. Chrome DevTools → Application → Manifest 확인
4. PWA 설치 테스트

## 문제 해결

### 파비콘이 안 보일 때
- 브라우저 캐시 삭제 (Ctrl + Shift + Delete)
- 하드 리프레시 (Ctrl + F5)
- 시크릿 모드에서 확인

### 파일 경로 확인
모든 이미지는 `public/` 폴더에 직접 위치해야 합니다.
(하위 폴더 없이 `public/favicon.ico` 형태)
