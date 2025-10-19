import fs from "node:fs";
import path from "node:path";

import { parse, print, types, visit } from "recast";
import tsParser from "recast/parsers/typescript.js";

import {
  nextjsWebpackConfig,
  nextjsWebpackConfigWithTurbopack,
  nextjsWebpackConfigTS,
  nextjsWebpackConfigWithTurbopackTS,
} from "../template/nextjs-config.ts";
import type { ObjectExpression, Property, FunctionLike } from "../types/ast.ts";

import { ensureObjectProperty, getPropertyByKey } from "./ast.ts";

// recast의 NodePath의 타입이 별도 모듈로 export되지 않으므로, 아래와 같이 정의
type NodePathLike = {
  node: types.ASTNode;
  get: (name: string) => NodePathLike;
};

// Next.js 설정 객체(ObjectExpression)를 다양한 export 방식에서 찾는 함수
function findConfigObject(
  ast: types.ASTNode
): { path: NodePathLike; node: ObjectExpression } | null {
  let result: { path: NodePathLike; node: ObjectExpression } | null = null;

  // identifier가 객체 리터럴로 초기화된 const로 선언되었는지 확인하는 헬퍼 함수
  function resolveIdentifierToObject(
    idName: string
  ): { path: NodePathLike; node: ObjectExpression } | null {
    let found: { path: NodePathLike; node: ObjectExpression } | null = null;
    visit(ast, {
      visitVariableDeclarator(p) {
        const { node } = p;
        if (
          types.namedTypes.Identifier.check(node.id) &&
          node.id.name === idName &&
          node.init &&
          types.namedTypes.ObjectExpression.check(node.init)
        ) {
          // NodePath의 타입 정보 구체화
          found = { path: p.get("init") as NodePathLike, node: node.init };
          return false;
        }
        this.traverse(p);
      },
    });
    return found;
  }

  visit(ast, {
    // ESM 방식: export default { ... }
    visitExportDefaultDeclaration(p) {
      const { node } = p;
      if (types.namedTypes.ObjectExpression.check(node.declaration)) {
        result = {
          path: p.get("declaration") as NodePathLike,
          node: node.declaration,
        };
        return false;
      }
      if (types.namedTypes.Identifier.check(node.declaration)) {
        const resolved = resolveIdentifierToObject(node.declaration.name);
        if (resolved) {
          result = resolved;
          return false;
        }
      }
      this.traverse(p);
    },

    // CJS 방식: module.exports = { ... }
    visitAssignmentExpression(p) {
      const { node } = p;
      if (
        types.namedTypes.MemberExpression.check(node.left) &&
        types.namedTypes.Identifier.check(node.left.object) &&
        node.left.object.name === "module" &&
        ((types.namedTypes.Identifier.check(node.left.property) &&
          node.left.property.name === "exports") ||
          (types.namedTypes.Literal.check(node.left.property) &&
            node.left.property.value === "exports"))
      ) {
        if (types.namedTypes.ObjectExpression.check(node.right)) {
          result = { path: p.get("right") as NodePathLike, node: node.right };
          return false;
        }
        if (types.namedTypes.Identifier.check(node.right)) {
          const resolved = resolveIdentifierToObject(node.right.name);
          if (resolved) {
            result = resolved;
            return false;
          }
        }
      }
      this.traverse(p);
    },
  });

  return result;
}

