---
sidebar_position: 1
---

# Installation

SVG Config Generator를 사용하면 Next.js 또는 Vite 프로젝트에 SVG를 React 컴포넌트로 불러오기 위한 설정을 자동으로 구성할 수 있습니다.

## 요구사항

- **Next.js** 또는 **Vite** 프로젝트
- `@mash-up-web-toolkit/command` CLI 설치 완료

:::info CLI 설치
CLI가 설치되어 있지 않다면 [CLI Installation](/docs/category/installation) 문서를 먼저 확인해주세요.
:::

## 지원하는 프로젝트 타입

SVG Config Generator는 프로젝트의 `package.json`을 분석해 프로젝트 타입을 자동으로 감지합니다.

| 프로젝트 타입 | 자동 설치 패키지 | 지원 언어 |
|---|---|---|
| Next.js | `@svgr/webpack` | TypeScript, JavaScript |
| Vite | `vite-plugin-svgr` | TypeScript, JavaScript |

:::warning 지원하지 않는 프로젝트
Next.js와 Vite 이외의 프로젝트는 현재 지원하지 않습니다. 지원되지 않는 프로젝트에서 실행하면 오류 메시지와 함께 종료됩니다.
:::

## 지원하는 설정 파일

### Next.js

| 설정 파일 | 설명 |
|---|---|
| `next.config.ts` | TypeScript 설정 파일 |
| `next.config.js` | JavaScript 설정 파일 |
| `next.config.mjs` | ESM JavaScript 설정 파일 |

설정 파일이 존재하지 않는 경우, 프로젝트 언어에 맞는 파일을 자동으로 생성합니다.

### Vite

| 설정 파일 | 설명 |
|---|---|
| `vite.config.ts` | TypeScript 설정 파일 |
| `vite.config.js` | JavaScript 설정 파일 |

## 자동 구성 내용

### Next.js 프로젝트

| 구분 | 처리 내용 |
|---|---|
| 패키지 설치 | `@svgr/webpack` dev dependency 추가 |
| 설정 패치 | `next.config` 파일에 webpack SVG 핸들러 추가 |
| Turbopack | `turbopack.rules`에 `*.svg` 로더 규칙 추가 |
| 타입 선언 (TS) | 프로젝트 루트에 `svgr.d.ts` 생성 |
| tsconfig (TS) | `tsconfig.json`의 `include`에 `svgr.d.ts` 경로 추가 |

### Vite 프로젝트

| 구분 | 처리 내용 |
|---|---|
| 패키지 설치 | `vite-plugin-svgr` dev dependency 추가 |
| 설정 패치 | `vite.config` 파일의 `plugins` 배열에 `svgr()` 추가 |
| 타입 선언 (TS) | `src/vite-env.d.ts`에 `/// <reference types="vite-plugin-svgr/client" />` 추가 |
