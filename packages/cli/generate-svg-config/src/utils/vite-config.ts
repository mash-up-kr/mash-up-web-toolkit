import fs from "node:fs";
import path from "node:path";

import { parse, print, types, visit } from "recast";
import tsParser from "recast/parsers/typescript.js";

import { getClosestCallExpression } from "./ast.ts";

/**
 * Vite 설정 파일에 svgr 플러그인을 추가하는 함수
 */
export const addSvgrToViteConfig = (configPath: string): void => {
  // 1. 파일 읽기
  const configContent = fs.readFileSync(configPath, "utf8");

  // 2. AST로 파싱 (TypeScript 지원 파서 사용)
  const ast = parse(configContent, { parser: tsParser });

  let hasImportAdded = false;
  let hasPluginAdded = false;

  const pluginsProp = types.builders.property(
    "init",
    types.builders.identifier("plugins"),
    types.builders.arrayExpression([
      types.builders.callExpression(types.builders.identifier("svgr"), []),
    ])
  );

  // 3. AST 순회하며 수정
  visit(ast, {
    // import 문 추가
    visitProgram(path) {
      const { body } = path.node;

      // svgr import가 이미 있는지 확인
      const hasSvgrImport = body.some(
        (node) =>
          node.type === "ImportDeclaration" &&
          node.source?.value === "vite-plugin-svgr"
      );

      if (!hasSvgrImport) {
        // svgr import 추가 (적절한 위치에 삽입)
        const svgrImport = types.builders.importDeclaration(
          [
            types.builders.importDefaultSpecifier(
              types.builders.identifier("svgr")
            ),
          ],
          types.builders.literal("vite-plugin-svgr")
        );

        // vite import 다음에 삽입
        const viteImportIndex = body.findIndex(
          (node) =>
            node.type === "ImportDeclaration" && node.source?.value === "vite"
        );

        if (viteImportIndex !== -1) {
          body.splice(viteImportIndex + 1, 0, svgrImport);
        } else {
          // vite import가 없으면 맨 앞에 추가
          body.unshift(svgrImport);
        }

        hasImportAdded = true;
      }

      this.traverse(path);
    },

    // plugins 배열에 svgr() 추가
    visitArrayExpression(path) {
      const { node } = path;

      // plugins 배열인지 확인
      const parent = path.parent?.node;

      if (
        (parent?.type === "Property" || parent?.type === "ObjectProperty") &&
        node.type === "ArrayExpression"
      ) {
        const isPluginsKey =
          (types.namedTypes.Identifier.check(parent.key) &&
            parent.key.name === "plugins") ||
          (types.namedTypes.Literal.check(parent.key) &&
            String(parent.key.value) === "plugins");

        if (!isPluginsKey) {
          this.traverse(path);
          return;
        }
        // 이미 svgr()가 있는지 확인
        const hasSvgr = node.elements?.some((element) => {
          if (!types.namedTypes.CallExpression.check(element)) return false;
          const callee = element.callee;
          return (
            types.namedTypes.Identifier.check(callee) && callee.name === "svgr"
          );
        });

        if (!hasSvgr) {
          // svgr() 호출 추가
          const svgrCall = types.builders.callExpression(
            types.builders.identifier("svgr"),
            []
          );

          node.elements?.push(svgrCall);
          hasPluginAdded = true;
        }
      }

      this.traverse(path);
    },

    visitCallExpression(path) {
      const { node } = path;

      const isMergeConfig =
        types.namedTypes.Identifier.check(node.callee) &&
        node.callee.name === "mergeConfig";

      if (!isMergeConfig) {
        this.traverse(path);
        return;
      }

      // mergeConfig 함수의 인자 중 객체로 받는 인자에서 plugins 속성이 있는지 확인
      const hasPlugins = node.arguments
        .filter(
          (arg) =>
            arg.type === "ObjectExpression" ||
            (arg.type === "TSSatisfiesExpression" &&
              arg.expression.type === "ObjectExpression")
        )
        .map((arg) => {
          if (types.namedTypes.ObjectExpression.check(arg)) {
            return arg;
          }
          if (types.namedTypes.TSSatisfiesExpression.check(arg)) {
            return arg.expression;
          }
          return null;
        })
        .some((child) => {
          if (child === null) return false;
          if (types.namedTypes.ObjectExpression.check(child)) {
            return child.properties.some(
              (prop) =>
                types.namedTypes.ObjectProperty.check(prop) &&
                types.namedTypes.Identifier.check(prop.key) &&
                prop.key.name === "plugins"
            );
          }

          return false;
        });

      // 이미 plugins 속성이 있으면 추가하지 않음
      // plugins 속성이 없으면 추가
      if (!hasPlugins) {
        // node.arguments의 마지막 인자에 바로 추가하는게 아니라,
        // plugins: [svgr()] 속성을 가진 ObjectExpression을 새로 만들어 node.arguments의 마지막 인자로 추가

        const newObj = types.builders.objectExpression([pluginsProp]);
        node.arguments.push(newObj);
        hasPluginAdded = true;
      }

      this.traverse(path);
    },

    // (defineConfig 함수의 인자로 함수를 넘길 때,) config 객체를 리턴하는 경우 처리
    visitArrowFunctionExpression(path) {
      const callExpr = getClosestCallExpression(path);
      const { node } = path;

      // defineConfig 함수의 인자로 함수를 넘길 때, config 객체를 리턴하는 경우
      if (
        types.namedTypes.Identifier.check(callExpr?.callee) &&
        callExpr?.callee?.name === "defineConfig" &&
        types.namedTypes.ArrowFunctionExpression.check(node) &&
        node.body.type === "ObjectExpression"
      ) {
        const hasPlugins = node.body.properties.some(
          (prop) =>
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === "plugins"
        );

        if (!hasPlugins) {
          node.body.properties.push(pluginsProp);
          hasPluginAdded = true;
        }
      }
      this.traverse(path);
    },

    visitReturnStatement(path) {
      const callExpr = getClosestCallExpression(path);

      // console.log(callExpr);

      const { node } = path;
      if (
        types.namedTypes.Identifier.check(callExpr?.callee) &&
        callExpr?.callee?.name === "defineConfig" &&
        types.namedTypes.ReturnStatement.check(node) &&
        types.namedTypes.ObjectExpression.check(node.argument)
      ) {
        const hasPlugins = node.argument.properties.some(
          (prop) =>
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === "plugins"
        );

        if (!hasPlugins) {
          node.argument.properties.push(pluginsProp);
          hasPluginAdded = true;
        }
      }
      this.traverse(path);
    },

    // export default로 바로 객체를 내보내는 경우
    visitExportDefaultDeclaration(path) {
      const { node } = path;
      if (
        types.namedTypes.ExportDefaultDeclaration.check(node) &&
        node.declaration.type === "ObjectExpression"
      ) {
        const hasPlugins = node.declaration.properties.some(
          (prop) =>
            types.namedTypes.ObjectProperty.check(prop) &&
            types.namedTypes.Identifier.check(prop.key) &&
            prop.key.name === "plugins"
        );

        if (!hasPlugins) {
          node.declaration.properties.push(pluginsProp);
          hasPluginAdded = true;
        }
      }
      this.traverse(path);
    },
  });

  // 4. 변경사항이 있으면 파일에 쓰기
  if (hasImportAdded || hasPluginAdded) {
    const modifiedCode = print(ast, {
      tabWidth: 2,
      useTabs: false,
      quote: "double",
    }).code;

    fs.writeFileSync(configPath, modifiedCode, "utf8");

    console.log("✅ vite.config.ts에 svgr 플러그인이 추가되었습니다.");

    if (hasImportAdded) {
      console.log("  - vite-plugin-svgr import 추가됨");
    }
    if (hasPluginAdded) {
      console.log("  - plugins 배열에 svgr() 추가됨");
    }
  } else {
    console.log("✅ vite.config.ts에 이미 svgr 플러그인이 설정되어 있습니다.");
  }
};

/**
 * 사용 예시
 */
export const setupViteSvgr = (lang: "ts" | "js"): void => {
  const configPath = path.resolve(process.cwd(), `vite.config.${lang}`);

  if (!fs.existsSync(configPath)) {
    console.error(`❌ vite.config.${lang} 파일을 찾을 수 없습니다.`);
    return;
  }

  try {
    addSvgrToViteConfig(configPath);
  } catch (error) {
    console.error(`❌ vite.config.${lang} 수정 중 오류가 발생했습니다:`, error);
  }
};
