# Manual Configuration

```bash
pnpm install @mash-up-web-toolkit/command
```

아래의 코드를 복사해 `mashup.config.ts` 파일을 생성하새요.

```ts
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
