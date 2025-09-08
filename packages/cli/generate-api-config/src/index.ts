import * as fs from 'node:fs';
import * as path from 'node:path';

import { axiosTemplate, fetchTemplate } from './config/template.js';

export const initHttpClientConfig = (httpClientType: 'fetch' | 'axios') => {
  const outputPath: string = './src/configs/__generated__';

  const configPath = path.resolve(
    process.cwd(),
    `${outputPath}/${httpClientType}`,
    `instance.ts`
  );

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

  const template = httpClientType === 'fetch' ? fetchTemplate : axiosTemplate;

  try {
    fs.writeFileSync(configPath, template, 'utf-8');
    console.log('✅ instance.ts 파일 생성 완료!');
  } catch (error) {
    console.error('❌ instance.ts 파일 생성 중 오류:', error);
  }
};
