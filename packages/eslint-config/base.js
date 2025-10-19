import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          // Point to all package tsconfigs so it works from repo root or package dir
          project: [
            'tsconfig.json',
            'packages/*/tsconfig.json',
            'packages/cli/*/tsconfig.json',
            'apps/*/tsconfig.json',
          ],
        },
        node: {
          extensions: ['.js', '.mjs', '.ts', '.d.ts'],
        },
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'warn',

      // Import/Export 관련 규칙 강화 (라이브러리 개발에 중요)
      'import/no-cycle': 'error', // 순환 의존성 방지
      'import/no-self-import': 'error', // 자기 자신을 임포트하는 것 방지
      'import/no-unresolved': 'error', // 해당 모듈을 찾을 수 없을 때 에러 발생
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ], // 임포트 순서 그룹 설정
          'newlines-between': 'always', // 임포트 간 줄바꿈 강제
          alphabetize: {
            order: 'asc', // 알파벳 순서대로 정렬
            caseInsensitive: true, // 대소문자 구분 없이 정렬
          },
        },
      ],

      // TypeScript 관련 규칙 추가
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_', // 언더바로 시작하는 변수 무시
          varsIgnorePattern: '^_', // 언더바로 시작하는 변수 무시
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true, // 표현식 반환 타입 허용
          allowTypedFunctionExpressions: true, // 타입 함수 표현식 허용
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 방지

      // 일반 규칙 강화
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 사용 방지
      'no-debugger': 'error', // debugger 사용 방지
      'prefer-const': 'error', // const 사용 권장
      'no-var': 'error', // var 사용 방지

      // CLI 개발을 위한 규칙
      'no-process-exit': 'warn', // CLI에서는 process.exit() 사용 가능하므로 warn
    },
  },
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
    ],
  },
];
