---
title: "Machodown 개발 회고 — 직접 만든 마크다운 에디터"
date: "2026-05-24"
category: dev
excerpt: "쓸만한 마크다운 에디터가 없어서 직접 만들었다. Electron IPC 설계부터 macOS 공증까지, 개인 프로젝트를 70%에서 멈추지 않고 끝낸 기록."
featured: false
tags: ["Electron", "macOS", "개발회고", "Homebrew", "GitHub Actions"]
---

쓸만한 마크다운 에디터가 없었다.

더 정확히 말하면, 내가 원하는 딱 그 지점에 있는 게 없었다. 2024년 말, 여러 도구를 전전하다가 결국 직접 만들기로 했다. 그리고 v1.0.1 릴리즈와 macOS 공증까지 마쳤다. 이 글은 그 과정의 회고다.

## 불만에서 시작된 프로젝트

나는 마크다운을 많이 쓴다. 문서, 메모, 아이디어 정리가 전부 마크다운이다. 그런데 기존 에디터들이 항상 뭔가 아쉬웠다.

| 에디터 | 문제점 |
|--------|--------|
| Typora | 유료. WYSIWYG 방식이라 소스를 직접 보기 불편하다 |
| Obsidian | 너무 무겁다. 플러그인 생태계가 오히려 방해될 때가 많다 |
| VSCode | 에디터 경험은 최고지만 마크다운 전용으로 쓰기엔 과하다 |
| iA Writer | 예쁜데 기능이 너무 없다 |

원하는 게 구체적이었다. **VS Code 수준의 에디터 경험** — CodeMirror 기반의 구문 강조, 멀티커서, 키바인딩 — 에 **마크다운 전용 앱**의 심플함을 더한 것. 두 가지를 동시에 충족하는 도구가 없었으니 만들기로 했다.

프로젝트 이름은 Machodown. 마초(macho)에 마크다운(markdown)을 붙인 말장난이다. 어차피 처음엔 나 혼자 쓸 앱이었으니 이름이 뭐든 상관없었다.

## Electron을 선택한 이유와 IPC 설계

데스크톱 앱 프레임워크 후보는 셋이었다.

- **Tauri**: Rust 기반, 번들 사이즈가 작다. 그런데 웹뷰 렌더링이 플랫폼마다 다르고, Rust 코드까지 관리해야 한다는 게 부담이었다.
- **Flutter Desktop**: 크로스플랫폼 지원은 좋은데 내가 아는 언어가 아니다.
- **Electron**: Node.js + Chromium. 번들이 크고 메모리를 많이 먹는다는 단점은 있다. 하지만 React를 그대로 쓸 수 있고, 파일 시스템 접근, 네이티브 다이얼로그, 시스템 트레이 통합이 전부 검증된 패키지로 해결된다.

실용성을 택했다. Electron이었다.

초반 IPC(Inter-Process Communication) 구조는 단순했다. 렌더러에서 메인 프로세스를 향해 채널 이름 문자열을 그냥 던졌다. 동작했지만, 나중에 뒤를 돌아봤을 때 구멍투성이였다. `nodeIntegration: true`에 `contextIsolation: false`. 웹에서 불러온 스크립트가 `require('fs')`를 그냥 실행할 수 있는 구조였다.

보안 문제를 발견하고 전면 재설계했다. 최종 구조는 **채널 화이트리스트 방식**이다.

```typescript
// preload/index.ts
const ALLOWED_CHANNELS = [
  'fs:read-file',
  'fs:write-file',
  'dialog:open',
  'settings:get',
  'settings:set',
  'workspace:open',
  'watch:start',
  'watch:stop',
] as const;

contextBridge.exposeInMainWorld('api', {
  invoke: (channel: string, ...args: unknown[]) => {
    if (!ALLOWED_CHANNELS.includes(channel as typeof ALLOWED_CHANNELS[number])) {
      return Promise.reject(new Error(`Channel not allowed: ${channel}`));
    }
    return ipcRenderer.invoke(channel, ...args);
  }
});
```

허용되지 않은 채널은 즉시 reject된다. IPC 핸들러는 도메인별로 분리했다 — `fs`, `dialog`, `settings`, `session`, `workspace`, `watch`, `backup` 등 12개 파일. 새 기능을 추가할 때마다 타입 정의, 채널 화이트리스트, preload 노출, 메인 핸들러 이렇게 4곳을 수정해야 한다. 번거롭지만 명확함을 위해 감수했다.

## 파일 감시 루프 문제와 selfSaveRegistry

앱의 핵심 기능 중 하나는 외부 편집 감지다. 다른 앱이나 터미널에서 파일을 수정하면 에디터가 자동으로 반영하는 것. 처음엔 간단해 보였다.

