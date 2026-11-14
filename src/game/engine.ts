import type { Employee, Evaluation, GameState, Review, Task, TaskStatus } from "../types/game";

export type GameErrorCode = "NOT_FOUND" | "INVALID_TRANSITION" | "EMPLOYEE_BUSY" | "ROLE_MISMATCH" | "INVALID_SUBMISSION" | "INVALID_REVIEW" | "INCONSISTENT_STATE";
export class GameError extends Error {
  constructor(public readonly code: GameErrorCode, message: string) {
    super(message);
    this.name = "GameError";
  }
}
function requireCondition(condition: unknown, code: GameErrorCode, message: string): asserts condition {
  if (!condition) throw new GameError(code, message);
}
// Single-owner assignment is an MVP rule; collaboration can extend this boundary later.
function assertAssignments(state: GameState): void {
  requireCondition(new Set(state.tasks.map(t => t.id)).size === state.tasks.length && new Set(state.employees.map(e => e.id)).size === state.employees.length, "INCONSISTENT_STATE", "중복 ID가 있습니다.");
  for (const employee of state.employees) {
    const active = state.tasks.filter(t => t.assigneeId === employee.id && t.status !== "completed");
    requireCondition(employee.status === "idle"
      ? employee.currentTaskId === null && active.length === 0
      : active.length === 1 && active[0].id === employee.currentTaskId,
    "INCONSISTENT_STATE", "직원과 업무 상태가 일치하지 않습니다.");
  }
  for (const task of state.tasks) {
    const owner = state.employees.find(e => e.id === task.assigneeId);
    requireCondition(task.status === "available" ? task.assigneeId === null : owner && owner.role === task.requiredRole, "INCONSISTENT_STATE", "업무 담당자가 올바르지 않습니다.");
  }
}
function getTask(state: GameState, id: string, allowed: readonly TaskStatus[]): Task {
  assertAssignments(state);
  const task = state.tasks.find(t => t.id === id);
  requireCondition(task, "NOT_FOUND", "업무를 찾을 수 없습니다.");
  requireCondition(allowed.includes(task.status), "INVALID_TRANSITION", `현재 상태(${task.status})에서는 처리할 수 없습니다.`);
  return task;
}
function replace(state: GameState, task: Task, employee?: Employee): GameState {
  const next = { ...state, tasks: state.tasks.map(t => t.id === task.id ? task : t), employees: employee ? state.employees.map(e => e.id === employee.id ? employee : e) : state.employees };
  assertAssignments(next);
  return next;
}
export function assignTask(state: GameState, taskId: string, employeeId: string): GameState {
  const task = getTask(state, taskId, ["available"]);
  const employee = state.employees.find(e => e.id === employeeId);
  requireCondition(employee, "NOT_FOUND", "직원을 찾을 수 없습니다.");
  requireCondition(employee.status === "idle", "EMPLOYEE_BUSY", "직원이 이미 업무를 담당하고 있습니다.");
  requireCondition(employee.role === task.requiredRole, "ROLE_MISMATCH", "담당 직무가 일치하지 않습니다.");
  return replace(state, { ...task, status: "assigned", assigneeId: employee.id }, { ...employee, status: "busy", currentTaskId: task.id });
}
export function startTask(state: GameState, taskId: string): GameState {
  const task = getTask(state, taskId, ["assigned", "revision"]);
  return replace(state, { ...task, status: "in_progress" });
}
// Revisions must be started again before resubmission. Every submission is a new version.
export function submitForReview(state: GameState, taskId: string, sections: Readonly<Record<string, string>>): GameState {
  const task = getTask(state, taskId, ["in_progress"]);
  requireCondition(task.requirements.every(r => Object.hasOwn(sections, r.id) && typeof sections[r.id] === "string" && sections[r.id].trim().length > 0), "INVALID_SUBMISSION", "필수 결과물을 모두 작성해야 합니다.");
  return replace(state, { ...task, status: "review", submissions: [...task.submissions, { version: task.submissions.length + 1, day: state.company.day, sections: { ...sections } }] });
}
function review(state: GameState, taskId: string, evaluation: Evaluation, decision: Review["decision"]): GameState {
  const task = getTask(state, taskId, ["review"]);
  const submission = task.submissions.at(-1);
  requireCondition(submission && !task.reviews.some(r => r.submissionVersion === submission.version), "INVALID_REVIEW", "검수할 미평가 제출물이 없습니다.");
  requireCondition(evaluation.feedback.trim() && evaluation.evaluator.id.trim() && ["player", "ai"].includes(evaluation.evaluator.kind) && Object.values(evaluation.scores ?? {}).every(Number.isFinite), "INVALID_REVIEW", "검수 정보가 올바르지 않습니다.");
  const result: Review = { ...structuredClone(evaluation), decision, submissionVersion: submission.version, day: state.company.day };
  return replace(state, { ...task, status: decision === "approved" ? "review" : "revision", reviews: [...task.reviews, result] });
}
export function requestRevision(state: GameState, taskId: string, evaluation: Evaluation): GameState {
  return review(state, taskId, evaluation, "revision_requested");
}
export function approveReview(state: GameState, taskId: string, evaluation: Evaluation): GameState {
  return review(state, taskId, evaluation, "approved");
}
export function completeTask(state: GameState, taskId: string): GameState {
  const task = getTask(state, taskId, ["review"]);
  const latest = task.submissions.at(-1);
  requireCondition(latest && task.reviews.some(r => r.submissionVersion === latest.version && r.decision === "approved"), "INVALID_REVIEW", "최신 결과물의 검수 승인이 필요합니다.");
  const employee = state.employees.find(e => e.id === task.assigneeId);
  requireCondition(employee, "INCONSISTENT_STATE", "담당 직원이 없습니다.");
  return replace(state, { ...task, status: "completed" }, { ...employee, status: "idle", currentTaskId: null });
}
