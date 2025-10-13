import fs from 'node:fs';
import path from 'node:path';

import {
  svgrTypeDeclarationForNext,
  svgrTypeDeclarationForVite,
} from '../template/svgr-type-declaration.ts';
import { type ProjectType } from '../types/project.ts';

/**
 * svgr.d.ts 파일 또는 vite-env.d.ts 파일을 생성합니다.
 */
export const createTypeDeclaration = (projectType: ProjectType): void => {
  switch (projectType) {
    case 'next': {
      const typeFilePath = path.resolve(process.cwd(), 'svgr.d.ts');
      fs.writeFileSync(
        typeFilePath,
        svgrTypeDeclarationForNext.trim() + '\n',
        'utf8'
      );
      console.log(
        '✅ svgr.d.ts 타입 선언 파일이 생성(또는 덮어쓰기)되었습니다.'
      );
      break;
    }
    case 'vite': {
      const typeFilePath = path.resolve(process.cwd(), 'vite-env.d.ts');
      fs.writeFileSync(
        typeFilePath,
        svgrTypeDeclarationForVite.trim() + '\n',
        'utf8'
      );
      console.log(
        '✅ vite-env.d.ts 타입 선언 파일이 생성(또는 덮어쓰기)되었습니다.'
      );
      break;
    }
  }
};

/**
 * tsconfig.json의 include 배열에 SVG 타입 선언을 위한 항목을 추가합니다.
 */
export const updateTsConfigForNext = (): void => {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.json');
  let tsconfig: any;

  if (!fs.existsSync(tsconfigPath)) {
    // 파일이 없으면, 새로 생성하여 include 할 내용을 넣어준다.
    tsconfig = {
      include: [
        'svgr.d.ts',
        'next-env.d.ts',
        '**/*.ts',
        '**/*.tsx',
        '.next/types/**/*.ts',
      ],
    };
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify(tsconfig, null, 2) + '\n',
      'utf8'
    );
    console.log(
      '✅ tsconfig.json이 생성되고 SVG 관련 include가 추가되었습니다.'
    );
    return;
  }

  try {
    tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  } catch (e) {
    console.error('❌ tsconfig.json을 파싱하는데 실패했습니다.', e);
    return;
  }

  if (!Array.isArray(tsconfig.include)) {
    tsconfig.include = [];
  }

  const includes = [
    'svgr.d.ts',
    'next-env.d.ts',
    '**/*.ts',
    '**/*.tsx',
    '.next/types/**/*.ts',
  ];

  let updated = false;

  for (const inc of includes) {
    if (!tsconfig.include.includes(inc)) {
      tsconfig.include.push(inc);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify(tsconfig, null, 2) + '\n',
      'utf8'
    );
    console.log('✅ tsconfig.json에 SVG 관련 include가 추가되었습니다.');
  } else {
    console.log('✅ tsconfig.json에 이미 필요한 include가 모두 존재합니다.');
  }
};

// svgr 관련 타입 선언과 tsconfig.json 설정 전체 함수
export const svgrTypeSetup = (projectType: ProjectType): void => {
  createTypeDeclaration(projectType);
  if (projectType === 'next') updateTsConfigForNext();
};
