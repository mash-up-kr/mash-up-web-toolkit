import { MashupConfig } from "@mash-up-web-toolkit/command";

const config: MashupConfig = {
  "gen:api": {
    /**
     * 생성될 파일의 경로
     */
    output: "./src/__generated__",

    /**
     * 생성할 API의 주소
     */
    url: "https://petstore.swagger.io/v2/swagger.json",

    /**
     * fetch 또는 axios 인스턴스 경로
     */
    instancePath: "@/configs/fetch/instance",
  },
};

export default config;