실제로 구현해보니 무한루프가 터졌다.

```
앱이 파일을 저장
→ chokidar가 변경 감지
→ 파일을 다시 읽어서 에디터에 반영
→ 에디터가 또 저장
→ 처음으로 되돌아감
```

첫 번째 시도는 타임스탬프 비교였다. 앱이 저장한 직후에는 일정 시간 동안 파일 변경 이벤트를 무시하는 방식. 동작했지만, 저장 직후에 외부에서 파일을 건드리면 그 변경이 씹혔다. 타이밍에 의존하는 해결책은 믿을 수 없었다.

두 번째 시도가 `selfSaveRegistry`다.

```typescript
const selfSaveRegistry = new Map<string, number>();
const SELF_SAVE_TTL_MS = 300;

async function saveFile(filePath: string, content: string): Promise<void> {
  selfSaveRegistry.set(filePath, Date.now());
  await fs.writeFile(filePath, content, 'utf-8');
  setTimeout(() => selfSaveRegistry.delete(filePath), SELF_SAVE_TTL_MS);
}

function onFileChanged(filePath: string): void {
  const savedAt = selfSaveRegistry.get(filePath);
  if (savedAt && Date.now() - savedAt < SELF_SAVE_TTL_MS) {
    return; // 앱이 직접 저장한 파일 — 무시
  }
  reloadFile(filePath);
}
```

앱이 직접 저장할 때 해당 경로를 300ms 동안 등록해두고, 파일 변경 이벤트가 왔을 때 등록된 경로면 무시한다. 타임스탬프 비교와 달리 **저장 의도가 명시적으로 기록**되기 때문에 훨씬 신뢰성이 높다. 이 방식이 도입된 이후로 루프 관련 버그가 사라졌다.

부수 효과로, 저장 출처를 추적할 수 있게 됐다. 레지스트리에 타임스탬프 외에 출처 식별자를 넣으면 "어느 세션에서 이 파일을 마지막으로 건드렸나"를 알 수 있다. 아직 실제로 쓰진 않지만, 나중에 충돌 해결 UI를 붙인다면 유용한 기반이 될 것 같다.

## macOS 코드 서명과 공증

앱을 완성하고 배포 준비를 시작했다. macOS에서 "개발자를 확인할 수 없음" 경고 없이 실행되려면 **코드 서명(Code Signing)과 공증(Notarization)** 이 필요하다. 공증은 단순히 인증서를 붙이는 게 아니라, 빌드한 앱을 Apple 서버에 업로드해서 악성코드 검사를 받는 과정이다.

과정을 정리하면:

1. Apple Developer Program 가입 ($99/년)
2. Developer ID Application 인증서 + Developer ID Installer 인증서 발급
3. `entitlements.plist` 설정 — Hardened Runtime 활성화 필수
4. `electron-builder.yml`에 `notarize` 키 추가
5. Apple ID, App-specific password, Team ID를 GitHub Secrets에 등록
6. GitHub Actions 워크플로에서 빌드 → 서명 → 공증 → staple 순서로 자동화

6번 자동화가 가장 많은 시간을 잡아먹었다. 공증은 Apple 서버에 앱을 제출하고 결과를 폴링하는 방식인데, 네트워크 타임아웃으로 빌드가 실패하는 일이 반복됐다. `APPLE_API_KEY` 방식(App Store Connect API 키)과 `apple-id` 방식(Apple ID + App-specific password)을 오가며 시행착오를 했다.

결국 API 키 방식으로 안정화됐다. 최종 GitHub Actions 스니펫은 이렇다:

```yaml
- name: Notarize app
  env:
    APPLE_API_KEY: ${{ secrets.APPLE_API_KEY }}
    APPLE_API_KEY_ID: ${{ secrets.APPLE_API_KEY_ID }}
    APPLE_API_ISSUER: ${{ secrets.APPLE_API_ISSUER }}
  run: |
    xcrun notarytool submit ./dist/Machodown.dmg \
      --key "$APPLE_API_KEY" \
      --key-id "$APPLE_API_KEY_ID" \
      --issuer "$APPLE_API_ISSUER" \
      --wait

- name: Staple notarization
  run: xcrun stapler staple ./dist/Machodown.dmg
```

CI에서 처음으로 `✅ Successfully notarized` 로그가 찍혔을 때의 쾌감은 상당했다. 지금도 그 터미널 화면이 기억에 남는다. 빌드가 막혔을 땐 정말 막막했는데, `notarytool` 로그를 꼼꼼히 읽고 `com.apple.security.hardened-runtime` entitlement 하나를 빠뜨린 걸 찾아냈을 때 갑자기 풀렸다.

