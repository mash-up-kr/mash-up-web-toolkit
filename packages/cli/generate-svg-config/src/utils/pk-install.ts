import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

export type PackageManager = "pnpm" | "yarn" | "npm"; // bun 미지원

export function detectPackageManager(cwd = process.cwd()): PackageManager {
  // 1) npm user agent 기반 (실행 시점 패키지 매니저 감지용, turbo env 선언 대상 아님)
  // eslint-disable-next-line turbo/no-undeclared-env-vars -- CLI 실행 컨텍스트에서만 사용되는 런타임 env
  const ua = process.env.npm_config_user_agent ?? "";

  if (ua.startsWith("pnpm")) return "pnpm";
  if (ua.startsWith("yarn")) return "yarn";
  if (ua.startsWith("npm")) return "npm";

  // 2) lockfile 기반 (현재 디렉터리 + 상위 디렉터리, pnpm 워크스페이스 대응)
  const hasInDir = (dir: string, p: string): boolean => existsSync(path.resolve(dir, p));
  let dir: string | null = path.resolve(cwd);
  while (dir) {
    if (hasInDir(dir, "pnpm-lock.yaml")) return "pnpm";
    if (hasInDir(dir, "yarn.lock")) return "yarn";
    if (hasInDir(dir, "package-lock.json")) return "npm";
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  // 3) 기본값
  return "npm";
}

function buildInstallArgs(
  pm: PackageManager,
  deps: string[],
  dev = false
): { cmd: string; args: string[] } {
  if (pm === "pnpm")
    return {
      cmd: "pnpm",
      args: ["add", dev ? "-D" : "", ...deps].filter(Boolean),
    };
  if (pm === "yarn")
    return {
      cmd: "yarn",
      args: ["add", dev ? "-D" : "", ...deps].filter(Boolean),
    };
  // npm
  return {
    cmd: "npm",
    args: ["install", dev ? "-D" : "", ...deps].filter(Boolean),
  };
}

function spawnAsync(
  cmd: string,
  args: string[],
  cwd = process.cwd()
): Promise<void> {
  return new Promise((resolve, reject) => {
    // spawn을 통해 외부 패키지 매니저(proccess) 실행 (예: npm, yarn, pnpm)
    const child = spawn(cmd, args, {
      stdio: "inherit", // 표준 입출력 스트림 상속 (터미널에 출력)
      cwd, // 작업 디렉토리 설정
      shell: process.platform === "win32", // 윈도우에서는 shell 옵션 필요
    });

    // 프로세스 종료시 결과 코드로 resolve/reject 처리
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`))
    );

    // spawn 실행 중 에러가 발생하면 reject
    child.on("error", reject);
  });
}

/**
 * 지정한 패키지들을 설치하는 함수
 *
 * @param deps     설치할 패키지 배열 (ex: ["react", "vite"])
 * @param options  부가 옵션 객체
 *                  - dev: 개발 의존성 여부 (기본값: false)
 *                  - pm: 사용할 패키지 매니저 (npm, yarn, pnpm)
 *                  - cwd: 작업 디렉토리 (기본값: 현재 작업 디렉토리)
 */
export async function installPackages(
  deps: string[],
  options?: { dev?: boolean; pm?: PackageManager; cwd?: string }
): Promise<void> {
  // 패키지 매니저 결정 (명시적으로 전달되지 않으면 detectPackageManager를 통해 자동 감지)
  const pm = options?.pm ?? detectPackageManager(options?.cwd);
  // 실제 설치에 사용할 커맨드와 인자 생성
  const { cmd, args } = buildInstallArgs(pm, deps, options?.dev ?? false);

  console.log(`⏳ 패키지 설치 중: ${cmd} ${args.join(" ")}`);

  // 커맨드를 비동기로 실행하여 패키지 설치
  try {
    await spawnAsync(cmd, args, options?.cwd);
  } catch (error) {
    console.error(`❌ 패키지 설치 중 오류가 발생했습니다: ${error}`);
  }
}

export async function installSvgrForNext(options?: {
  pm?: PackageManager;
  cwd?: string;
}) {
  await installPackages(["@svgr/webpack"], {
    dev: true,
    pm: options?.pm,
    cwd: options?.cwd,
  });
}

export async function installVitePluginSvgr(options?: {
  pm?: PackageManager;
  cwd?: string;
}) {
  await installPackages(["vite-plugin-svgr"], {
    dev: true,
    pm: options?.pm,
    cwd: options?.cwd,
  });
}