// turbopack.rules에 *.svg 규칙을 추가하거나 병합하는 함수
function ensureTurbopackRule(configObj: ObjectExpression): void {
  const turbopack = ensureObjectProperty(configObj, "turbopack");
  const rules = ensureObjectProperty(turbopack, "rules");

  // '*.svg' 규칙 찾기
  let svgRuleProp = getPropertyByKey(rules, "*.svg") as
    | types.namedTypes.Property
    | types.namedTypes.ObjectProperty
    | null;

  if (!svgRuleProp) {
    svgRuleProp = types.builders.property(
      "init",
      types.builders.literal("*.svg"),
      types.builders.objectExpression([
        types.builders.property(
          "init",
          types.builders.identifier("loaders"),
          types.builders.arrayExpression([
            types.builders.literal("@svgr/webpack"),
          ])
        ),
        types.builders.property(
          "init",
          types.builders.identifier("as"),
          types.builders.literal("*.js")
        ),
      ])
    );
    rules.properties.push(svgRuleProp);
    return;
  }

  // 이미 규칙이 있으면, 필요한 필드만 추가(덮어쓰지 않음)
  const ruleObj = (
    svgRuleProp as types.namedTypes.Property | types.namedTypes.ObjectProperty
  ).value as ObjectExpression;
  if (!getPropertyByKey(ruleObj, "loaders")) {
    ruleObj.properties.push(
      types.builders.property(
        "init",
        types.builders.identifier("loaders"),
        types.builders.arrayExpression([
          types.builders.literal("@svgr/webpack"),
        ])
      )
    );
  }
  if (!getPropertyByKey(ruleObj, "as")) {
    ruleObj.properties.push(
      types.builders.property(
        "init",
        types.builders.identifier("as"),
        types.builders.literal("*.js")
      )
    );
  }
}

// webpack 메서드를 생성하는 코드 스니펫을 파싱하여 Property로 반환하는 함수
function createWebpackMethodProperty(): Property {
  const snippet = `const __x = { webpack(config) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileLoaderRule = config.module.rules.find((rule: any) =>
    rule.test?.test?.('.svg'),
  );

  config.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\\.svg$/i,
      resourceQuery: /url/,
    },
    {
      test: /\\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
      use: ['@svgr/webpack'],
    },
  );

  fileLoaderRule.exclude = /\\.svg$/i;

  return config;
} }`;

  const ast = parse(snippet, { parser: tsParser });
  let prop: Property | null = null;
  visit(ast, {
    visitVariableDeclarator(p) {
      const init = (p.node as types.namedTypes.VariableDeclarator).init;
      if (init && types.namedTypes.ObjectExpression.check(init)) {
        const found = getPropertyByKey(init, "webpack");
        if (found) {
          prop = found as Property;
          return false;
        }
      }
      this.traverse(p);
    },
  });
  if (!prop) throw new Error("Failed to build webpack property");
  return prop;
}

// webpack 함수 내부에 @svgr/webpack이 이미 포함되어 있는지 확인
function hasSvgrInWebpack(fn: FunctionLike): boolean {
  let found = false;
  visit(fn, {
    visitLiteral(p) {
      if (
        typeof p.node.value === "string" &&
        p.node.value === "@svgr/webpack"
      ) {
        found = true;
        return false;
      }
      this.traverse(p);
    },
  });
  return found;
}

