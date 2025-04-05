import fs from "node:fs";
import path from "node:path";

const configTemplate = `import { defineConfig } from '@mash-up-web-toolkit/command';

export default defineConfig({
    "gen:api": {
        output: "path.resolve(process.cwd(), './src/__generated__')",
        url: "url 입력해주세요",
    }
})
`;

export const initConfig = (outputPath: string = "./") => {
  const configPath = path.resolve(
    process.cwd(),
    outputPath,
    "mashup.config.ts"
  );

  if (fs.existsSync(configPath)) {
    console.log("⚠️ 설정 파일이 이미 존재합니다:", configPath);
    return;
  }

  try {
    fs.writeFileSync(configPath, configTemplate, "utf-8");
    console.log("✅ 설정 파일이 생성되었습니다:", configPath);
  } catch (error) {
    console.error("❌ 설정 파일 생성 중 오류:", error);
  }
};
