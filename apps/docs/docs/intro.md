---
sidebar_position: 1
---

# Mash-Up Web Toolkit 시작하기

**Mash-Up Web Toolkit**에 오신 것을 환영합니다! 여러분은 **5분 이내**에 반복적인 개발 작업을 자동화할 수 있습니다.

## 🎯 탄생 배경

매 기수마다 새로운 프로젝트를 시작할 때 동일한 작업을 반복하며 시간을 낭비하고 계신가요?

- 🔄 **OpenAPI 스펙에서 API 클라이언트 코드를 매번 수동으로 작성**
- ⚙️ **프로젝트마다 동일한 설정 파일들을 반복 생성**
- 🔧 **검증되지 않은 유틸리티 함수를 매번 새로 작성**

**Mash-Up Web Toolkit**은 이런 문제들을 해결합니다!

## ✨ 주요 기능

### 🚀 자동화된 API 코드 생성

OpenAPI/Swagger 스펙 문서를 기반으로 완전한 TypeScript API 클라이언트를 자동 생성합니다.

- **타입 안전성** 보장
- **Axios/Fetch** 기반 HTTP 클라이언트 지원
- **커스터마이징 가능한** 템플릿 시스템

### ⚡ 스마트 프로젝트 설정

프로젝트 초기화에 필요한 모든 설정을 템플릿 기반으로 자동 생성합니다.

- **모던 개발 환경** 설정
- **Best Practice** 적용된 구조
- **팀 컨벤션** 자동 적용

### 🛠️ 검증된 유틸리티 생태계

Mash-Up 웹팀에서 실제 프로덕션 환경에서 검증된 도구들을 제공합니다.

- **TypeScript 우선** 설계
- **Tree-shaking** 최적화
- **모듈러 아키텍처** 지원

## 🏃‍♂️ 빠른 시작

### 필요한 환경

- [Node.js](https://nodejs.org/en/download/) 18.0 이상
- **패키지 매니저** npm, yarn, 또는 pnpm

### 설치 및 실행

CLI 도구를 개발 의존성으로 설치하거나 npx로 바로 실행할 수 있습니다:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-managers">
  <TabItem value="pnpm" label="pnpm" default>

```bash
pnpm add -D @mash-up-web-toolkit/command
```

**실행**

```bash
pnpm mash-up-web
```

  </TabItem>
  <TabItem value="npm" label="npm">

```bash
npm install -D @mash-up-web-toolkit/command
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add -D @mash-up-web-toolkit/command
```

  </TabItem>
</Tabs>

:::tip Why Use devDependencies?
개발 단계에서만 사용되는 도구입니다. 프로덕션 환경에서는 필요하지 않으므로 `-D` 플래그로 설치하는 것을 권장합니다.
:::
