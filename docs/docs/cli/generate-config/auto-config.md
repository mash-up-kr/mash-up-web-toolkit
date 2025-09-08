# Auto Configuration

```bash
pnpm install @mash-up-web-toolkit/command
```

run with command

```bash
pnpm mash-up-web
```

gen:config 를 선택하세요. Configuration File이 생성됩니다.

이미 존재할 경우 생성되지 않습니다.

![Gen Config](./img/mash-up-web-cli-gen-config.png)

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