// webpack 함수 내부에 svg 핸들링 구문을 삽입하거나 블록 변환
function injectWebpackSvgHandling(fn: FunctionLike): void {
  if (hasSvgrInWebpack(fn)) return;

  // 삽입할 구문을 파싱하여 Statement 배열로 만듦
  // 함수의 첫 번째 파라미터 이름을 보존하기 위해 임시 식별자(__CONFIG__ )를 사용
  const bodySnippet = `function __temp(__CONFIG__) {
  const fileLoaderRule = __CONFIG__.module.rules.find((rule) =>
    rule.test?.test?.('.svg'),
  );

  __CONFIG__.module.rules.push(
    {
      ...fileLoaderRule,
      test: /\\.svg$/i,
      resourceQuery: /url/,
    },
    {
      test: /\\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
      use: ['@svgr/webpack'],
    },
  );

  fileLoaderRule.exclude = /\\.svg$/i;
}`;

  const ast = parse(bodySnippet, { parser: tsParser });
  let statements: any[] = [];
  visit(ast, {
    visitFunctionDeclaration(p) {
      statements = p.node.body.body as any[];
      return false;
    },
  });

  // 기존 함수의 첫 번째 매개변수 식별자 이름을 가져와 __CONFIG__ 대체
  const params = (
    fn as
      | types.namedTypes.FunctionExpression
      | types.namedTypes.ArrowFunctionExpression
      | types.namedTypes.ObjectMethod
  ).params as (
    | types.namedTypes.Identifier
    | types.namedTypes.Pattern
    | null
    | undefined
  )[];

  const firstParam = params && params.length > 0 ? params[0] : null;
  const configIdentName =
    firstParam && types.namedTypes.Identifier.check(firstParam)
      ? firstParam.name
      : "config";

  statements.forEach((stmt) => {
    visit(stmt, {
      visitIdentifier(p) {
        if (p.node.name === "__CONFIG__") {
          p.replace(types.builders.identifier(configIdentName));
          return false;
        }
        this.traverse(p);
      },
    });
  });

  // 동일 스코프 내에 이미 fileLoaderRule 이 선언되어 있다면, 중복 선언을 제거
  let hasExistingFileLoaderRule = false;
  visit(fn, {
    visitVariableDeclarator(p) {
      const id = (p.node as types.namedTypes.VariableDeclarator).id;
      if (
        types.namedTypes.Identifier.check(id) &&
        id.name === "fileLoaderRule"
      ) {
        hasExistingFileLoaderRule = true;
        return false;
      }
      this.traverse(p);
    },
  });

  if (hasExistingFileLoaderRule) {
    statements = (statements as any[]).filter((s: any) => {
      if (!types.namedTypes.VariableDeclaration.check(s)) return true;
      // 남아있는 선언들 중 fileLoaderRule 을 선언하는 구문만 제거
      const decls =
        (s as types.namedTypes.VariableDeclaration).declarations || [];
      return !decls.some(
        (d) =>
          types.namedTypes.VariableDeclarator.check(d) &&
          types.namedTypes.Identifier.check(d.id) &&
          d.id.name === "fileLoaderRule"
      );
    });
  }

  // 함수의 body에 삽입 (return 문 이전, 없으면 맨 뒤)
  const body = (
    fn as
      | types.namedTypes.FunctionExpression
      | types.namedTypes.ArrowFunctionExpression
      | types.namedTypes.ObjectMethod
  ).body;
  if (types.namedTypes.BlockStatement.check(body)) {
    const idx = body.body.findIndex((s) =>
      types.namedTypes.ReturnStatement.check(s)
    );
    if (idx >= 0) {
      body.body.splice(idx, 0, ...(statements as any[]));
    } else {
      body.body.push(...(statements as any[]));
    }
  } else if (types.namedTypes.Expression.check(body)) {
    const originalExpr = body;
    (
      fn as
        | types.namedTypes.FunctionExpression
        | types.namedTypes.ArrowFunctionExpression
    ).body = types.builders.blockStatement([
      ...(statements as any[]),
      types.builders.returnStatement(originalExpr as any),
    ]);
  }
}

// config 객체에 webpack 프로퍼티가 없다면 생성, 있으면 patch
function ensureWebpackProperty(configObj: ObjectExpression): void {
  const webpackProp = getPropertyByKey(configObj, "webpack");
  if (!webpackProp) {
    const newWebpackProp = createWebpackMethodProperty();
    (configObj.properties as (Property | null)[]).push(newWebpackProp);
    return;
  }

  // 이미 존재하는 경우: 메서드면 그대로, 값이 함수라면 그 함수에 삽입
  if (types.namedTypes.ObjectMethod.check(webpackProp)) {
    injectWebpackSvgHandling(webpackProp);
    return;
  }

  const value = (
    webpackProp as types.namedTypes.Property | types.namedTypes.ObjectProperty
  ).value;
  if (
    types.namedTypes.FunctionExpression.check(value) ||
    types.namedTypes.ArrowFunctionExpression.check(value)
  ) {
    injectWebpackSvgHandling(value);
  }
}

