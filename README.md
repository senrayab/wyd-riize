# WYD RIIZE Schedule

RIIZE 일정을 달력과 목록으로 관리하는 React + Vite 앱입니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

## Cloudflare Pages 배포

Cloudflare Pages 프로젝트 `wyd-riize`에서 빌드 명령은 `npm run build`, 출력 디렉터리는 `dist`로 설정합니다. Vite `base`는 `/`입니다.

직접 배포하려면 Wrangler 인증 후 실행합니다.

```bash
npm run build
npx wrangler pages deploy dist --project-name wyd-riize --branch main
```
