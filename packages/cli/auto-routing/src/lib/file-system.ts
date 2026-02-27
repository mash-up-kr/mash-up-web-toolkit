import { readdir, stat, mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * 주어진 경로에 파일이나 디렉토리가 존재하는지 확인합니다.
 * @param path - 확인할 파일 또는 디렉토리 경로
 * @returns 경로가 존재하면 true, 그렇지 않으면 false를 반환하는 Promise
 * @throws 'ENOENT' 이외의 파일 시스템 오류가 발생하면 에러를 던집니다.
 */
async function pathExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

/**
 * Next.js 프로젝트 루트에서 'app' 또는 'src/app' 디렉토리를 찾습니다.
 * @param projectRoot - Next.js 프로젝트의 루트 디렉토리 경로
 * @returns 'app' 디렉토리의 절대 경로를 반환하는 Promise
 * @throws 'app' 또는 'src/app' 디렉토리를 찾을 수 없는 경우 에러를 던집니다.
 */
export async function findAppDirectory(projectRoot: string) {
  const targetPaths = [
    path.join(projectRoot, "app"),
    path.join(projectRoot, "src", "app"),
  ];

  for (const targetPath of targetPaths) {
    if (
      (await pathExists(targetPath)) &&
      (await stat(targetPath)).isDirectory()
    ) {
      return targetPath;
    }
  }

  throw new Error(
    `${projectRoot}에서 'app' 또는 'src/app' 디렉토리를 찾을 수 없습니다.`,
  );
}

/**
 * 지정된 디렉토리 내의 모든 파일 경로를 재귀적으로 탐색하여 배열로 반환합니다.
 * 'node_modules', '.next' 등 특정 디렉토리는 탐색에서 제외됩니다.
 * @param dirPath - 탐색을 시작할 디렉토리 경로
 * @returns 파일 경로 문자열의 배열을 반환하는 Promise
 */
export const getAllFilePaths = async (dirPath: string): Promise<string[]> => {
  // 탐색에서 제외할 디렉토리 목록
  const IGNORED_DIRS = ["node_modules", ".next", ".turbopack", "__generated__"];

  // 주어진 디렉토리의 모든 항목(파일 및 하위 디렉토리)을 읽어옵니다.
  const entries = await readdir(dirPath, { withFileTypes: true });

  // 각 항목을 순회하며 파일 경로를 수집하는 비동기 작업을 생성합니다.
  const filePromises = entries.map(async (entry) => {
    // 현재 항목의 전체 경로를 구성합니다.
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // 무시할 디렉토리 목록에 포함된 경우, 더 이상 탐색하지 않고 빈 배열을 반환합니다.
      if (IGNORED_DIRS.includes(entry.name)) {
        return [];
      }

      // 하위 디렉토리에 대해 재귀적으로 함수를 호출합니다.
      return getAllFilePaths(fullPath);
    }
    // 항목이 파일인 경우, 해당 경로를 배열에 담아 반환합니다.
    return entry.isFile() ? [fullPath] : [];
  });

  // 모든 비동기 작업이 완료될 때까지 기다린 후, 결과를 1차원 배열로 펼쳐서 반환합니다.
  return (await Promise.all(filePromises)).flat();
};

/**
 * 주어진 경로에 파일 내용을 저장합니다. 경로에 해당하는 디렉토리가 없으면 생성합니다.
 * @param outputPath - 파일이 저장될 전체 경로
 * @param content - 파일에 저장할 문자열 내용
 * @returns 파일 저장이 완료되면 resolve되는 Promise
 */
export async function saveFile(
  outputPath: string,
  content: string,
): Promise<void> {
  const outputDir = path.dirname(outputPath);
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, content, "utf-8");
}
