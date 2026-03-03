# @mash-up-web-toolkit/auto-routing

- Next.js App Router의 디렉토리 구조를 분석하여 라우팅 상수 파일을 자동 생성합니다.

## Documentation

- [시작하기](https://mash-up-web-toolkit-docs.vercel.app/docs/category/auto-routing)

## Usage

```bash
# 라우팅 상수 파일 생성
pnpm mash-up-web gen:routes

# 출력 경로 지정
pnpm mash-up-web gen:routes --output ./src/configs/__generated__/routes.ts
```

생성 결과 예시:

```ts
// app/dashboard/settings/page.tsx, app/profile/[id]/page.tsx 가 있을 경우
export const ROUTES = {
  DASHBOARD: {
    SETTINGS: '/dashboard/settings',
  },
  PROFILE: {
    _ID: '/profile/[id]',
  },
} as const;
```

## Options

```
  -o, --output <path>   생성될 라우팅 상수 파일의 경로 (예: ./src/configs/__generated__/routes.ts)
```
