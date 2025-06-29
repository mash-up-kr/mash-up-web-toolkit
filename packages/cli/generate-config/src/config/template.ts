export const configTemplate = `import type { MashupConfig } from '@mash-up-web-toolkit/command';

const config: MashupConfig = {
  "gen:api": {
    /**
     * @description 생성될 파일의 경로
     */
    output: "./src/__generated__",

    /**
     * @description 생성할 API의 주소
     */
    url: "주소를 입력해주세요.",

    /**
     * @description fetch 또는 axios 인스턴스 경로
     */
    instancePath: "@/configs/axios/instance",
  },
};

export default config;
`;
