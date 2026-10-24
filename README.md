# 필름 앤 그루브

영화는 티켓 모양으로, 음악은 CD 모양으로 기록하는 개인 아카이브 사이트. Next.js(App Router) + TypeScript + Tailwind CSS로 만들었고, 데이터와 업로드 이미지는 Vercel Blob에 저장한다.

## 로컬 개발

Vercel Blob을 쓰기 때문에 로컬에서도 실제 Blob 스토어 토큰이 필요하다 (아래 "Vercel 배포" 참고).

```bash
npm install
vercel env pull .env.local   # 토큰을 가져온 뒤
npm run dev
```

`http://localhost:3000` 에서 확인.

## 스택

- Next.js 16 (App Router, Turbopack)
- TypeScript, Tailwind CSS v4
- Vercel Blob — `data/movies.json` / `data/music.json`을 저장하는 private 스토어 하나, 업로드된 영화 썸네일을 저장하는 public 스토어 하나
- YouTube IFrame Player API로 숨겨진 플레이어를 만들어 음악 CD 재생

## Vercel 배포

이 프로젝트는 로컬 파일시스템을 쓰지 않고 Vercel Blob에 직접 읽고 쓰므로, 배포 전에 Blob 스토어 2개를 만들어 연결해야 한다.

1. **Vercel 프로젝트 만들기**
   ```bash
   vercel login
   vercel link
   ```

2. **Blob 스토어 2개 생성** — Vercel 대시보드 → 프로젝트 → **Storage** 탭 → **Create Database** → **Blob**
   - 데이터용 스토어: Access를 **Private**로 생성하고, 이 프로젝트에 연결할 때 환경변수 이름(prefix)을 `DATA_BLOB`로 지정 → `DATA_BLOB_READ_WRITE_TOKEN` 생성됨
   - 이미지용 스토어: Access를 **Public**으로 생성하고, 환경변수 이름을 `IMAGES_BLOB`로 지정 → `IMAGES_BLOB_READ_WRITE_TOKEN` 생성됨

3. **로컬로 토큰 가져오기**
   ```bash
   vercel env pull .env.local
   ```
   `.env.local`에 `DATA_BLOB_READ_WRITE_TOKEN`, `IMAGES_BLOB_READ_WRITE_TOKEN`이 채워지는지 확인 (`.env.example` 참고).

4. **배포**
   ```bash
   vercel --prod
   ```
   또는 GitHub 저장소를 Vercel에 연결해서 푸시할 때마다 자동 배포되게 할 수도 있다.

## 참고

- 데이터 JSON은 고정 경로(`data/movies.json`, `data/music.json`)에 매번 덮어쓰는 방식이라 동시 다발적 쓰기에는 안전하지 않다. 개인용 단일 사용자 앱이라 문제되지 않는다.
- 영화 썸네일은 5MB 미만의 이미지 파일만 허용한다 (`src/lib/upload.ts`).
