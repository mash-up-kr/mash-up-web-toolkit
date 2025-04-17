import { MashupConfig } from '@mash-up-web-toolkit/command';

const config: MashupConfig = {
  "gen:api": {
    /**
     * @description 생성될 파일의 경로
     */
    output: "./src/generated",

    /**
     * @description 생성할 API의 주소
     */
    url: "https://petstore.swagger.io/v2/swagger.json",

    /**
     * @description fetch 또는 axios 인스턴스 경로
     */
    instancePath: "@/configs/axios/instance",
  },
};

export default config;
