export type ModuleId =
  | 'overview'
  | 'opportunities'
  | 'revenue-leakage'
  | 'cost-intelligence'
  | 'contract-intelligence'
  | 'capacity-waste'
  | 'service-lines'
  | 'what-if'
  | 'actions'
  | 'data-health'
  | 'audit-log';

export type CategoryId =
  | 'Revenue Leakage'
  | 'Capacity & Waste'
  | 'Cost Intelligence'
  | 'Service Lines';

export type OpportunityStatus =
  | 'Discovered'
  | 'In Review'
  | 'In Progress'
  | 'Approved'
  | 'Recovered'
  | 'Dismissed';

export type EffortLevel = 'Low' | 'Medium' | 'High';
export type HorizonPeriod = 'Quick Win (<30d)' | 'Medium (1-3m)' | 'Strategic (3-6m)';
export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type UserRole =
  | 'Admin'
  | 'CFO / Finance'
  | 'Revenue Integrity'
  | 'Operations'
  | 'Procurement'
  | 'Department Manager'
  | 'Viewer';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  opportunityId?: string;
  opportunityTitle?: string;
  previousValue?: string;
  newValue?: string;
}

export interface RootCauseStep {
  step: number;
  title: string;
  detail: string;
}

export interface SupportingEvidence {
  metric: string;
  value: string;
  benchmark: string;
  sourceDataset: string;
}

export interface CalculationDetail {
  formula: string;
  factors: { name: string; value: string; note?: string }[];
  annualTotal: number;
  monthlyTotal: number;
}

export interface Opportunity {
  id: string;
  code: string;
  title: string;
  category: CategoryId;
  department: string;
  monthlyImpact: number;
  annualImpact: number;
  expectedRecovery: number;
  recoveredAmount: number;
  valueAtRisk: number;
  status: OpportunityStatus;
  owner: string;
  ownerRole: string;
  confidence: number; // percentage 0-100
  effort: EffortLevel;
  horizon: HorizonPeriod;
  timeToValueWeeks: number;
  severity: SeverityLevel;
  rootCause: string;
  rootCauseChain: RootCauseStep[];
  plainEnglishWhy: string;
  evidence: SupportingEvidence[];
  calculation: CalculationDetail;
  recommendedAction: string;
  policyChange: string;
  createdAt: string;
  dueDate: string;
  lastUpdated: string;
  auditTrail: AuditLogEntry[];
}

export interface DataSourceDataset {
  id: string;
  name: string;
  records: number;
  system: string;
  completeness: number; // 0-100%
  status: 'Healthy' | 'Warning' | 'Syncing';
  lastSync: string;
  dataQualityChecks: {
    passed: number;
    warnings: number;
    failed: number;
    rulesEvaluated: number;
  };
}

export interface RolePermissions {
  canView: boolean;
  canAct: boolean;
  canApproveRecovery: boolean;
}

export type ThemeMode = 'light' | 'dark';
