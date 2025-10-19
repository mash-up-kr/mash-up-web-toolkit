import fs from 'node:fs';
import path from 'node:path';

/**
 * package.json을 읽어서 파싱합니다.
 */
export const readPackageJson = (): any => {
  const packagePath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(packagePath)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch (e) {
    console.error('❌ package.json을 파싱하는데 실패했습니다.', e);
    return null;
  }
};

/**
 * package.json에서 특정 의존성이 있는지 확인합니다.
 */
export const hasDependency = (packageName: string): boolean => {
  const packageJson = readPackageJson();

  if (!packageJson) {
    return false;
  }

  return !!(
    packageJson.dependencies?.[packageName] ||
    packageJson.devDependencies?.[packageName] ||
    packageJson.peerDependencies?.[packageName]
  );
};
