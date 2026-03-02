---
sidebar_position: 2
---

# Usage

프로젝트 타입(Next.js / Vite)과 언어(TypeScript / JavaScript)를 자동으로 감지하여 SVG를 React 컴포넌트로 사용할 수 있도록 설정을 구성합니다.

## 🚀 SVG 설정 자동 구성

### 1. CLI 실행

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-managers">
  <TabItem value="pnpm" label="pnpm" default>

```bash
pnpm mash-up-web
```

  </TabItem>
  <TabItem value="npm" label="npm">

```bash
npx mash-up-web
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

**방법 1: npx 사용 (권장)**

```bash
npx mash-up-web
```

**방법 2: package.json 스크립트 추가**

```json
{
  "scripts": {
    "mash-up-web": "mash-up-web",
    "gen:svg-config": "mash-up-web gen:svg-config"
  }
}
```

```bash
yarn mash-up-web
```

  </TabItem>
</Tabs>

### 2. `gen:svg-config` 선택

CLI를 실행하면 다음과 같은 메뉴가 나타납니다:

```
? 명령을 선택해주세요. (Use arrow keys)
  gen:config
  gen:api-config
  gen:api
  gen:routes
❯ gen:svg-config
```

**`gen:svg-config`** 를 선택하세요.

### 3. 자동 구성 완료

별도의 입력 없이 프로젝트 타입과 언어를 자동으로 감지하여 설정을 구성합니다.

:::tip 직접 실행
인터랙티브 메뉴 없이 바로 실행할 수도 있습니다:

```bash
pnpm mash-up-web gen:svg-config
```
:::

## 📁 생성 및 수정되는 파일

### Next.js + TypeScript

```
(프로젝트 루트)/
├── next.config.ts         # webpack, turbopack SVG 핸들러 추가
├── svgr.d.ts              # 생성 — SVG 모듈 타입 선언
└── tsconfig.json          # include에 svgr.d.ts 경로 추가
```

**`svgr.d.ts` 생성 내용**

```ts title="svgr.d.ts"
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}
declare module '*.svg?url' {
  const content: any
  export default content
}
```

**`next.config.ts` 패치 내용**

```ts title="next.config.ts"
const nextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default nextConfig;
```

---

### Next.js + JavaScript

```
(프로젝트 루트)/
└── next.config.js         # webpack, turbopack SVG 핸들러 추가
```

---

### Vite + TypeScript

```
(프로젝트 루트)/
├── vite.config.ts         # plugins 배열에 svgr() 추가
└── src/
    └── vite-env.d.ts      # vite-plugin-svgr 레퍼런스 타입 추가
```

**`vite.config.ts` 패치 내용**

```ts title="vite.config.ts"
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    svgr(),
    // ... 기존 플러그인
  ],
})
```

**`src/vite-env.d.ts` 추가 내용**

```ts title="src/vite-env.d.ts"
/// <reference types="vite-plugin-svgr/client" />
```

---

### Vite + JavaScript

```
(프로젝트 루트)/
└── vite.config.js         # plugins 배열에 svgr() 추가
```

---

## 🎯 활용 예시

설정이 완료되면 `.svg` 파일을 React 컴포넌트로 바로 import할 수 있습니다.

```tsx
import Logo from '@/assets/logo.svg';
import { ReactComponent as Icon } from '@/assets/icon.svg';

// ✅ SVG를 React 컴포넌트로 사용
export default function App() {
  return (
    <div>
      <Logo width={120} height={40} />
      <Icon className="icon" aria-label="아이콘" />
    </div>
  );
}
```

:::tip 기존 설정 파일이 있는 경우
이미 `next.config.ts` 또는 `vite.config.ts`가 존재하는 경우, 파일을 덮어쓰지 않고 기존 내용을 유지하면서 필요한 설정만 추가합니다. `@svgr/webpack` 또는 `vite-plugin-svgr` 관련 설정이 이미 있다면 중복 추가하지 않습니다.
:::
