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
    }
})
`;
