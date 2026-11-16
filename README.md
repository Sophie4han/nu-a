# 🌱 LITTLE OFFICE

### Build a business. Make decisions. Learn by doing.

**LITTLE OFFICE**는 스타트업 운영 과정을 통해 MD, BM, 마케팅 실무를 경험하고 학습하는 웹 기반 경영 시뮬레이션 게임입니다.

플레이어는 작은 뷰티 스타트업의 대표가 되어 직원에게 업무를 지시하고, 실무 결과물을 검토하며, 회사의 성장을 위한 의사결정을 내립니다.

단순한 경영 타이쿤이 아닌 **실제 비즈니스 프로세스와 데이터 기반 문제 해결을 경험하는 학습형 게임**을 지향합니다.

**Play → Decide → Experience → Learn → Apply**

---

## 01. Project Overview

| 항목 | 내용 |
| --- | --- |
| Project | LITTLE OFFICE |
| Genre | Business Simulation · Educational Game |
| Platform | PC Web |
| Industry | D2C Beauty Startup |
| Visual Concept | Botanical Studio · Isometric Pixel Art (Planned) |
| Status | Early Development · Core Game Engine |
| Language | Korean |

### Why LITTLE OFFICE?

MD, BM, 마케팅 직무의 실무는 단순히 이론을 암기하는 것만으로 이해하기 어렵습니다.

실제 업무에서는 시장을 조사하고, 제품의 수익성을 검토하고, 제한된 예산 안에서 의사결정을 내리며 예기치 못한 문제를 해결해야 합니다.

LITTLE OFFICE는 이러한 업무를 게임 속에서 경험하도록 설계합니다.

- **Realistic Workflow:** 실제 스타트업 업무 프로세스 반영
- **Decision Making:** 데이터와 근거를 바탕으로 의사결정
- **AI-Powered Feedback:** 실무 결과물에 대한 객관적인 평가 및 피드백 *(Planned)*
- **Business Simulation:** 선택에 따른 경영 성과 및 후속 상황 변화 *(Planned)*
- **Learning by Doing:** 경험한 업무를 실제 실무에 적용

---

## 02. Game Concept

### Welcome to your little office.

플레이어는 운영 자금 5,000만 원을 보유한 초기 D2C 뷰티 스타트업의 대표로 게임을 시작합니다.

회사는 아직 매출이 발생하지 않은 Pre-revenue 단계이며, 첫 번째 제품인 **수분 진정 세럼**의 시장 진입 가능성을 검토해야 합니다.

초기 팀은 MD, BM, 마케터 3명으로 구성됩니다.

| Role | Responsibilities |
| --- | --- |
| CEO (Player) | 업무 지시, 예산 관리, 결과물 검토, 최종 의사결정 |
| MD | 상품 소싱, 제조사 비교, 원가·가격·재고 관리 |
| BM | 시장조사, 브랜드 전략, 제품 기획 및 개발 |
| Marketer | 광고 운영, 고객 분석, CRM, 캠페인 성과 관리 |

직원들은 각자의 전문성과 성격을 가지며, 플레이어의 지시에 따라 업무를 수행합니다.

### Core Gameplay Loop — Planned

**업무 발생 → 직원 배정 → 업무 수행 → 결과물 제출 → 검토 및 피드백 → 의사결정 → 경영 결과 반영**

핵심 업무에 대해서는 AI 평가와 플레이어의 최종 승인 절차를 분리하고, 결과물 보완 및 재검토가 가능하도록 설계합니다.

---

## 03. Core Systems

### Employee & Task Management

현재 게임 엔진에 구현되어 있으며, 플레이어가 조작하는 UI는 **Planned**입니다.

- 직무별 업무 배정
- 업무 상태 및 진행 상황 관리
- 결과물 제출과 버전별 이력 관리
- 검수, 수정 요청, 재제출
- 업무 완료 후 직원 상태 갱신

### Business Practice Simulation — Planned

시장조사부터 제품 출시와 판매 운영까지의 실무 과정을 시뮬레이션합니다.

- Market Research & Competitor Analysis
- Product Planning & Brand Strategy
- OEM/ODM Sourcing
- Cost Analysis & Pricing
- E-commerce Operations
- Digital Marketing & CRM
- Inventory & Financial Management
- Business Risk & Incident Response

