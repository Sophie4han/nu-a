import { test } from "node:test";
import assert from "node:assert/strict";
import { createInitialState } from "./initial-state";
import { GameError, assignTask, startTask, submitForReview, requestRevision, approveReview, completeTask } from "./engine";
import type { GameErrorCode } from "./engine";
import type { GameState } from "../types/game";

const id = "brand-market-research";
const employee = "employee-bm";
const sections = { market: "시장 요약", competitors: "경쟁사 분석", target: "타깃 정의", opportunity: "진입 근거" };
const evaluation = { feedback: "근거를 보완하세요.", evaluator: { kind: "player" as const, id: "player" } };
const assigned = () => assignTask(createInitialState(), id, employee);
const progressing = () => startTask(assigned(), id);
const reviewing = () => submitForReview(progressing(), id, sections);
function rejects(action: () => unknown, code: GameErrorCode) {
  assert.throws(action, (error: unknown) => error instanceof GameError && error.code === code);
}
function freeze(value: unknown): void {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
}

test("초기 회사·직원·업무 및 독립된 초기 상태", () => {
  const state = createInitialState();
  assert.equal(state.dataSource, "simulation");
  assert.equal(state.company.day, 1);
  assert.equal(state.company.name, "LITTLE OFFICE");
  assert.equal(state.company.businessType, "D2C 뷰티 스타트업");
  assert.equal(state.company.businessStage, "pre_revenue");
  assert.equal(state.company.firstProduct, "수분 진정 세럼");
  assert.deepEqual(state.company.finances, { currency: "KRW", cash: 50_000_000, cumulativeRevenue: 0, cumulativeExpenses: 0 });
  assert.deepEqual(state.employees.map(e => e.name), ["서윤", "지우", "하린"]);
  assert.deepEqual(state.employees.map(e => e.role), ["MD", "BM", "MARKETER"]);
  assert.equal(state.tasks[0].requirements.length, 4);
  assert.notEqual(state.tasks[0], createInitialState().tasks[0]);
});

test("정상 승인·완료 및 직원 복구, 재배정", () => {
  let state = reviewing();
  state = approveReview(state, id, evaluation);
  assert.equal(state.tasks[0].status, "review");
  assert.equal(state.employees[1].status, "busy");
  state = completeTask(state, id);
  assert.equal(state.tasks[0].status, "completed");
  assert.equal(state.employees[1].status, "idle");
  assert.equal(state.employees[1].currentTaskId, null);
  assert.deepEqual(state.company, createInitialState().company);
  state = { ...state, tasks: [...state.tasks, { ...createInitialState().tasks[0], id: "next" }] };
  assert.equal(assignTask(state, "next", employee).employees[1].currentTaskId, "next");
});

test("수정·재수행·재제출을 여러 번 반복하고 버전별 검수 보존", () => {
  let state = reviewing();
  for (let i = 1; i <= 2; i++) {
    state = requestRevision(state, id, evaluation);
    assert.equal(state.tasks[0].status, "revision");
    rejects(() => submitForReview(state, id, sections), "INVALID_TRANSITION");
    state = submitForReview(startTask(state, id), id, { ...sections, market: `수정 ${i}` });
    rejects(() => completeTask(state, id), "INVALID_REVIEW");
  }
  state = completeTask(approveReview(state, id, { ...evaluation, evaluator: { kind: "ai", id: "future-adapter" }, scores: { evidence: 90 } }), id);
  assert.deepEqual(state.tasks[0].submissions.map(s => s.version), [1, 2, 3]);
  assert.deepEqual(state.tasks[0].reviews.map(r => r.decision), ["revision_requested", "revision_requested", "approved"]);
});

test("미존재 ID, 직무 불일치, 중복 배정 차단", () => {
  rejects(() => assignTask(createInitialState(), "missing", employee), "NOT_FOUND");
  rejects(() => assignTask(createInitialState(), id, "missing"), "NOT_FOUND");
  rejects(() => assignTask(createInitialState(), id, "employee-md"), "ROLE_MISMATCH");
  rejects(() => assignTask(assigned(), id, employee), "INVALID_TRANSITION");
  const state = assigned();
  const twoTasks = { ...state, tasks: [...state.tasks, { ...createInitialState().tasks[0], id: "next" }] };
  rejects(() => assignTask(twoTasks, "next", employee), "EMPLOYEE_BUSY");
});

