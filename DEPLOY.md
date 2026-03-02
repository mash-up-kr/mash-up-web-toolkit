# 배포 가이드 (Deployment Guide)

이 문서는 `mash-up-web-toolkit` 프로젝트의 npm 배포 프로세스를 설명합니다.

## 📋 사전 준비사항

1. **npm 로그인 확인**

   ```bash
   npm whoami
   ```

   - 로그인되어 있지 않다면: `npm login`
   - **2FA가 활성화된 조직의 경우:** Granular Access Token 사용 권장 (아래 "2단계 인증 오류" 참조)

2. **프로젝트 루트로 이동**

   ```bash
   cd /Users/bong/Desktop/Project/mash-up/mash-up-web-toolkit
   ```

3. **변경사항 확인**
   ```bash
   git status
   ```

## 🚀 배포 프로세스

### 1단계: Changeset 생성 (변경사항 문서화)

코드를 변경한 후, 커밋하기 **전에** changeset을 생성합니다.

```bash
pnpm changeset
```

**실행 시:**

- 변경한 패키지 선택 (스페이스바로 다중 선택 가능)
  - `@mash-up-web-toolkit/command`
  - `@mash-up-web-toolkit/generate-api`
  - `@mash-up-web-toolkit/generate-api-config`
  - `@mash-up-web-toolkit/generate-config`
  - `@mash-up-web-toolkit/util-types`
  - `@mash-up-web-toolkit/utils`
- 버전 타입 선택:
  - `patch`: 버그 수정 (0.0.1 → 0.0.2)
  - `minor`: 새 기능 추가 (0.0.1 → 0.1.0)
  - `major`: 호환성 깨지는 변경 (0.0.1 → 1.0.0)
- 변경사항 설명 입력

`.changeset/` 폴더에 마크다운 파일이 생성됩니다.

### 2단계: Changeset과 코드 변경사항 커밋

```bash
git add .
git commit -m "feat: 변경사항 설명"
git push origin main
```

### 3단계: 버전 업데이트 및 CHANGELOG 생성

```bash
pnpm changeset version
```

**이 명령어는:**

- `package.json`의 버전을 자동 업데이트
- 각 패키지의 `CHANGELOG.md` 자동 생성/업데이트
- `.changeset/` 폴더의 changeset 파일들 삭제

### 4단계: 버전 업데이트 커밋

```bash
git add .
git commit -m "chore: version bump"
git push origin main
```

### 5단계: 빌드

```bash
# 전체 빌드
pnpm build:all

# 또는 특정 패키지만 빌드
pnpm build:cli      # CLI 패키지들만
pnpm build:util-types  # util-types만
pnpm build:utils   # utils만
```

### 6단계: npm 배포

```bash
# 전체 배포
pnpm publish:all

# 또는 특정 패키지만 배포
pnpm publish:cli      # CLI 패키지들만
pnpm publish:util-types  # util-types만
pnpm publish:utils   # utils만
```

## 📦 배포되는 패키지 목록

### CLI 패키지들 (`publish:cli`)

- `@mash-up-web-toolkit/command`
- `@mash-up-web-toolkit/generate-api`
- `@mash-up-web-toolkit/generate-api-config`
- `@mash-up-web-toolkit/generate-config`

### 유틸리티 패키지들

- `@mash-up-web-toolkit/util-types` (`publish:util-types`)
- `@mash-up-web-toolkit/utils` (`publish:utils`)

## ⚠️ 주의사항

### 1. 버전 중복 오류

```
npm error 403 You cannot publish over the previously published versions: 0.0.15.
```

**해결:** `pnpm changeset version`을 실행하여 버전을 올려야 합니다.

### 2. npm 인증 오류

```
npm error 404 Not Found - You do not have permission to access it.
```

**해결:**

