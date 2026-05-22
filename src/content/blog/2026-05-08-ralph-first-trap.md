---
title: "ralph 모드 첫 실행에서 30분 만에 빠진 함정"
date: "2026-05-08"
category: "dev"
excerpt: "oh-my-claudecode의 ralph를 처음 돌렸더니 에이전트가 30분 동안 같은 스토리를 검증 못 해 루프를 돌았다. 원인은 PRD의 추상적인 acceptance criteria였다."
featured: false
tags: ["Claude Code", "ralph", "oh-my-claudecode", "PRD", "에이전틱 워크플로우"]
readTime: 6
---

지난주 금요일 오후, `/oh-my-claudecode:ralph`를 처음 실행했다. 30분 뒤 터미널을 보니 에이전트가 같은 스토리의 verification을 열여덟 번 재시도하고 있었다. 통과도 실패도 아닌 채로 루프만 돌고 있었다. 전기료가 아깝기도 했고, 내가 뭘 잘못한 건지 바로 알 수 없어서 멈추고 원인을 뒤졌다.

## ralph가 뭘 하는 모드인지

ralph는 oh-my-claudecode의 자기 참조 루프 모드다. 스스로 실행하고, 실행 결과를 검증하고, 검증을 통과할 때까지 반복한다. PRD 파일을 던지면 에이전트가 acceptance criteria를 하나씩 체크하면서 스토리를 완료 처리한다.

사람이 하던 "짜고, 돌려보고, 됐으면 다음 것" 루프를 에이전트가 자율로 돌린다. 잘 쓰면 사람은 PRD만 쓰고 커피 마시는 동안 결과물이 나온다. 나는 그걸 기대했다.

처음 ralph를 알게 된 건 oh-my-claudecode 문서를 훑다가였다. 루프 기반 자율 실행이라는 설명을 보고, 반복적인 CRUD API 스토리를 처리하는 데 쓰면 좋겠다고 판단했다. 그날 오후에 바로 실제 프로젝트 PRD를 가져다 돌렸다. 문서를 더 읽지 않은 게 실수였다. ralph가 criteria를 어떻게 해석하는지, 어떤 형식을 기대하는지 확인하지 않고 기존에 쓰던 PRD 형식을 그대로 넣었다.

## 첫 번째 실패 — acceptance criteria가 문장이었다

처음 PRD를 짤 때 `prd.json`의 acceptance criteria를 이렇게 썼다.

```json
{
  "stories": [
    {
      "id": "S-01",
      "title": "사용자 프로필 API 엔드포인트 추가",
      "acceptance_criteria": [
        "프로필 조회 API가 정상적으로 동작한다",
        "인증되지 않은 요청은 401을 반환한다",
        "Implementation is complete and tested"
      ]
    }
  ]
}
```

문장이다. "정상적으로 동작한다"는 주관적이고, "Implementation is complete"는 에이전트 자신이 완료했다고 선언하면 끝이다. 검증 명령이 없다.

ralph는 각 criteria를 터미널 명령으로 검증하려 한다. "정상적으로 동작한다"를 grep으로 확인할 수 없고, curl로 확인할 수도 없다. 에이전트는 이 criteria를 통과시킬 객관적 방법을 찾지 못한 채 다른 접근을 시도하고, 실패하고, 다시 시도하는 루프에 빠졌다.

30분 동안 에이전트가 한 일은 엔드포인트를 다양한 방식으로 구현했다가 지우는 것이었다. 코드는 계속 바뀌었지만 검증이 통과하지 못하니 스토리는 완료되지 않았다.

> 추상적인 PRD는 에이전트의 무한 루프 연료다.

## 두 번째 시도 — criteria를 명령 단위로 바꿨다

원인을 파악하고 PRD를 다시 썼다. criteria를 "실행하면 pass/fail이 나오는 명령"으로만 구성했다.

```json
{
  "stories": [
    {
      "id": "S-01",
      "title": "사용자 프로필 API 엔드포인트 추가",
      "acceptance_criteria": [
        "grep -q 'router.get.*\\/profile' src/routes/user.ts && echo PASS",
        "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/profile | grep -q '200'",
        "curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/profile -H 'Authorization: ' | grep -q '401'",
        "ls src/routes/__tests__/user.test.ts | wc -l | grep -q '1'"
      ]
    }
  ]
}
```

각 항목이 쉘 명령이고, 명령의 exit code가 0이면 통과다. grep이 매칭하면 0, 아니면 1. curl이 예상 HTTP 코드를 반환하면 통과. 파일이 존재하면 통과.

에이전트 입장에서는 "이 명령을 실행했을 때 exit 0이 나오는 코드를 짜면 된다"는 명확한 목표가 생긴다. 모호함이 없다.

## 두 번째 실행 결과

같은 스토리를 두 번째 PRD로 다시 돌렸다. 7분 만에 S-01이 완료됐다. 에이전트가 라우트 파일을 만들고, 인증 미들웨어를 연결하고, 테스트 파일을 생성한 뒤 네 개 criteria를 순서대로 실행해서 전부 통과시켰다. 재시도는 한 번 있었다. HTTP 코드 검증에서 서버가 아직 안 떴다는 이유였고, 에이전트가 직접 서버를 백그라운드로 띄운 뒤 재시도해서 통과했다.

