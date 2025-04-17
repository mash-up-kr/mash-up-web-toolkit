# @mash-up-web-toolkit/generate-api

- OAS를 기반으로 API 클라이언트 코드를 자동 생성합니다. (axios / fetch 지원)

## How to use

1) axios 또는 fetch Instance파일을 생성합니다.
    - 샘플코드를 그대로 사용하셔도 됩니다.
2) [@mash-up-web-toolkit/command](https://github.com/mash-up-kr/mash-up-web-toolkit/tree/main/packages/cli/command "@mash-up-web-toolkit/command") 를 사용해 API code를 생성합니다.


## Instance sample code

```ts
// instance.ts (axios)

import axios, { AxiosError } from "axios";

const instance = axios.create({
  // baseURL을 작성해주세요.
  baseURL: "",
});

/**
 * 요청 인터셉터
 */
instance.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 */
instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error: AxiosError) => {
    try {
      return Promise.reject(error);
    } catch (e) {
      Promise.reject(e);
    }
  }
);

export default instance;

```

```ts
// instance.ts (fetch)

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
interceptors.request.use((config) => {
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
interceptors.response.use((response) => {
  return response;
});

Object.assign(customFetch, { interceptors });

export default customFetch;

```