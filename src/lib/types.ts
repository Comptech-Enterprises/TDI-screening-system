export type Role = 'Sales' | 'HR' | 'Technology';
export type CriterionStatus = 'Met' | 'Partially Met' | 'Not Met';
export type Recommendation = 'Interview' | 'Do Not Interview';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'deactivated';
  lastActiveAt: string;
}

export interface CriterionResult {
  id: string;
  criterionName: string;
  isMustHave: boolean;
  status: CriterionStatus;
  reasoning: string;
  weight: number;
}

export interface Screening {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateLocation: string;
  currentRole: string;
  currentCompany: string;
  overallScore: number;
  recommendation: Recommendation;
  highlights: string[];
  redFlags: string[];
  criteriaResults: CriterionResult[];
  createdAt: string;
}

export interface DashboardStats {
  todayCount: number;
  weekCount: number;
  avgScore: number;
  passRate: number;
}
