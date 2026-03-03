import * as fs from 'node:fs';
import * as path from 'node:path';

import {
  fetchInstanceTemplate as fetchInstance,
  axiosInstanceTemplate as axiosInstance,
} from './config/template.js';

export const initApiInstanceConfig = (httpClientType: 'fetch' | 'axios') => {
  const outputPath = path.join(
    'src',
    'configs',
    '__generated__',
    httpClientType
  );
  const configPath = path.resolve(process.cwd(), outputPath, `instance.ts`);
  const dirPath = path.dirname(configPath);

  if (fs.existsSync(configPath)) {
    console.log('⚠️ instance.ts 파일이 이미 존재합니다.', configPath);
    return;
  }

  try {
    fs.mkdirSync(dirPath, { recursive: true });
  } catch (error) {
    console.error(`❌ 디렉토리 생성 실패: ${dirPath}`, error);
    return;
  }

  const template = httpClientType === 'fetch' ? fetchInstance : axiosInstance;

  try {
    fs.writeFileSync(configPath, template, 'utf-8');
    console.log('✅ instance.ts 파일 생성 완료!');
  } catch (error) {
    console.error('❌ instance.ts 파일 생성 중 오류:', error);
  }
};
