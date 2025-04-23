import {
  generateApi,
  GenerateApiOutput,
  GenerateApiParams,
} from "swagger-typescript-api";
import path from "node:path";
import fs from "node:fs";

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

export const writeGeneratedApi = (
  result: GenerateApiOutput,
  outputPath: string
) => {
  const { files } = result;
  files.forEach((element) => {
    const { fileName, fileContent } = element;
    const folderPath = getFolderPath(outputPath, fileName);

    fs.mkdirSync(folderPath, { recursive: true });
    if (fileName === "http-client" || fileName === "data-contracts") {
      createFile(path.resolve(folderPath, "index.ts"), fileContent);
      return;
    }
    createFile(path.resolve(folderPath, `${fileName}.api.ts`), fileContent);
  });
};

const getFolderPath = (outputPath: string, name: string) => {
  switch (name) {
    case "http-client": {
      return path.resolve(outputPath, "@http-client");
    }
    case "data-contracts": {
      return path.resolve(outputPath, "@types");
    }
    default:
      return path.resolve(outputPath, name);
  }
};

const createFile = (path: string, content: string) => {
  const contentWithComment = `${commentTemplate}${content}`;
  fs.writeFileSync(path, contentWithComment);
};

const commentTemplate = `/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */


`;
