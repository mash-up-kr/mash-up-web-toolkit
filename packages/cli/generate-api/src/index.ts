import path from "node:path";
import { generateApi } from "swagger-typescript-api";

export const runGenerateApi = async ({
  httpClientType,
}: {
  httpClientType: "fetch" | "axios";
}) => {
  generateApi({
    output: path.resolve(process.cwd(), "./src/generated"),
    url: "https://petstore.swagger.io/v2/swagger.json",
    httpClientType: httpClientType,
  })
    .then(() => {
      console.log("✅ API 생성 완료! 🌈✨");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ API 생성 실패:", error);
      process.exit(1);
    });
};
