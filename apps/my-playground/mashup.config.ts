import { MashupConfig } from '@mash-up-web-toolkit/command';

const config: MashupConfig = {
  'gen:api': {
    /**
     * @description 생성될 파일의 경로
     */
    output: './src/__generated__',

    /**
     * @description 생성할 API의 주소
     */
    url: 'https://petstore3.swagger.io/api/v3/openapi.json',
    // url: "https://api.doongdoong.org/v3/api-docs",

    /**
     * @description fetch 또는 axios 인스턴스 경로
     */
    instancePath: '@/configs/axios/instance',

    httpClientRewrite: true,
  },
};

export default config;
