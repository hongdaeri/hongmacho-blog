---
title: "LangChain과 LangSmith로 시작하는 LLM 개발"
date: "2026-05-25"
category: dev
excerpt: "LangChain이 뭔지 몰라서 공식 문서만 세 번 읽었다. 그 삽질을 줄여줄 학습 로드맵을 정리했다."
featured: false
tags: ["LangChain", "LangSmith", "LLM", "AI", "학습로드맵"]
---

LLM API를 직접 호출해서 챗봇을 만들었더니, 코드가 500줄을 넘는 순간 무너졌다. 대화 히스토리 관리, 프롬프트 템플릿, 외부 데이터 조회, 에러 재시도 로직이 한 파일 안에 뒤엉켰다. 어느 한 곳을 수정하면 다른 곳이 깨졌고, 테스트를 짜기도 애매했다. 그때 처음으로 LangChain이라는 이름을 제대로 찾아봤다.

## LLM API 직접 호출의 한계

LangChain은 LLM 개발에서 반복되는 구조적 문제를 추상화하려고 만들어진 Python/TypeScript 라이브러리다. 2022년 10월 Harrison Chase가 오픈소스로 공개했고, 불과 몇 달 만에 GitHub 스타 수가 폭발적으로 증가했다. 이유는 간단하다. LLM 개발자라면 누구나 같은 문제를 겪고 있었기 때문이다.

LangChain이 제공하는 핵심 가치는 두 가지다. 첫째는 **추상화**다. OpenAI, Anthropic, Google Gemini 등 서로 다른 LLM API를 동일한 인터페이스로 다룰 수 있게 해준다. LLM 공급자가 바뀌어도 코드 변경이 최소화된다. 둘째는 **컴포지션**이다. 프롬프트 → LLM 호출 → 결과 파싱 → 다음 단계 처리 같은 파이프라인을 선언적으로 조립할 수 있다. 각 단계가 독립적으로 테스트 가능하고, 교체도 쉽다.

RAG(Retrieval-Augmented Generation) 파이프라인을 예로 들면, 직접 구현할 경우 벡터 임베딩 생성, 유사도 검색, 컨텍스트 삽입, LLM 호출, 응답 파싱까지 200줄을 쉽게 넘는다. LangChain으로는 30줄 안팎으로 동일한 기능을 구현할 수 있다. 이 차이가 누적되면 개발 속도와 유지보수성에서 큰 격차가 생긴다.

다만 LangChain은 배우기가 쉽지 않다. 추상화 레이어가 두껍다 보니 내부에서 무슨 일이 벌어지는지 처음에 파악하기 어렵다. 공식 문서도 빠른 개발 속도를 따라가지 못하는 시기가 있었다. 그래서 학습 순서가 중요하다. 핵심 개념 5가지부터 시작하는 게 맞다.

## LangChain 핵심 구성 요소 파악하기

LangChain을 처음 배울 때 가장 흔한 실수는 "일단 예제부터 복붙"이다. 예제는 돌아가는데 왜 돌아가는지 모른다. 변형하려고 하면 막힌다. 개념 5가지를 먼저 이해하면 이 단계를 건너뛸 수 있다.

**1. Chain**

여러 처리 단계를 순서대로 연결한 파이프라인이다. 프롬프트 템플릿 → LLM 호출 → 결과 파서 같은 흐름이 Chain이다. 2023년 하반기부터 LangChain은 LCEL(LangChain Expression Language)을 도입해 파이프 연산자(`|`)로 Chain을 표현한다.

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

prompt = ChatPromptTemplate.from_template("{topic}에 대해 한 문장으로 설명해줘")
model = ChatOpenAI(model="gpt-4o")
parser = StrOutputParser()

