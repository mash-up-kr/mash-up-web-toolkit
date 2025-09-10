# @mash-up-web-toolkit/command

- Mash-Up Web Toolkit의 CLI 인터페이스입니다.
- API 생성, 설정 파일 생성 등의 작업을 자동화하는 도구를 제공합니다.

## Documentation

-[시작하기](https://mash-up-web-toolkit-docs.vercel.app/docs/category/installation)

## Related Dependencies

- [@mash-up-web-toolkit/generate-api](https://www.npmjs.com/package/@mash-up-web-toolkit/generate-api) - API 생성 기능 제공
- [@mash-up-web-toolkit/generate-config](https://www.npmjs.com/package/@mash-up-web-toolkit/generate-config) - 설정 파일 생성 기능 제공

## Usage

```bash
# pnpm
pnpm mash-up-web

# API 생성 명령어
pnpm mash-up-web gen:api
pnpm mash-up-web gen:api --type axios || fetch

# 설정 파일 생성 명령어
pnpm mash-up-web gen:config

#npm
npx mash-up-web


```
