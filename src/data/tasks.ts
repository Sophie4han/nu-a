import type { Task } from "../types/game";

export const initialTasks: readonly Task[] = [{
  id: "brand-market-research",
  title: "신규 브랜드 시장조사",
  description: "신규 브랜드 출시 가능성을 평가하기 위해 시장 상황과 경쟁 환경을 분석합니다.",
  requiredRole: "BM",
  status: "available",
  assigneeId: null,
  requirements: [
    { id: "market", label: "시장 현황 요약" },
    { id: "competitors", label: "주요 경쟁사 분석" },
    { id: "target", label: "타깃 고객 정의" },
    { id: "opportunity", label: "시장 진입 가능성 및 판단 근거" },
  ],
  submissions: [],
  reviews: [],
}];
