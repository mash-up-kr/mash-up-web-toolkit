import { defineConfig } from '@mash-up-web-toolkit/command';

export default defineConfig({
    "gen:api": {
        output: "path.resolve(process.cwd(), './src/__generated__')",
        url: "url 입력해주세요",
    }
})
