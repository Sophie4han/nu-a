export type Role = "MD" | "BM" | "MARKETER";
export type TaskStatus = "available" | "assigned" | "in_progress" | "review" | "revision" | "completed";

export interface Employee {
  readonly id: string;
  readonly name: string;
  readonly role: Role;
  readonly expertise: readonly string[];
  readonly personality: string;
  readonly status: "idle" | "busy";
  readonly currentTaskId: string | null;
}

export interface DeliverableRequirement {
  readonly id: string;
  readonly label: string;
}
export interface Submission {
  readonly version: number;
  readonly day: number;
  readonly sections: Readonly<Record<string, string>>;
}
// Evaluation text is informational: it never changes financial metrics.
export interface Evaluation {
  readonly feedback: string;
  readonly evaluator: { readonly kind: "player" | "ai"; readonly id: string };
  readonly scores?: Readonly<Record<string, number>>;
}
export type PlayerEvaluation = Evaluation & {
  readonly evaluator: { readonly kind: "player"; readonly id: string };
};
export type AIEvaluation = Evaluation & {
  readonly evaluator: { readonly kind: "ai"; readonly id: string };
};
// Keep one versioned history, with advisory AI entries distinct from player decisions.
export type Review = { readonly submissionVersion: number; readonly day: number } & (
  | (PlayerEvaluation & { readonly decision: "approved" | "revision_requested" })
  | (AIEvaluation & { readonly decision: "evaluated" })
);
export interface Task {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly requiredRole: Role;
  readonly status: TaskStatus;
  readonly assigneeId: string | null;
  readonly requirements: readonly DeliverableRequirement[];
  readonly submissions: readonly Submission[];
  readonly reviews: readonly Review[];
}
export interface Company {
  readonly name: string;
  readonly businessType: string;
  readonly businessStage: "pre_revenue";
  readonly firstProduct: string;
  readonly day: number;
  readonly finances: {
    readonly currency: "KRW";
    readonly cash: number;
    readonly cumulativeRevenue: number;
    readonly cumulativeExpenses: number;
  };
}
export interface GameState {
  readonly dataSource: "simulation";
  readonly company: Company;
  readonly employees: readonly Employee[];
  readonly tasks: readonly Task[];
}
