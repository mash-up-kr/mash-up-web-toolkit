import { generateApi, GenerateApiParams } from "swagger-typescript-api";

export const generateSwaggerApi = async (params: GenerateApiParams) => {
  return await generateApi(params)
    .then(() => {
      console.log("✅ API 생성 완료! 🌈✨");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ API 생성 실패:", error);
      process.exit(1);
    });
};