## Homebrew tap과 GitHub Pages

앱이 완성됐으니 배포 채널이 필요했다. macOS 사용자에게 가장 자연스러운 배포 방식은 Homebrew였다.

처음엔 `homebrew/cask` 공식 tap에 PR을 올리려 했다. 그런데 리뷰어로부터 거절당했다 — GitHub Stars 225개, Forks 90개 기준을 충족하지 못했다. 공식 tap 진입 장벽이 생각보다 높았다.

대신 자체 tap을 만들었다.

```bash
brew tap hongmacho/machodown
brew install --cask machodown
```

공식 tap보다 한 단계 더 필요하지만, 동작은 완전히 같다. SHA256 체크섬 검증, 버전 관리, 자동 업데이트까지 모두 된다. `Formula/machodown.rb`를 작성하고, 새 릴리즈를 태깅할 때마다 GitHub Actions가 자동으로 SHA256을 계산해서 탭 저장소를 업데이트한다.

```ruby
# Formula/machodown.rb (핵심 부분)
cask "machodown" do
  version "1.0.1"
  sha256 "abc123..." # GitHub Actions가 릴리즈마다 자동 갱신

  url "https://github.com/hongmacho/machodown/releases/download/v#{version}/Machodown-#{version}.dmg"

  app "Machodown.app"
end
```

랜딩 페이지는 GitHub Pages로 만들었다. Jekyll이나 별도 프레임워크 없이 `docs/index.html` 단일 파일로 만들었다. GitHub Pages가 `master` 브랜치의 `/docs` 폴더를 서빙한다. HTML 350줄에 인라인 CSS. 빌드 단계가 없으니 배포 속도가 즉각적이다. 프레임워크를 도입해서 얻을 게 없을 때는 안 쓰는 게 맞다는 걸 다시 확인했다.

## 잘한 것, 아쉬운 것, 남은 것

**잘한 것.**

도메인별 IPC 분리. 처음부터 파일 시스템, 다이얼로그, 설정, 워크스페이스를 분리해두니 나중에 기능 추가가 편했다. 핸들러가 12개 파일로 분산돼 있어도 찾는 데 5초가 안 걸린다. 반대로 말하면, 처음에 한 파일에 다 때려박았다가 나중에 쪼갰다면 훨씬 힘들었을 것 같다.

테스트 작성도 잘한 결정이었다. `launchFlow`, `fileWatch`, `autoSave`, `workspace` 등 핵심 시나리오를 E2E 테스트로 잡아뒀다. Electron Testing Library 구성이 처음엔 까다로웠지만, selfSaveRegistry를 리팩터링할 때 테스트가 안전망이 됐다. 테스트 없이 건드렸으면 뭔가 분명히 깨뜨렸을 것 같다.

**아쉬운 것.**

성능 프로파일링을 뒤에 했다. 앱이 어느 정도 완성된 시점에 Chrome DevTools로 렌더러 스레드를 찍어보니 에디터 상태 업데이트가 메인 스레드를 60ms씩 잡아먹고 있었다. `useMemo`를 적절히 쓰고 CodeMirror extension 업데이트를 분리하니 20ms 이하로 떨어졌다. 처음부터 프로파일링을 습관으로 들였으면 더 일찍 잡을 수 있었다. 기능 개발이 끝나고 최적화하면 된다는 생각이 틀린 건 아닌데, 최적화 대상이 예상 밖의 곳에 있을 수 있다는 걸 다시 배웠다.

**남은 것.**

이미지 첨부와 테이블 편집기다. 마크다운에서 이미지를 다루는 건 여전히 불편하다. 드래그 앤 드롭으로 이미지를 첨부하면 자동으로 로컬 경로를 삽입하는 기능을 넣을지, 아니면 cloud upload까지 붙일지 설계를 아직 못 정했다. 전자는 간단하고 후자는 복잡하다. 내가 직접 쓰면서 어느 쪽이 실제로 필요한지 먼저 파악하는 게 순서일 것 같다.

테이블 편집기는 CodeMirror 확장으로 구현 가능한지 먼저 검증해야 한다. `@codemirror/lang-markdown`이 테이블 셀 탐색을 얼마나 지원하는지 아직 파악을 못 했다. 다음 주에 POC를 해볼 생각이다.

v1.0.1 기준 Star는 아직 두 자리다. 공식 Homebrew tap 기준을 채우려면 멀었다. 그래도 배포까지 완성했다는 것, 그게 이번 프로젝트에서 제일 의미 있다. 개인 프로젝트를 70%에서 멈추지 않는 게 생각보다 드문 일이다.

코드는 [GitHub](https://github.com/hongmacho/machodown)에 MIT 라이선스로 공개되어 있다.
