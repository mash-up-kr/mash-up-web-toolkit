# Manual Configuration

## 1. 패키지 설치

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-managers">
  <TabItem value="pnpm1" label="pnpm" default>

```bash
pnpm install @mash-up-web-toolkit/command
```

  </TabItem>
  <TabItem value="npm1" label="npm">

```bash
npm install @mash-up-web-toolkit/command
```

  </TabItem>
  <TabItem value="yarn1" label="yarn">

```bash
yarn add @mash-up-web-toolkit/command
```

  </TabItem>
</Tabs>

`mashup.config.ts` 파일을 프로젝트 최상위 경로에 생성하새요.

```ts title="mashup.config.ts"
import type { MashupConfig } from '@mash-up-web-toolkit/command';

const config: MashupConfig = {
  'gen:api': {
    /**
     * @description 생성될 파일의 경로
     */
    output: '',

    /**
     * @description 생성할 API의 주소
     */
    url: '',

    /**
     * @description fetch 또는 axios 인스턴스 경로
     */
    instancePath: '',

    /**
     * @description httpClient 덮어쓰기 여부 (true: 덮어쓰기, false: 기존 파일 사용)
     */
    httpClientRewrite: false,
  },
};

export default config;
```
