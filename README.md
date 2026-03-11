<div align="center">

# Mash-Up Web Toolkit

Mash-Up 웹팀의 반복적인 개발 작업을 자동화하고 개선하는 도구 모음

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mash-up-kr/mash-up-web-toolkit/blob/main/LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-9.0.0-orange)](https://pnpm.io)

</div>

<img width="687" alt="mash-up-web-toolkit CLI" src="https://github.com/user-attachments/assets/c68aa3d0-aa52-4629-9e6d-12c7872abb21" />

## 소개

매 기수마다 진행되는 프로젝트에서 반복되는 작업들을 자동화합니다. API 클라이언트 코드 자동 생성부터 프로젝트 초기 설정, 라우트 상수 자동 생성까지 — 개발 효율성을 높이고 일관된 코드 품질을 유지할 수 있습니다.

## 문서

전체 문서는 **[Docs](https://mash-up-web-toolkit-docs.vercel.app/docs/intro)** 에서 확인할 수 있습니다.

## 패키지

### CLI 도구

| 패키지                                                                   | 버전                                                                                                                                            | 설명                                          |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [`@mash-up-web-toolkit/command`](./packages/cli/command)                 | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/command)](https://www.npmjs.com/package/@mash-up-web-toolkit/command)                 | 통합 CLI 인터페이스                           |
| [`@mash-up-web-toolkit/generate-api`](./packages/cli/generate-api)       | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/generate-api)](https://www.npmjs.com/package/@mash-up-web-toolkit/generate-api)       | OpenAPI 스펙 기반 API 클라이언트 자동 생성    |
| [`@mash-up-web-toolkit/generate-config`](./packages/cli/generate-config) | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/generate-config)](https://www.npmjs.com/package/@mash-up-web-toolkit/generate-config) | 프로젝트 설정 템플릿 생성                     |
| [`@mash-up-web-toolkit/auto-routing`](./packages/cli/auto-routing)       | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/auto-routing)](https://www.npmjs.com/package/@mash-up-web-toolkit/auto-routing)       | Next.js App Router 기반 라우트 상수 자동 생성 |

### 공통 라이브러리

| 패키지                                                     | 버전                                                                                                                                  | 설명                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [`@mash-up-web-toolkit/util-types`](./packages/util-types) | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/util-types)](https://www.npmjs.com/package/@mash-up-web-toolkit/util-types) | 자주 사용되는 TypeScript 유틸리티 타입 |
| [`@mash-up-web-toolkit/utils`](./packages/utils)           | [![npm](https://img.shields.io/npm/v/@mash-up-web-toolkit/utils)](https://www.npmjs.com/package/@mash-up-web-toolkit/utils)           | 검증된 헬퍼 함수 모음                  |

## 시작하기

```bash
# CLI 설치
npm install -g @mash-up-web-toolkit/command

# 또는 npx로 바로 실행
npx @mash-up-web-toolkit/command
```

## 기여하기

Mash-Up 웹팀 구성원이라면 누구나 기여할 수 있습니다.

- **버그 리포트** — [Issues](https://github.com/mash-up-kr/mash-up-web-toolkit/issues) 탭에서 문제점 공유
- **기능 제안** — 반복 작업 발견 시 자동화 아이디어 제안
- **코드 기여** — Pull Request로 개선사항 제출

## 라이선스

[MIT](./LICENSE) © Mash-Up Web Team
