import chalk from "chalk";
import { findAppDirectory, getAllFilePaths } from "@/lib/file-system";
import { createUrlPath, filterRouteFiles } from "@/lib/routing";
import { buildRouteObject } from "@/lib/object";
import { generateRoutesCode } from "@/lib/codegen";

/**
 * 프로젝트 내에서 Next.js App Router의 라우트 파일들을 찾습니다.
 * @param projectRoot - 검색을 시작할 프로젝트의 루트 경로
 * @returns 라우트 파일들의 경로를 담은 배열을 반환하는 Promise
 * @throws 파일을 찾는 과정에서 오류가 발생하면 에러를 던집니다.
 */
export const findRouteFiles = async (projectRoot: string) => {
  try {
    const appDir = await findAppDirectory(projectRoot);
    console.log(chalk.gray(`- app 디렉토리 발견: ${appDir}`));

    const allFiles = await getAllFilePaths(appDir);
    const routeFiles = filterRouteFiles(allFiles, appDir);
    console.log(
      chalk.gray(`- ${routeFiles.length}개의 라우트 파일을 찾았습니다.`),
    );

    return routeFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `라우팅 코드 생성 중 오류가 발생했습니다: ${error.message}`,
      );
    }

    throw new Error("라우팅 코드 생성 중 오류가 발생했습니다: Unknown Error");
  }
};

/**
 * 찾은 라우트 파일 목록을 기반으로 라우팅 상수 객체 코드를 생성합니다.
 * @param routeFiles - `findRouteFiles`를 통해 찾은 라우트 파일 경로 배열
 * @param projectRoot - 프로젝트 루트 경로, 'app' 디렉토리 경로를 다시 찾는 데 사용됩니다.
 * @returns 생성된 TypeScript 코드 문자열을 반환하는 Promise
 */
export const generateRouteCode = async (
  routeFiles: string[],
  projectRoot: string,
) => {
  const appDir = await findAppDirectory(projectRoot);
  const urlPaths = routeFiles.map((file) => createUrlPath(file, appDir));
  const routeObject = buildRouteObject(urlPaths);
  const generatedCode = generateRoutesCode(routeObject);

  return generatedCode;
};