// 요청된 확장자(lang)와 turbopack 사용 여부에 따라 알맞은 템플릿을 반환
function getNextConfigTemplate(
  lang: "js" | "mjs" | "ts",
  enableTurbopack: boolean
): string {
  // TS는 ESM 형식 템플릿 존재
  if (lang === "ts") {
    return enableTurbopack
      ? nextjsWebpackConfigWithTurbopackTS
      : nextjsWebpackConfigTS;
  }

  // JS는 CJS 템플릿 사용 (주의: 이름과 내용이 반대이므로 내용 기준으로 선택)
  if (lang === "js") {
    return enableTurbopack
      ? nextjsWebpackConfig
      : nextjsWebpackConfigWithTurbopack;
  }

  // mjs는 ESM이어야 하므로 TS용 ESM 템플릿을 JS로 다운그레이드
  const tsEsm = enableTurbopack
    ? nextjsWebpackConfigWithTurbopackTS
    : nextjsWebpackConfigTS;

  // 간단 변환: 타입 import 제거, 타입 주석 제거
  const withoutTypeImport = tsEsm.replace(
    /\n?import type \{\s*NextConfig\s*\} from 'next'\s*\n?/g,
    ""
  );
  const withoutTypeAnnotation = withoutTypeImport.replace(
    /const\s+nextConfig:\s*NextConfig\s*=\s*\{/g,
    "const nextConfig = {"
  );
  return withoutTypeAnnotation;
}

// Next.js config 파일을 수정해 turbopack과 webpack svg 처리를 추가하는 함수
export const updateNextConfig = (
  configPath: string,
  enableTurbopack: boolean
): void => {
  // 파일이 없으면 템플릿을 활용해 생성
  if (!fs.existsSync(configPath)) {
    const ext = path.extname(configPath); // '.js' | '.mjs' | '.ts'
    const lang = (ext.replace(".", "") || "js") as "js" | "mjs" | "ts";
    const template = getNextConfigTemplate(lang, enableTurbopack);

    fs.writeFileSync(configPath, template.trim() + "\n", "utf8");
    console.warn(
      `✅ ${path.basename(configPath)} 파일이 생성되었습니다. 템플릿이 적용되었습니다.`
    );
  }

  // 파일 내용을 파싱
  const original = fs.readFileSync(configPath, "utf8");
  let ast: types.ASTNode;
  try {
    ast = parse(original, { parser: tsParser });
  } catch (e) {
    console.error("❌ next config 파싱 중 오류가 발생했습니다.", e);
    return;
  }

  // 설정 객체 찾기
  const found = findConfigObject(ast);
  if (!found) {
    console.error(
      "❌ Next.js 설정 객체를 찾지 못했습니다. 수동으로 설정을 추가해주세요."
    );
    return;
  }

  const configObj = found.node;

  // turbopack 설정 추가
  if (enableTurbopack) {
    ensureTurbopackRule(configObj);
  }
  // webpack 설정 추가
  ensureWebpackProperty(configObj);

  // 변형된 AST를 코드로 변환
  const modified = print(ast, {
    tabWidth: 2,
    useTabs: false,
    quote: "double",
  }).code;

  // 변경 내용이 있으면 파일에 씀
  if (modified !== original) {
    fs.writeFileSync(configPath, modified, "utf8");
    console.warn(
      `✅ ${path.basename(configPath)}에 SVG 관련 설정이 적용되었습니다.`
    );
  } else {
    console.warn(
      `✅ ${path.basename(configPath)}에 이미 필요한 설정이 있습니다.`
    );
  }
};

// 확장자별로 next.config 파일을 쉽게 셋업하는 헬퍼 함수
export const setupNextSvgr = (useTurbopack: boolean): void => {
  const candidateFiles = [
    "next.config.ts",
    "next.config.js",
    "next.config.mjs",
  ];
  const foundConfigFile = candidateFiles.find((file) =>
    fs.existsSync(path.resolve(process.cwd(), file))
  );
  if (!foundConfigFile) {
    console.error(
      "❌ next.config.ts 또는 next.config.js 또는 next.config.mjs 파일을 찾을 수 없습니다."
    );
    return;
  }
  const resolvedConfigPath = path.resolve(process.cwd(), foundConfigFile);
  updateNextConfig(resolvedConfigPath, useTurbopack);
};
