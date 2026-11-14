import type { Employee } from "../types/game";

export const initialEmployees: readonly Employee[] = [
  { id: "employee-md", name: "서윤", role: "MD", expertise: ["상품 소싱", "원가 분석", "재고 관리"], personality: "꼼꼼하고 실용적", status: "idle", currentTaskId: null },
  { id: "employee-bm", name: "지우", role: "BM", expertise: ["시장조사", "브랜드 전략", "제품 기획"], personality: "호기심이 많고 분석적", status: "idle", currentTaskId: null },
  { id: "employee-marketer", name: "하린", role: "MARKETER", expertise: ["광고 운영", "CRM", "성과 분석"], personality: "적극적이고 실험을 즐김", status: "idle", currentTaskId: null },
];
