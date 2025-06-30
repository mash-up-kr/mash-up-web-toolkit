import { generateApi } from "swagger-typescript-api";
import path from "node:path";
import fs from "node:fs";

export const generateSwaggerApi = async (
  params: Parameters<typeof generateApi>[0]
): ReturnType<typeof generateApi> => {
  return await generateApi(params)
    .then((generateApiOutput) => {
      return generateApiOutput;
    })
    .catch((error) => {
      console.error("❌ API 생성 실패:", error);
      process.exit(1);
    });
};

export const writeGeneratedApi = async ({
  result,
  outputPath,
  httpClientRewrite,
}: {
  result: Awaited<ReturnType<typeof generateApi>>;
  outputPath: string;
  httpClientRewrite?: boolean;
}) => {
  const { files } = await result;
  files.forEach((element) => {
    const { fileName, fileContent } = element;

    console.log(`📄 ${fileName} 파일 내용 길이:`, fileContent.length);
    console.log(
      `📄 ${fileName} 파일 내용 미리보기:`,
      fileContent.substring(0, 200)
    );

    const folderPath = getFolderPath(outputPath, fileName);

    fs.mkdirSync(folderPath, { recursive: true });
    if (fileName === "http-client") {
      if (httpClientRewrite) {
        createFile(path.resolve(folderPath, "index.ts"), fileContent);
      }
      return;
    } else if (fileName === "data-contracts") {
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
 * ## AUTHOR: brightbong92                                      ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */


`;
