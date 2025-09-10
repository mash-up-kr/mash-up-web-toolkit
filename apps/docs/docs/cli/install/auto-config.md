# Auto Configuration

## 1. 패키지 설치

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-managers">
  <TabItem value="pnpm" label="pnpm" default>

```bash
pnpm install @mash-up-web-toolkit/command
```

  </TabItem>
  <TabItem value="npm" label="npm">

```bash
npm install @mash-up-web-toolkit/command
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add @mash-up-web-toolkit/command
```

  </TabItem>
</Tabs>

## 2. CLI 실행

<Tabs groupId="package-managers">
  <TabItem value="pnpm" label="pnpm" default>

```bash
pnpm mash-up-web
```

:::tip
pnpm은 `node_modules/.bin` 경로를 자동으로 인식합니다.
:::

  </TabItem>
  <TabItem value="npm" label="npm">

```bash
npx mash-up-web
```

:::info
npx는 로컬에 설치된 패키지를 자동으로 찾아 실행합니다.
:::

  </TabItem>
  <TabItem value="yarn" label="yarn">

**package.json 스크립트 추가**

```json
{
  "scripts": {
    ...
    "mash-up-web": "node .node_modules/.bin/mash-up-web"
  }
    ...
}

```

```bash
yarn mash-up-web
```

  </TabItem>
</Tabs>

## 3. 설정 파일 생성

CLI를 실행하면 대화형 인터페이스가 나타납니다:

![Gen Config](./img/mash-up-web-cli-gen-config.png)

### 선택 옵션

- **`gen:config`**: 프로젝트 설정 파일(`mashup.config.ts`) 생성

**첫 사용 시에는 반드시 `gen:config`를 먼저 선택하세요.**

### 생성되는 파일

`mashup.config.ts` 파일이 프로젝트 루트에 생성됩니다.

:::warning 중요
이미 파일이 존재할 경우 덮어쓰지 않습니다. 기존 설정을 유지합니다.
:::

## 4. 설정 파일 편집

생성된 `mashup.config.ts` 파일을 프로젝트에 맞게 수정하세요:

```ts
import type { MashupConfig } from '@mash-up-web-toolkit/command';

const config: MashupConfig = {
  'gen:api': {
    /**
     * @description 생성될 파일의 경로
     * @example "./src/api", "./src/__generated__"
     */
    output: './src/__generated__',

    /**
     * @description OpenAPI 스펙 문서 URL 또는 로컬 파일 경로
     * @example "https://petstore3.swagger.io/api/v3/openapi.json"
     * @example "./docs/openapi.json"
     */
    url: '여기에 OpenAPI 스펙 URL을 입력하세요',

    /**
     * @description HTTP 클라이언트 인스턴스 파일의 상대 경로
     * @example "@/lib/axios", "./src/utils/fetch"
     */
    instancePath: '@/lib/axios',

    /**
     * @description HTTP 클라이언트 파일 덮어쓰기 여부
     * - true: 매번 새로 생성 (기본값)
     * - false: 기존 파일이 있으면 건드리지 않음
     */
    httpClientRewrite: true,
  },
};

export default config;
```

### 설정 옵션 상세

| 옵션                | 필수 | 설명                                | 예시                             |
| ------------------- | ---- | ----------------------------------- | -------------------------------- |
| `output`            | ✅   | 생성될 API 파일들이 저장될 디렉토리 | `"./src/api"`                    |
| `url`               | ✅   | OpenAPI 스펙 문서 위치              | `"https://api.example.com/docs"` |
| `instancePath`      | ⚠️   | HTTP 클라이언트 인스턴스 경로       | `"@/lib/axios"`                  |
| `httpClientRewrite` | ❌   | HTTP 클라이언트 파일 덮어쓰기 여부  | `true` (기본값)                  |

:::tip 인스턴스 파일이 없다면?
`instancePath`를 설정하지 않으면 기본 HTTP 클라이언트가 생성됩니다.
자세한 내용은 [Manual Configuration](./manual-config) 가이드를 참고하세요.
:::

## FAQ

**Q:** 설정 파일이 생성되지 않아요

**A:** 다음을 확인해보세요:

- 이미 `mashup.config.ts` 파일이 존재하는지 확인
- 프로젝트 루트 디렉토리에서 실행했는지 확인
- 쓰기 권한이 있는지 확인
