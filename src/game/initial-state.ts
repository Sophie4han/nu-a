import { initialEmployees } from "../data/employees";
import { initialTasks } from "../data/tasks";
import type { GameState } from "../types/game";

export function createInitialState(): GameState {
  return {
    dataSource: "simulation",
    company: {
      name: "LITTLE OFFICE",
      businessType: "D2C 뷰티 스타트업",
      businessStage: "pre_revenue",
      firstProduct: "수분 진정 세럼",
      day: 1,
      finances: { currency: "KRW", cash: 50_000_000, cumulativeRevenue: 0, cumulativeExpenses: 0 },
    },
    employees: structuredClone(initialEmployees),
    tasks: structuredClone(initialTasks),
  };
}
