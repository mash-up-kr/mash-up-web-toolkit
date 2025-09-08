<img width="687" height="95" alt="스크린샷 2025-09-08 오후 8 25 36" src="https://github.com/user-attachments/assets/c68aa3d0-aa52-4629-9e6d-12c7872abb21" />

# Mash-Up Web Toolkit

> Mash-Up 웹팀의 반복적인 개발 작업을 자동화하고 개선하는 도구 모음

## 🎯 프로젝트 목적

매 기수마다 진행되는 프로젝트에서 반복되는 작업들을 자동화하여 개발 효율성을 높이고, 일관된 코드 품질을 유지하기 위해 만들어진 도구입니다.

## ✨ 해결하는 문제들

- 🔄 **API 클라이언트 코드 중복 작성** → OpenAPI 스펙 기반 자동 생성
- ⚙️ **프로젝트 초기 설정의 반복** → 설정 파일 템플릿 자동 생성
- 🔧 **공통 유틸함수 재생성** → 검증된 타입 및 함수 라이브러리 제공

## 📦 도구 구성

### 🛠️ 개발 자동화 도구

- [`@mash-up-web-toolkit/command`](./packages/cli/command) - 통합 CLI 인터페이스
- [`@mash-up-web-toolkit/generate-api`](./packages/cli/generate-api) - API 클라이언트 코드 자동 생성
- [`@mash-up-web-toolkit/generate-config`](./packages/cli/generate-config) - 프로젝트 설정 템플릿 생성

### 📚 공통 라이브러리

- [`@mash-up-web-toolkit/util-types`](./packages/util-types) - 자주 사용되는 TypeScript 유틸리티 타입
- [`@mash-up-web-toolkit/utils`](./packages/utils) - 검증된 헬퍼 함수 모음

## 🏗️ 개발 현황

- ✅ **CLI 도구**: API 생성, 설정 파일 생성
- ✅ **유틸리티 타입**: 기본 타입 모음
- 🚧 **유틸리티 함수**: React/Next.js 헬퍼 함수
- 📋 **계획**: 컴포넌트 라이브러리, 테스트 도구

## 🤝 기여하기

Mash-Up 웹팀 구성원이라면 누구나 기여할 수 있습니다!

- 🐛 **버그 리포트**: Issues 탭에서 문제점 공유
- 💡 **기능 제안**: 반복 작업 발견 시 자동화 아이디어 제안
- 🔧 **코드 기여**: Pull Request로 개선사항 제출

## 📖 문서

- 현재 작업중입니다.
  - [시작하기]()
  - [사용법]()

---

**Made with ❤️ by Mash-Up Web Team**