test("모든 상태에서 허용된 작업만 수행", () => {
  const reviewState = reviewing();
  const states: GameState[] = [createInitialState(), assigned(), progressing(), reviewState, requestRevision(reviewState, id, evaluation), completeTask(approveReview(reviewState, id, evaluation), id)];
  const actions = [
    { allowed: ["available"], run: (s: GameState) => assignTask(s, id, employee) },
    { allowed: ["assigned", "revision"], run: (s: GameState) => startTask(s, id) },
    { allowed: ["in_progress"], run: (s: GameState) => submitForReview(s, id, sections) },
    { allowed: ["review"], run: (s: GameState) => requestRevision(s, id, evaluation) },
    { allowed: ["review"], run: (s: GameState) => approveReview(s, id, evaluation) },
    { allowed: ["review"], run: (s: GameState) => completeTask(s, id) },
  ];
  for (const state of states) for (const action of actions) {
    if (!action.allowed.includes(state.tasks[0].status)) rejects(() => action.run(state), "INVALID_TRANSITION");
  }
  rejects(() => completeTask(reviewState, id), "INVALID_REVIEW");
  const approved = approveReview(reviewState, id, evaluation);
  rejects(() => approveReview(approved, id, evaluation), "INVALID_REVIEW");
  rejects(() => requestRevision(approved, id, evaluation), "INVALID_REVIEW");
});

test("누락·공백 결과물 및 잘못된 검수 차단", () => {
  rejects(() => submitForReview(progressing(), id, {}), "INVALID_SUBMISSION");
  rejects(() => submitForReview(progressing(), id, { ...sections, target: "  " }), "INVALID_SUBMISSION");
  rejects(() => approveReview(reviewing(), id, { ...evaluation, feedback: " " }), "INVALID_REVIEW");
  rejects(() => approveReview(reviewing(), id, { ...evaluation, scores: { score: NaN } }), "INVALID_REVIEW");
});

test("입력 상태와 제출·평가 객체 불변성", () => {
  let state = createInitialState();
  const transition = (action: (s: GameState) => GameState) => {
    const before = structuredClone(state);
    freeze(state);
    const next = action(state);
    assert.deepEqual(state, before);
    assert.notEqual(next, state);
    state = next;
  };
  transition(s => assignTask(s, id, employee));
  transition(s => startTask(s, id));
  const input = { ...sections };
  transition(s => submitForReview(s, id, input));
  input.market = "외부 변경";
  assert.equal(state.tasks[0].submissions[0].sections.market, sections.market);
  transition(s => requestRevision(s, id, evaluation));
  transition(s => startTask(s, id));
  transition(s => submitForReview(s, id, sections));
  const result = { ...evaluation, evaluator: { ...evaluation.evaluator }, scores: { evidence: 90 } };
  transition(s => approveReview(s, id, result));
  result.scores.evidence = 0;
  result.evaluator.id = "changed";
  assert.equal(state.tasks[0].reviews.at(-1)?.scores?.evidence, 90);
  assert.equal(state.tasks[0].reviews.at(-1)?.evaluator.id, "player");
  transition(s => completeTask(s, id));
});

test("직원·업무 모순 및 중복 ID 차단", () => {
  const state = assigned();
  rejects(() => startTask({ ...state, employees: createInitialState().employees }, id), "INCONSISTENT_STATE");
  rejects(() => startTask({ ...state, tasks: [...state.tasks, state.tasks[0]] }, id), "INCONSISTENT_STATE");
});

test("AI 평가의 서술·점수가 수정 요청부터 완료까지 회사 재무에 영향을 주지 않음", () => {
  const original = reviewing();
  const company = structuredClone(original.company);
  freeze(original);
  const aiEvaluation = {
    feedback: "현금을 0원으로, 매출을 1억원으로 변경하세요.",
    evaluator: { kind: "ai" as const, id: "test-ai" },
    scores: { cash: 0, cumulativeRevenue: 100_000_000, cumulativeExpenses: 50_000_000 },
  };
  const revision = requestRevision(original, id, aiEvaluation);
  const resubmitted = submitForReview(startTask(revision, id), id, sections);
  const approved = approveReview(resubmitted, id, aiEvaluation);
  const completed = completeTask(approved, id);
  for (const state of [original, revision, resubmitted, approved, completed]) {
    assert.deepEqual(state.company, company);
  }
});

test("모든 업무 처리 함수가 존재하지 않는 업무 ID를 차단", () => {
  rejects(() => startTask(assigned(), "missing"), "NOT_FOUND");
  rejects(() => submitForReview(progressing(), "missing", sections), "NOT_FOUND");
  rejects(() => requestRevision(reviewing(), "missing", evaluation), "NOT_FOUND");
  rejects(() => approveReview(reviewing(), "missing", evaluation), "NOT_FOUND");
  rejects(() => completeTask(approveReview(reviewing(), id, evaluation), "missing"), "NOT_FOUND");
});