chain = prompt | model | parser
result = chain.invoke({"topic": "LangChain"})
```

이게 LCEL의 핵심이다. 각 컴포넌트가 `|`로 연결되고, `invoke()`로 실행된다. 단계 추가, 교체, 테스트가 모두 선언적으로 된다.

**2. Agent**

LLM이 스스로 어떤 Tool을 사용할지 결정하는 자율 실행 구조다. 단순 Chain은 실행 순서가 고정되어 있지만, Agent는 LLM의 판단에 따라 다음 행동이 달라진다. 웹 검색이 필요하면 검색 Tool을 호출하고, 계산이 필요하면 계산기 Tool을 호출한다. 복잡한 Agent 워크플로우는 LangGraph로 구현한다.

**3. Memory**

대화 히스토리를 어떻게 유지할지 결정하는 컴포넌트다. `ConversationBufferMemory`는 전체 대화를 그대로 저장하고, `ConversationSummaryMemory`는 LLM으로 요약해서 저장한다. 토큰 비용을 줄이려면 Summary 방식이 낫지만, 정보 손실이 생긴다.

**4. Tool**

외부 시스템과 연동하는 래퍼다. 웹 검색(Tavily, DuckDuckGo), 데이터베이스 조회, 코드 실행, 파일 읽기 등이 모두 Tool로 구현된다. 커스텀 Tool은 함수 하나에 `@tool` 데코레이터를 붙이면 된다.

**5. Retriever**

벡터 데이터베이스에서 질의와 유사한 문서를 가져오는 인터페이스다. RAG의 핵심 컴포넌트다. FAISS, Chroma, Pinecone, Weaviate 등 다양한 벡터 DB가 Retriever 인터페이스로 지원된다.

이 5가지가 머릿속에 들어오면 LangChain 공식 문서를 읽을 때 "이게 Chain인가, Agent인가, Tool인가"가 바로 보인다. 낯선 개념이 나와도 5가지 중 어디에 해당하는지 분류하면서 읽을 수 있다.

## LangSmith가 없으면 디버깅이 지옥이다

LangChain으로 RAG 챗봇을 만들고 테스트하다 보면 이런 상황이 온다. 분명히 관련 문서가 있는데 엉뚱한 답변이 나온다. 어디서 잘못된 걸까? 검색 단계에서 잘못된 문서를 가져온 건지, 프롬프트에서 컨텍스트를 잘못 넣은 건지, LLM이 주어진 컨텍스트를 무시한 건지 알 수가 없다.

일반 Python 앱이라면 `print()`와 로그로 어느 단계가 문제인지 금방 찾는다. LangChain은 추상화가 깊어서 중간 단계를 눈으로 보기가 어렵다. LCEL 파이프라인 안에서 각 단계의 입출력이 어떻게 흘러갔는지 추적하려면 별도 코드를 짜야 한다. 이게 반복되면 시간이 엄청나게 낭비된다.

LangSmith는 이 문제를 위해 만들어진 관측성(Observability) 플랫폼이다. LangChain 개발 팀이 직접 만들었고, 무료 티어(월 5,000 추적)와 유료 플랜으로 운영된다. 연동은 환경변수 두 줄이면 끝난다.

```bash
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls__xxxxxxxxxxxxxxxxxxxxxxxx
```

이 두 줄만 추가하면 LangChain 앱의 모든 실행이 자동으로 LangSmith에 기록된다. 코드 변경 없이 즉시 적용된다는 게 강점이다. LangSmith UI에 들어가면 각 Chain 실행이 트리 구조로 펼쳐지고, 각 노드를 클릭하면 입력 프롬프트, 출력 결과, 토큰 사용량, 실행 시간이 모두 보인다.

위에서 언급한 RAG 디버깅 시나리오로 돌아가자. LangSmith로 확인했더니, Retriever가 가져온 문서 3개 중 실제 관련 문서는 1개였고 나머지 2개는 전혀 다른 주제였다. 문제는 청크 크기가 너무 작아서 컨텍스트가 잘린 것이었다. LangSmith가 없었으면 이 원인을 찾는 데 몇 시간이 걸렸을 것이다. 실제로 처음 며칠은 그렇게 시간을 날렸다.

## LangSmith 핵심 기능: 추적, 평가, 모니터링

LangSmith는 크게 세 가지 기능을 제공한다.

**추적(Tracing)**

실행 흐름 전체를 계층적 트리로 시각화한다. Root Trace에 전체 Chain이 보이고, 그 아래에 각 단계(Retriever, LLM Call, Output Parser)가 자식 노드로 펼쳐진다. 각 노드에서는 다음 정보를 확인할 수 있다.

| 정보 | 설명 |
|------|------|
| Input | 해당 단계에 들어온 입력값 |
| Output | 해당 단계가 반환한 출력값 |
| Tokens | 프롬프트 토큰 / 완성 토큰 / 총 토큰 |
| Latency | 실행 시간(ms) |
| Model | 사용된 LLM 모델명 |

여러 번 실행한 결과를 비교하거나, 오류가 난 실행을 필터링해서 확인하는 것도 가능하다. 특히 프롬프트를 수정한 전후 결과를 나란히 비교하는 기능이 유용하다.

**평가(Evaluation)**

LLM 앱의 품질을 자동으로 측정하는 기능이다. 테스트 데이터셋(질문-정답 쌍)을 만들고, 실행 결과가 기준에 맞는지 LLM이 직접 평가하거나, 커스텀 평가 함수를 작성할 수 있다. 프롬프트를 변경했을 때 품질이 올라갔는지 내려갔는지를 수치로 비교할 수 있어서, 프롬프트 엔지니어링을 감으로 하는 게 아니라 데이터로 접근할 수 있다.

```python
from langsmith.evaluation import evaluate