첫 번째 실행과 차이는 딱 하나였다. PRD에서 문장을 없애고 명령으로 바꾼 것.

7분과 30분의 차이가 어디서 왔는지 생각해봤다. 첫 번째 실행에서 에이전트는 "정상적으로 동작한다"는 criteria를 통과시키기 위해 구현 접근법 자체를 바꿨다. 명령형 criteria가 있었다면 에이전트는 구현 방식에 신경 쓸 필요 없이 명령의 exit code에만 집중했을 것이다. 방향이 고정되면 탐색 폭이 좁아지고, 탐색 폭이 좁아지면 수렴이 빠르다. 30분짜리 루프는 방향 부재의 결과였다.

## criteria 작성 패턴 — 실제로 쓰는 형태

ralph를 세 번 더 돌려보면서 잘 동작하는 criteria 패턴을 정리했다.

파일 존재 확인:
```bash
ls src/components/ProfileCard.tsx | wc -l | grep -q '1'
```

특정 코드 포함 여부:
```bash
grep -q 'export default ProfileCard' src/components/ProfileCard.tsx
```

타입스크립트 컴파일 통과:
```bash
npx tsc --noEmit 2>&1 | wc -l | grep -q '^0$'
```

특정 테스트 통과:
```bash
npx jest src/__tests__/profile.test.ts --passWithNoTests 2>&1 | grep -q 'Tests:.*passed'
```

HTTP 응답 코드:
```bash
curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/health | grep -q '200'
```

라인 수 범위 확인(함수가 너무 길어지지 않도록):
```bash
wc -l < src/utils/parser.ts | awk '{exit ($1 > 80)}'
```

## 추상 criteria가 나쁜 이유 — 그리고 계속 쓸 것인가

"동작한다", "구현 완료", "tested" — 이런 문장은 사람이 검토할 때는 괜찮다. 사람은 코드를 보고, 실행해보고, 문맥으로 판단한다.

에이전트는 다르다. 에이전트는 criteria를 기계적으로 검증한다. 검증 방법이 없으면 두 가지 중 하나를 한다. criteria를 자의적으로 통과 처리하거나, 통과시킬 방법을 찾지 못해 루프를 돈다. 내 에이전트는 후자였다.

"Implementation is complete and tested"가 특히 위험한 예다. 처음 실행에서 에이전트는 이 criteria를 프로필 라우트를 만든 뒤 자기 스스로 "구현이 완료됐다"고 선언하면서 통과 처리하려 했다. 그런데 다른 criteria가 막히면서 스토리가 완료되지 않았다. 에이전트는 다시 시도하면서 라우트 구조를 바꿨다. 이번에도 "Implementation is complete"를 자기 선언으로 통과시켰다. 그 다음 시도에서는 라우트를 컨트롤러 패턴으로 리팩터했다. 다음엔 미들웨어 방식으로, 그 다음엔 다시 인라인 핸들러로. 30분 동안 같은 파일이 다섯 가지 다른 구현 형태로 교체됐다. 각 시도는 자기 검증 기준으로는 "완료"였지만, 실제로 동작하는지 외부에서 확인하는 명령이 없었기 때문에 루프는 멈추지 않았다.

PRD가 에이전트의 행동 공간을 정의한다. 행동 공간이 모호하면 에이전트는 넓게 탐색하고, 넓은 탐색은 시간과 토큰을 낭비한다. criteria를 명령으로 쓰면 행동 공간이 좁아지고 에이전트가 빠르게 수렴한다.

그래서 계속 쓴다. 다만 PRD 작성에 드는 시간이 늘었다. 스토리 하나에 criteria 3~5개를 명령으로 짜는 데 10~15분이 걸린다. 그 10~15분이 아깝냐고 묻는다면, 첫 번째 실행에서 낭비한 30분과 뒤섞인 다섯 개의 구현 파일을 생각하면 아깝지 않다.

PRD가 엄밀해질수록 에이전트의 루프가 짧아진다. 사람이 앞단에 시간을 쓰는 만큼 에이전트가 뒷단에서 속도를 낸다. 그 교환이 ralph를 쓰는 이유다.

criteria 작성 자체가 사고를 강제한다는 부수 효과도 있다. "이 스토리가 완료됐다는 걸 어떻게 확인하지?"라는 질문에 쉘 명령으로 답해야 하면, 스토리의 경계가 불분명한지 바로 드러난다. 명령을 못 쓰겠다면 스토리 자체가 너무 추상적이라는 신호다. 에이전트를 쓰기 전에 스토리를 더 쪼개야 한다는 뜻이다. ralph가 PRD 품질을 높이는 압력으로 작동한다. 처음엔 번거롭지만, 몇 번 반복하면 criteria 작성 속도가 붙는다. 스토리 유형이 반복되기 때문에 패턴이 생긴다. 파일 존재 확인, HTTP 코드 검증, 타입 컴파일 통과 — 이 세 가지만 익히면 API 스토리 대부분이 커버된다. 추상 문장이 사라진 PRD는 에이전트뿐 아니라 사람이 읽을 때도 훨씬 명확하다. 스토리가 완료됐는지 기준이 명확하니 리뷰도 빠르고 이견도 줄어든다.
