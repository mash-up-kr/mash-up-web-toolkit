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
