import { describe, it, expect, vi, afterEach } from "vitest";
import { Stats, Dirent } from "fs";
import * as fsPromises from "fs/promises";
import path from "path";
import { findAppDirectory, getAllFilePaths, saveFile } from "@/lib/file-system";

// 'fs/promises' 모듈을 모킹하여 실제 파일 시스템에 접근하지 않도록 합니다.
vi.mock("fs/promises");

describe("file-system 유틸리티 함수 테스트", () => {
  // 각 테스트가 끝난 후 모든 mock을 초기 상태로 복원합니다.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("findAppDirectory", () => {
    it('프로젝트 루트에 있는 "app" 디렉토리를 찾아야 합니다.', async () => {
      const projectRoot = "/test-project";
      const appDirPath = path.join(projectRoot, "app");
      const srcAppDirPath = path.join(projectRoot, "src", "app");

      const statMock = vi.spyOn(fsPromises, "stat");
      // findAppDirectory는 pathExists와 내부 로직에서 stat을 두 번 호출할 수 있습니다.
      statMock.mockResolvedValue({ isDirectory: () => true } as Stats);

      const result = await findAppDirectory(projectRoot);
      expect(result).toBe(appDirPath);
      // 'app' 경로에 대해 stat이 호출되었는지 확인합니다.
      expect(statMock).toHaveBeenCalledWith(appDirPath);
      // 'src/app' 경로는 확인하지 않아야 합니다.
      expect(statMock).not.toHaveBeenCalledWith(srcAppDirPath);
    });

    it('프로젝트 루트의 "src/app" 디렉토리를 찾아야 합니다.', async () => {
      const projectRoot = "/test-project";
      const appDirPath = path.join(projectRoot, "app");
      const srcAppDirPath = path.join(projectRoot, "src", "app");
      const enoentError: any = new Error("ENOENT");
      enoentError.code = "ENOENT";

      const statMock = vi.spyOn(fsPromises, "stat");
      // 첫 번째 경로('app')는 실패하고, 두 번째 경로('src/app')는 성공하도록 설정합니다.
      statMock.mockRejectedValueOnce(enoentError); // pathExists for 'app'
      statMock.mockResolvedValueOnce({ isDirectory: () => true } as Stats); // pathExists for 'src/app'
      statMock.mockResolvedValueOnce({ isDirectory: () => true } as Stats); // stat for 'src/app'

      const result = await findAppDirectory(projectRoot);
      expect(result).toBe(srcAppDirPath);
      // 두 경로 모두에 대해 stat이 호출되었는지 확인합니다.
      expect(statMock).toHaveBeenCalledWith(appDirPath);
      expect(statMock).toHaveBeenCalledWith(srcAppDirPath);
    });

    it('"app" 디렉토리를 찾지 못하면 에러를 던져야 합니다.', async () => {
      const projectRoot = "/test-project";
      const enoentError: any = new Error("ENOENT");
      enoentError.code = "ENOENT";
      vi.spyOn(fsPromises, "stat").mockRejectedValue(enoentError);

      await expect(findAppDirectory(projectRoot)).rejects.toThrow(
        `${projectRoot}에서 'app' 또는 'src/app' 디렉토리를 찾을 수 없습니다.`,
      );
    });
  });

  describe("getAllFilePaths", () => {
    it("디렉토리 내의 모든 파일 경로를 재귀적으로 반환해야 합니다.", async () => {
      const dirPath = "/fake/app";
      const ignoredDirPath = path.join(dirPath, ".next");
      const mockFsStructure = {
        [dirPath]: [
          { name: "page.tsx", isDirectory: () => false, isFile: () => true },
          { name: "dashboard", isDirectory: () => true, isFile: () => false },
          { name: ".next", isDirectory: () => true, isFile: () => false }, // 무시될 디렉토리
        ],
        [path.join(dirPath, "dashboard")]: [
          { name: "layout.tsx", isDirectory: () => false, isFile: () => true },
        ],
        [ignoredDirPath]: [
          { name: "cache.txt", isDirectory: () => false, isFile: () => true },
        ], // 이 파일은 무시되어야 함
      };

      // fs/promises의 readdir이 우리가 만든 가짜 파일 구조를 반환하도록 설정
      vi.spyOn(fsPromises, "readdir").mockImplementation(async (p) => {
        return mockFsStructure[p as keyof typeof mockFsStructure] as Dirent[];
      });

      const result = await getAllFilePaths(dirPath);

      expect(result).toEqual([
        path.join(dirPath, "page.tsx"),
        path.join(dirPath, "dashboard", "layout.tsx"),
      ]);
    });
  });

  describe("saveFile", () => {
    it("지정된 경로에 디렉토리를 생성하고 파일을 저장해야 합니다.", async () => {
      const mkdirMock = vi
        .spyOn(fsPromises, "mkdir")
        .mockResolvedValue(undefined);
      const writeFileMock = vi
        .spyOn(fsPromises, "writeFile")
        .mockResolvedValue(undefined);

      const outputPath = "/test-project/generated/routes.ts";
      const content = "export const ROUTES = {};";

      await saveFile(outputPath, content);

      // mkdir이 올바른 디렉토리 경로와 옵션으로 호출되었는지 확인합니다.
      expect(mkdirMock).toHaveBeenCalledWith(path.dirname(outputPath), {
        recursive: true,
      });

      // writeFile이 올바른 파일 경로, 내용, 인코딩으로 호출되었는지 확인합니다.
      expect(writeFileMock).toHaveBeenCalledWith(outputPath, content, "utf-8");
    });
  });
});
