# @mash-up-web-toolkit/generate-api

- OAS를 기반으로 API 클라이언트 코드를 자동 생성합니다. (axios / fetch 지원)

## How to use

1. axios 또는 fetch Instance파일을 생성합니다.
   - 샘플코드를 그대로 사용하셔도 됩니다.
2. [@mash-up-web-toolkit/command](https://github.com/mash-up-kr/mash-up-web-toolkit/tree/main/packages/cli/command "@mash-up-web-toolkit/command") 를 사용해 API code를 생성합니다.

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

## Options

```
  -p, --path <path>             path/url to swagger scheme
  -o, --output <output>         output path of typescript api file (default: "./")
  -n, --name <name>             name of output typescript api file (default: "Api.ts")
  -t, --templates <path>        path to folder containing templates
  -d, --default-as-success      use "default" response status code as success response too.
                                some swagger schemas use "default" response status code
                                as success response type by default. (default: false)
  -r, --responses               generate additional information about request responses
                                also add typings for bad responses (default: false)
  --union-enums                 generate all "enum" types as union types (T1 | T2 | TN) (default: false)
  --route-types                 generate type definitions for API routes (default: false)
  --no-client                   do not generate an API class
  --enum-names-as-values        use values in 'x-enumNames' as enum values (not only as keys) (default: false)
  --js                          generate js api module with declaration file (default: false)
  --extract-request-params      extract request params to data contract (default: false)
                                Also combine path params and query params into one object
  --module-name-index <number>  determines which path index should be used for routes separation (default: 0)
                                (example: GET:/fruites/getFruit -> index:0 -> moduleName -> fruites)
  --module-name-first-tag       splits routes based on the first tag
  --modular                     generate separated files for http client, data contracts, and routes (default: false)
  --disableStrictSSL            disabled strict SSL (default: false)
  --clean-output                clean output folder before generate api. WARNING: May cause data loss (default: false)
  --axios                       generate axios http client (default: false)
  --single-http-client          Ability to send HttpClient instance to Api constructor (default: false)
  --silent                      Output only errors to console (default: false)
  --default-response <type>     default type for empty response schema (default: "void")

```
