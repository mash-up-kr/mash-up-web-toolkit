# gen:api

## 1. 자동 설정

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="package-managers">
  <TabItem value="pnpm2" label="pnpm" default>

```bash
pnpm mash-up-web
```

  </TabItem>
  <TabItem value="npm2" label="npm">

```bash
npx mash-up-web
```

  </TabItem>
  <TabItem value="yarn2" label="yarn">

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

`gen:api-config` 를 선택해 `axios` 또는, `fetch` `instance` 파일을 생성하세요.

:::info
`instance.ts` 파일은 `./src/configs/__generated__/instance.ts` 경로에 설치됩니다.

:::

## 2. 수동 설정

`instance.ts` 파일을 생성합니다.

### fetch

```ts
// instance.ts

/**
 * 인터셉터 처리를 위한 핸들러 함수
 */
let requestInterceptor: ((config: RequestInit) => RequestInit) | null = null;
let responseInterceptor: ((response: Response) => Response) | null = null;

/**
 * fetch API를 확장한 커스텀 함수
 * 요청/응답 인터셉터 기능 제공
 */
const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  try {
    // 요청 전 인터셉터 적용
    let config = init || {};
    if (requestInterceptor) {
      config = requestInterceptor(config);
    }

    // 실제 fetch 요청 실행
    const response = await fetch(input, config);

    // 응답 후 인터셉터 적용
    if (responseInterceptor) {
      return responseInterceptor(response);
    }

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * 인터셉터 설정 인터페이스
 */
const interceptors = {
  request: {
    use: (handler: (config: RequestInit) => RequestInit) => {
      requestInterceptor = handler;
    },
  },
  response: {
    use: (handler: (response: Response) => Response) => {
      responseInterceptor = handler;
    },
  },
};

// 요청 인터셉터 설정
interceptors.request.use(config => {
  return {
    ...config,
    headers: {
      ...config.headers,
      // 필요한 헤더 추가
      // 예: "Content-Type": "application/json",
    },
  };
});

// 응답 인터셉터 설정
interceptors.response.use(response => {
  return response;
});

Object.assign(customFetch, { interceptors });

export default customFetch;
```

### axios

```ts
// instance.ts

import axios, { AxiosError } from 'axios';

const instance = axios.create({
  // baseURL을 작성해주세요.
  baseURL: '',
});

/**
 * 요청 인터셉터
 */
instance.interceptors.request.use(
  async config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 */
instance.interceptors.response.use(
  res => {
    return res;
  },
  async (error: AxiosError) => {
    try {
      return Promise.reject(error);
    } catch (e) {
      return Promise.reject(e);
    }
  }
);

export default instance;
```