- `npm whoami`로 로그인 상태 확인
- `npm login`으로 재로그인
- npm 조직 권한 확인 (https://www.npmjs.com/org/mash-up-web-toolkit)

### 3. 2단계 인증 (2FA) 오류

```
npm error 403 Two-factor authentication or granular access token with bypass 2fa enabled is required to publish packages.
```

**해결 방법:**

**방법 1: Granular Access Token 사용 (권장)**

1. npm 웹사이트에서 토큰 생성:

   - https://www.npmjs.com/settings/[사용자명]/tokens 접속
   - "Generate New Token" → "Granular Access Token" 선택
   - 권한: `Publish` 선택
   - 조직: `mash-up-web-toolkit` 선택
   - "Bypass 2FA" 옵션 활성화 (가능한 경우)

2. 토큰을 `.npmrc` 파일에 설정:

   ```bash
   echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN_HERE" >> .npmrc
   ```

3. 또는 환경 변수로 설정:
   ```bash
   export NPM_TOKEN=YOUR_TOKEN_HERE
   ```

**방법 2: `--otp` 옵션 사용 (간단한 방법)**

배포할 때마다 2FA 코드를 직접 입력:

```bash
# 개별 패키지 배포 시
cd packages/cli/generate-api-config
pnpm publish --otp=123456 --access public

# 또는 전체 배포 스크립트 수정 필요 없이 직접 실행
npm publish --otp=123456 --access public
```

**단점:** 매번 2FA 코드를 입력해야 함

**방법 3: npm 재로그인 (세션 유지)**

1. npm 재로그인 (2FA 코드 입력):

   ```bash
   npm login
   ```

   - 이메일, 비밀번호, 2FA 코드 입력
   - 세션이 유지되는 동안 배포 가능

2. 배포:
   ```bash
   pnpm publish:all
   ```

**단점:** 세션이 만료되면 다시 로그인 필요

**방법 4: npm 계정에 2FA 활성화**

1. npm 웹사이트에서 2FA 활성화:

   - https://www.npmjs.com/settings/[사용자명]/profile 접속
   - "Two-Factor Authentication" 활성화

2. 배포 시 2FA 코드 입력

### 4. Git Unclean Working Tree 오류

```
ERR_PNPM_GIT_UNCLEAN  Unclean working tree. Commit or stash changes first.
```

**해결 방법:**

**방법 1: 변경사항 커밋 (권장)**

```bash
# 변경사항 확인
git status

# 변경사항 커밋
git add .
git commit -m "chore: update deploy guide and npmrc"
git push origin main

# 배포 재시도
pnpm publish:all
```

**방법 2: 변경사항 Stash (임시 저장)**

```bash
# 변경사항 임시 저장
git stash

# 배포
pnpm publish:all

# 변경사항 복원 (필요한 경우)
git stash pop
```

**방법 3: Git 체크 비활성화 (비권장)**

```bash
# 개별 패키지 배포 시
pnpm publish --no-git-checks --access public

# 또는 package.json의 publish 스크립트에 --no-git-checks 추가
```

**참고:** `.npmrc` 파일은 이미 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

### 5. Changeset 파일 누락

배포 전에 반드시 `pnpm changeset`을 실행하여 변경사항을 문서화해야 합니다.

## 🔄 빠른 참조 (체크리스트)

```bash
# 1. Changeset 생성
pnpm changeset

# 2. 커밋
git add . && git commit -m "feat: 변경사항" && git push

# 3. 버전 업데이트
pnpm changeset version

# 4. 커밋
git add . && git commit -m "chore: version bump" && git push

# 5. 빌드
pnpm build:all

# 6. 배포
pnpm publish:all
```

## 📝 Changeset 설정

- **자동 커밋:** 비활성화 (`commit: false`)
- **기본 브랜치:** `main`
- **내부 의존성 업데이트:** `patch` 버전으로 자동 업데이트

## 🆘 문제 해결

### 배포 실패 시

1. 버전이 이미 배포되었는지 확인: npm 웹사이트에서 패키지 버전 확인
2. 빌드가 성공했는지 확인: `pnpm build:all` 재실행
3. npm 로그인 상태 확인: `npm whoami`

### Changeset 파일이 있는데 버전 업데이트가 안 될 때

```bash
# changeset 파일 확인
ls -la .changeset/

# 버전 업데이트 강제 실행
pnpm changeset version
```

---

**마지막 업데이트:** 2025-12-10
