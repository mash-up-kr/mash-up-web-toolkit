---
sidebar_position: 1
---

# Installation

Auto Routing을 사용하기 위해선 Next.js App Router 구조의 프로젝트가 필요합니다.

## 요구사항

- **Next.js** 프로젝트 (App Router 사용)
- `@mash-up-web-toolkit/command` CLI 설치 완료

:::info CLI 설치
CLI가 설치되어 있지 않다면 [CLI Installation](/docs/category/installation) 문서를 먼저 확인해주세요.
:::

## 지원하는 라우트 파일

Auto Routing은 Next.js App Router의 다음 파일들을 자동으로 인식합니다:

| 파일명 | 설명 |
|--------|------|
| `page.tsx` / `page.ts` / `page.jsx` / `page.js` | 페이지 컴포넌트 |
| `route.tsx` / `route.ts` / `route.jsx` / `route.js` | API 라우트 핸들러 |

## Next.js App Router의 라우팅 규칙 지원

Auto Routing은 [Next.js App Router의 라우팅 규칙](https://nextjs-ko.org/docs/app/building-your-application/routing)을 그대로 따릅니다:

| 규칙 | 처리 방식 |
|------|-----------|
| Route Groups `(group)` | URL 경로에서 제외 |
| Private Folders `_folder` | 라우트에서 제외 |
| Dynamic Routes `[slug]` | `_SLUG` 형태로 변환 |