### AI Review & Learning — Planned

AI는 실무 결과물의 분석과 평가를 지원하고, 플레이어는 최종적인 경영 의사결정을 수행합니다.

평가에서는 데이터 출처, 분석의 논리성, 실무 정확성, 사업 리스크 등을 검토합니다.

실제 공개 데이터, 가상의 게임 데이터, 외부 연결 데이터는 명확히 구분합니다.

AI의 설명이나 평가 점수가 게임의 재무 데이터를 직접 변경하지 않도록 설계합니다.

---

## 04. Tech Stack

| Category | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Game Logic | TypeScript State Engine |
| Testing | Node.js Test Runner |
| Version Control | Git & GitHub |

AI 연동, 영구 저장소 및 배포 환경은 **Planned**이며, 후속 개발 단계에서 결정합니다.

### Project Structure

```text
src/
├── app/                # Next.js App Router
├── components/
│   ├── game/           # Game UI (Planned)
│   └── office/         # Office UI (Planned)
├── data/
│   ├── employees.ts    # Initial employee data
│   └── tasks.ts        # Initial task data
├── game/
│   ├── engine.ts       # Game state transitions
│   ├── engine.test.ts  # Engine tests
│   └── initial-state.ts
└── types/
    └── game.ts         # Shared game types
```

UI, 게임 엔진, 데이터, AI 평가 기능을 독립적으로 구성하여 유지보수성과 확장성을 확보합니다.

---

## 05. Getting Started

### Requirements

- Node.js 및 npm
- Git

### Installation

```bash
git clone https://github.com/Sophie4han/nu-a.git
cd nu-a
npm install
```

### Development

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

현재는 Next.js 기본 화면이 표시되며, 게임 플레이 UI는 **Planned**입니다.

### Validation

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
```

---

## 06. Development Roadmap

| Phase | Description | Status |
| --- | --- | --- |
| 01. Foundation | 게임 데이터 모델 및 핵심 상태 전환 엔진 | Core implemented |
| 01.1. Engine Stabilization | 테스트 안정화 및 AI 평가·승인 권한 분리 | In progress |
| 02. Playable Interface | Botanical Studio 메인 UI 및 업무 인터랙션 | Planned |
| 03. Business Simulation | 실무 시나리오 및 경영 의사결정 시스템 | Planned |
| 04. AI Integration | 자료 조사, 결과물 생성, AI 검수·피드백 | Planned |
| 05. MVP Completion | 저장 기능, 플레이 루프 통합, 테스트 및 배포 | Planned |

개발 순서와 범위는 MVP 검증 결과에 따라 조정될 수 있습니다.

---

## 07. Design Direction — Planned

**Botanical Studio**

식물과 따뜻한 우드톤이 어우러진 작은 사무실을 아이소메트릭 픽셀아트로 표현합니다.

공간 자체는 게임의 몰입감을 제공하고, 업무 패널과 경영 대시보드는 실제 비즈니스 도구처럼 명확하고 직관적으로 설계합니다.

핵심 디자인 키워드:

`Cozy` · `Botanical` · `Isometric` · `Pixel Art` · `Productivity`

---

## 08. Development Principles

1. **Realism First** — 실제 업무 프로세스와 계산의 정확성을 우선합니다.
2. **Learning Through Action** — 단순 정답 선택보다 직접 분석하고 판단하는 경험을 제공합니다.
3. **Player Agency** — 최종 경영 의사결정은 플레이어가 수행합니다.
4. **Deterministic Business Logic** — 수치 계산과 게임 상태 전환은 게임 엔진에서 처리합니다.
5. **Verifiable Data** — 실제 데이터와 시뮬레이션 데이터를 구분합니다.
6. **Iterative Development** — 작은 기능부터 구현하고 검증하며 확장합니다.

---

## 09. Project Status

현재는 핵심 게임 엔진을 구축하고 검증하는 초기 개발 단계입니다.

아직 구현되지 않은 게임 UI, 실무 시나리오, 경영 성과 계산, 실제 AI 연동 및 저장 기능은 **Planned**입니다. 게임의 주요 시스템과 콘텐츠는 순차적으로 구현될 예정이며, 본 README는 개발 진행 상황에 맞춰 업데이트됩니다.

---

**LITTLE OFFICE**

*Small office. Real decisions. Practical learning.*