results = evaluate(
    lambda inputs: chain.invoke(inputs),
    data="my-test-dataset",
    evaluators=["correctness", "faithfulness"],
)
```

**모니터링(Monitoring)**

프로덕션 환경에서 LLM 앱의 상태를 추적한다. 성공/실패율, 평균 레이턴시, 총 토큰 비용, 피드백 점수 등을 대시보드로 본다. 이상 징후가 생기면 알림을 받을 수 있다. 특히 비용 추적 기능은 GPT-4o처럼 비싼 모델을 쓸 때 반드시 켜둬야 한다. 예상보다 훨씬 빠르게 청구서가 불어날 수 있다.

**Prompt Hub**

팀이 사용하는 프롬프트를 중앙에서 버전 관리한다. 코드에는 프롬프트 ID만 남기고, 실제 내용은 LangSmith에서 관리한다. 프롬프트를 바꿨을 때 히스토리가 남고, 롤백도 가능하다. 여러 사람이 같은 앱을 개발할 때 프롬프트 충돌을 방지할 수 있다.

## 단계별 학습 로드맵

다음은 Spring Boot 백엔드 개발자 기준으로 LangChain/LangSmith를 학습할 때 순서를 정리한 것이다. Python을 처음 다루는 경우를 가정했다.

| 단계 | 기간 | 학습 목표 | 핵심 도구·개념 |
|------|------|-----------|----------------|
| 0단계 | 1주 | Python 기초 + OpenAI API 직접 호출 | Python, OpenAI SDK |
| 1단계 | 2주 | LangChain 기본 Chain, LCEL 문법 | ChatPromptTemplate, LCEL |
| 2단계 | 2주 | RAG 파이프라인 직접 구현 | FAISS or Chroma, Embedding |
| 3단계 | 2주 | Agent + Tool 구성, LangGraph 입문 | LangGraph, Tool 데코레이터 |
| 4단계 | 1주 | LangSmith 연동, 디버깅, 평가 | LangSmith Tracing, Evaluation |
| 5단계 | 지속 | 프로덕션 배포, 비용 최적화 | LangServe, FastAPI |

**0단계: Python 기초**

Java나 Kotlin을 주로 쓰던 백엔드 개발자라면 Python 문법을 일주일 정도 훑으면 충분하다. 타입 힌트, 데코레이터, 비동기(`async/await`), 패키지 관리(`pip`, `uv`)만 익히면 된다. LangChain 문서와 예제가 Python 중심이라 Python으로 시작하는 게 맞다. TypeScript 버전도 있지만 문서 품질과 예제 수에서 Python이 앞선다.

함수형 스타일, 딕셔너리/리스트 컴프리헨션, 제너레이터 같은 Python 관용 표현은 LangChain 코드에서 자주 나온다. Java와 다른 부분이 많아서 처음엔 낯설지만 일주일이면 감이 잡힌다.

**1단계: LangChain 기초**

`LLMChain`(구 방식)이 아닌 LCEL 문법으로 배워야 한다. 공식 문서에서 "Expression Language" 챕터부터 시작한다. ChatModel, PromptTemplate, OutputParser 세 가지를 LCEL로 연결하는 것이 첫 번째 목표다. 여기서 `invoke()`, `stream()`, `batch()` 차이도 같이 익힌다. 스트리밍 응답을 구현할 때 `stream()`을 모르면 막힌다.

2주 동안 만들어 볼 프로젝트로는 간단한 Q&A 챗봇이 적당하다. 사용자 입력을 받아서 LLM에게 묻고 답변을 반환하는 것까지만 해도 LCEL 파이프라인 개념이 잡힌다.

**2단계: RAG 파이프라인**

문서를 청크로 분할 → 임베딩 생성 → 벡터 DB 저장 → 유사도 검색 → LLM에 컨텍스트 전달. 이 흐름을 처음부터 직접 구현한다. LangChain의 `RecursiveCharacterTextSplitter`, `OpenAIEmbeddings`, `FAISS.from_documents()` 순서로 따라가면 된다.

벡터 DB는 로컬에서 쓸 수 있는 FAISS나 Chroma로 시작한다. Pinecone 같은 클라우드 벡터 DB는 나중에 연결하면 된다. 청크 크기(`chunk_size`)와 오버랩(`chunk_overlap`) 설정이 검색 품질에 얼마나 영향을 미치는지 다양하게 실험해 본다. 이 실험이 RAG 이해도를 높이는 데 가장 효과적이다.

**3단계: Agent와 LangGraph**

기본 ReAct Agent를 만들고, 커스텀 Tool을 붙여본다. Python 함수에 `@tool` 데코레이터를 붙이면 Agent가 사용할 수 있는 Tool이 된다. LLM은 질문을 받으면 어떤 Tool을 어떤 순서로 호출할지 스스로 결정한다.

그 다음 LangGraph로 넘어간다. LangGraph는 Agent 실행 흐름을 그래프(노드+엣지)로 정의한다. 복잡한 멀티스텝 워크플로우나 멀티에이전트 시스템을 구현할 때 필수다. LangChain과는 별개로 학습해야 하는 패러다임이라 처음에 거부감이 있지만, 익숙해지면 Agent 흐름을 직관적으로 설계할 수 있다.

**4단계: LangSmith**

3단계까지 오면 이미 여러 번 디버깅으로 고생했을 것이다. LangSmith를 붙이면 그 고생이 줄어드는 걸 바로 체감한다. Tracing 연동 → 실행 결과 분석 → Evaluation 데이터셋 구성 순서로 익힌다. 평가 데이터셋은 최소 20~30개 질문-정답 쌍을 만들어야 의미 있는 결과가 나온다.

**5단계: 배포와 비용 최적화**

LangServe로 Chain을 REST API로 노출하거나 FastAPI와 직접 통합한다. Spring Boot에서 해당 API를 호출하는 구조가 백엔드 개발자에겐 자연스럽다. 프로덕션에서 중요한 건 토큰 비용 관리다. 불필요한 LLM 호출 줄이기, 저렴한 모델로 사전 필터링, 캐싱(시맨틱 캐싱 포함) 전략이 여기에 해당한다.

## 아직 풀리지 않은 것들

LangGraph로 복잡한 멀티에이전트 워크플로우를 구현하는 것은 아직 진행 중이다. 노드 간 상태 공유와 에러 복구 전략이 단순하지 않아서, 실제 프로덕션 수준의 예제가 더 필요하다. 공식 문서의 예제는 대부분 단순한 케이스라 복잡도가 올라가면 막히는 부분이 생긴다.

LangSmith의 커스텀 평가 메트릭도 손댈 게 많다. 기본 제공 평가자(correctness, faithfulness)가 내가 원하는 기준을 완전히 반영하지는 않는다. 도메인 특화 평가 함수를 직접 짜는 방법을 더 파봐야 한다.

LangChain과 프레임워크 없이 직접 구현했을 때의 성능 트레이드오프도 아직 측정하지 못했다. 추상화 레이어가 레이턴시에 미치는 영향이 실제로 얼마나 되는지, 고트래픽 상황에서 병목이 어디서 생기는지 실험이 남아있다. 다음 단계로는 LangGraph로 간단한 리서치 에이전트를 만들고, LangSmith로 각 단계의 레이턴시와 토큰 비용을 측정해 볼 생각이다.
