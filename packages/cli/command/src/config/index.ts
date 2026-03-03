import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { build } from 'esbuild';

import { MashupConfig } from '@/types/types.js';

/**
 * package.json의 type 필드를 확인하여 format을 결정하는 함수
 */
function determineFormat(): 'esm' | 'cjs' {
  const cwd = process.cwd();
  const packageJsonPath = path.resolve(cwd, 'package.json');

  try {
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      return packageJson.type === 'module' ? 'esm' : 'cjs';
    }
  } catch (error) {
    console.warn('⚠️ package.json 읽기 실패, 기본값 cjs 사용:', error);
  }

  return 'cjs'; // 기본값
}

/**
 * 설정 파일을 로드하는 함수
 */
export async function loadConfig(): Promise<MashupConfig> {
  const possibleFiles = ['mashup.config.ts', 'mashup.config.js'];
  const cwd = process.cwd();

  for (const file of possibleFiles) {
    const fullPath = path.resolve(cwd, file);
    if (fs.existsSync(fullPath)) {
      try {
        const outDir = path.resolve('.mashup-temp');
        const outFile = path.join(outDir, 'mashup.config.js');

        fs.mkdirSync(outDir, { recursive: true });

        // esbuild로 번들링
        await build({
          entryPoints: [fullPath],
          bundle: true,
          write: true, // 파일에 실제로 쓰기
          platform: 'node',
          format: determineFormat(),
          outfile: outFile,
        });

        const require = createRequire(import.meta.url);
        let config = require(outFile).default;

        // default export가 있으면 사용, 없으면 모듈 자체를 사용
        if (config.default) {
          config = config.default;
        }

        // 임시 파일 정리
        try {
          fs.rmSync(outDir, { recursive: true });
        } catch (e) {
          throw new Error(`${outFile} 파일을 삭제하는데 실패했습니다. ${e}`);
        }

        // 타입 검증
        if (typeof config !== 'object' || config === null) {
          throw new Error(
            `⚠️ 설정 파일 ${fullPath}의 내용이 유효한 객체가 아닙니다.`
          );
        }

        return config as MashupConfig;
      } catch (error) {
        console.error('⚠️ 설정 파일 로드 중 오류:', error);
        throw error;
      }
    }
  }

  return {} as MashupConfig;
}

// 설정 타입 내보내기 (다른 패키지에서 사용 가능)
export * from '../types/types.js';
