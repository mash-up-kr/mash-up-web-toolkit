export const configTemplate = `import { defineConfig } from '@mash-up-web-toolkit/command';

export default defineConfig({
    "gen:api": {
        /**
         * 생성될 파일의 경로
         */
        output: "./src/__generated__",
        
        /**
         * 생성할 API의 주소
         */
        url: "주소를 입력해주세요.",

        /**
         * fetch 또는 axios 인스턴스 경로
         */
        instancePath: "fetch 또는 axios 인스턴스 경로를 입력해주세요.",
    }
})
`;
