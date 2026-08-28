import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  Opportunity,
  OpportunityStatus,
  UserRole,
  ModuleId,
  AuditLogEntry,
  RolePermissions,
  CategoryId,
  ThemeMode
} from '../types';
import { INITIAL_OPPORTUNITIES } from '../data/opportunities';

const STORAGE_KEY = 'marginpulse_state_v1';
const THEME_STORAGE_KEY = 'marginpulse_theme_v1';

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: { canView: true, canAct: true, canApproveRecovery: true },
  'CFO / Finance': { canView: true, canAct: true, canApproveRecovery: true },
  'Revenue Integrity': { canView: true, canAct: true, canApproveRecovery: true },
  Operations: { canView: true, canAct: true, canApproveRecovery: false },
  Procurement: { canView: true, canAct: true, canApproveRecovery: false },
  'Department Manager': { canView: true, canAct: true, canApproveRecovery: false },
  Viewer: { canView: true, canAct: false, canApproveRecovery: false }
};

export const ALL_ROLES: UserRole[] = [
  'Admin',
  'CFO / Finance',
  'Revenue Integrity',
  'Operations',
  'Procurement',
  'Department Manager',
  'Viewer'
];

interface DerivedKPIs {
  totalIdentified: number;
  totalOpportunities: number;
  openOpportunities: number;
  recoveredYTD: number;
  inProgressValue: number;
  unresolvedValue: number;
  annualExpectedRevenue: number;
  revenueLeakageRate: number;
  annualCostVariance: number;
  capacityValueAtRisk: number;
  categorySummaries: Record<
    CategoryId,
    { count: number; annualImpact: number; recovered: number; openCount: number }
  >;
}

interface StoreContextType {
  opportunities: Opportunity[];
  activeRole: UserRole;
  activeModule: ModuleId;
  selectedOpportunityId: string | null;
  targetSolverOpen: boolean;
  searchQuery: string;
  auditLogs: AuditLogEntry[];
  kpis: DerivedKPIs;
  permissions: RolePermissions;
  isDbConnected: boolean;
  isSyncing: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setActiveRole: (role: UserRole) => void;
  setActiveModule: (module: ModuleId) => void;
  setSelectedOpportunityId: (id: string | null) => void;
  setTargetSolverOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  updateOpportunityStatus: (
    id: string,
    newStatus: OpportunityStatus,
    recoveredAmountDelta?: number,
    note?: string
  ) => boolean;
  updateOpportunityOwner: (id: string, newOwner: string, newRole: string) => void;
  updateOpportunityRecovery: (id: string, newTotalRecovered: number, note?: string) => boolean;
  batchUpdateStatus: (ids: string[], newStatus: OpportunityStatus) => void;
  resetToBaseline: () => void;
  analyzeOpportunityWithAI: (id: string) => Promise<{
    summary: string;
    keyRiskFactor: string;
    fastestPathToCash: string;
    suggestedKpiGuardrail: string;
    aiGenerated?: boolean;
  }>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_OPPORTUNITIES;
  });

  const [activeRole, setActiveRoleState] = useState<UserRole>('CFO / Finance');
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [targetSolverOpen, setTargetSolverOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  // Apply theme class to document root
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (err) {
      console.warn('Theme update error:', err);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Sync initial state from backend database
  useEffect(() => {
    async function syncFromBackend() {
      try {
        setIsSyncing(true);
        const res = await fetch('/api/opportunities');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setOpportunities(json.data);
            setIsDbConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
            } catch {
              // ignore
            }
          }
        } else {
          setIsDbConnected(false);
        }
      } catch (err) {
        console.warn('Backend database fetch error, running on local cache:', err);
        setIsDbConnected(false);
      } finally {
        setIsSyncing(false);
      }
    }

    syncFromBackend();
  }, []);

  // Persist opportunities to local storage for instant demo reactivity
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(opportunities));
    } catch {
      // ignore
    }
  }, [opportunities]);

  const permissions = useMemo(() => ROLE_PERMISSIONS[activeRole], [activeRole]);

  // Aggregate audit logs
  const auditLogs = useMemo(() => {
    const logs: AuditLogEntry[] = [];
    opportunities.forEach((opp) => {
      opp.auditTrail.forEach((log) => {
        logs.push({
          ...log,
          opportunityId: opp.id,
          opportunityTitle: opp.title
        });
      });
    });
    // Sort descending by timestamp
    return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [opportunities]);

  // Derive KPIs live from state
  const kpis: DerivedKPIs = useMemo(() => {
    const annualExpectedRevenue = 32190948;
    let totalIdentified = 0;
    let recoveredYTD = 0;
    let inProgressValue = 0;
    let unresolvedValue = 0;
    let openCount = 0;
    let annualCostVariance = 0;
    let capacityValueAtRisk = 0;

    const categorySummaries: Record<
      CategoryId,
      { count: number; annualImpact: number; recovered: number; openCount: number }
    > = {
      'Revenue Leakage': { count: 0, annualImpact: 0, recovered: 0, openCount: 0 },
      'Capacity & Waste': { count: 0, annualImpact: 0, recovered: 0, openCount: 0 },
      'Cost Intelligence': { count: 0, annualImpact: 0, recovered: 0, openCount: 0 },
      'Service Lines': { count: 0, annualImpact: 0, recovered: 0, openCount: 0 }
    };

    opportunities.forEach((opp) => {
      totalIdentified += opp.annualImpact;
      recoveredYTD += opp.recoveredAmount || 0;

      const isOpen = opp.status !== 'Recovered' && opp.status !== 'Dismissed';
      if (isOpen) {
        openCount++;
        unresolvedValue += opp.valueAtRisk;
      }

      if (opp.status === 'In Progress' || opp.status === 'In Review') {
        inProgressValue += opp.annualImpact - (opp.recoveredAmount || 0);
      }

      if (opp.category === 'Cost Intelligence') {
        annualCostVariance += opp.annualImpact;
      }
      if (opp.category === 'Capacity & Waste') {
        capacityValueAtRisk += opp.annualImpact;
      }

      // Group totals
      if (categorySummaries[opp.category]) {
        categorySummaries[opp.category].count += 1;
        categorySummaries[opp.category].annualImpact += opp.annualImpact;
        categorySummaries[opp.category].recovered += opp.recoveredAmount || 0;
        if (isOpen) {
          categorySummaries[opp.category].openCount += 1;
        }
      }
    });

    const revenueLeakageRate = Number(((totalIdentified / annualExpectedRevenue) * 100).toFixed(1));

    return {
      totalIdentified,
      totalOpportunities: opportunities.length,
      openOpportunities: openCount,
      recoveredYTD,
      inProgressValue,
      unresolvedValue,
      annualExpectedRevenue,
      revenueLeakageRate,
      annualCostVariance,
      capacityValueAtRisk,
      categorySummaries
    };
  }, [opportunities]);

  const updateOpportunityStatus = (
    id: string,
    newStatus: OpportunityStatus,
    recoveredAmountDelta?: number,
    note?: string
  ): boolean => {
    if (!permissions.canAct) return false;
    if (newStatus === 'Recovered' && !permissions.canApproveRecovery) {
      return false;
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Optimistic client update
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== id) return opp;

        const prevStatus = opp.status;
        const addRecovered = recoveredAmountDelta !== undefined ? recoveredAmountDelta : 0;
        const newRecovered =
          newStatus === 'Recovered' && addRecovered === 0 && opp.recoveredAmount === 0
            ? opp.expectedRecovery
            : opp.recoveredAmount + addRecovered;

        const newValueAtRisk = Math.max(0, opp.annualImpact - newRecovered);

        const newLog: AuditLogEntry = {
          id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: now,
          actorName: activeRole === 'Admin' ? 'System Administrator' : `User (${activeRole})`,
          actorRole: activeRole,
          action: `Status: ${prevStatus} ➔ ${newStatus}`,
          previousValue: prevStatus,
          newValue: newStatus,
          details:
            note ||
            `Transitioned status to ${newStatus}. ${addRecovered > 0 ? `Logged ₹${addRecovered.toLocaleString()} recovered.` : ''}`
        };

        return {
          ...opp,
          status: newStatus,
          recoveredAmount: newRecovered,
          valueAtRisk: newStatus === 'Recovered' ? 0 : newValueAtRisk,
          lastUpdated: now.substring(0, 10),
          auditTrail: [newLog, ...opp.auditTrail]
        };
      })
    );

    // Persist to backend database API
    fetch(`/api/opportunities/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newStatus,
        recoveredAmountDelta,
        note,
        actorRole: activeRole,
        actorName: activeRole === 'Admin' ? 'System Administrator' : `User (${activeRole})`
      })
    })
      .then((res) => {
        if (res.ok) setIsDbConnected(true);
      })
      .catch((err) => {
        console.warn('Backend sync failed, state preserved locally:', err);
      });

    return true;
  };

  const updateOpportunityOwner = (id: string, newOwner: string, newRole: string) => {
    if (!permissions.canAct) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== id) return opp;

        const prevOwner = opp.owner;
        const newLog: AuditLogEntry = {
          id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: now,
          actorName: `User (${activeRole})`,
          actorRole: activeRole,
          action: `Reassigned Owner`,
          previousValue: prevOwner,
          newValue: newOwner,
          details: `Reassigned accountability to ${newOwner} (${newRole})`
        };

        return {
          ...opp,
          owner: newOwner,
          ownerRole: newRole,
          lastUpdated: now.substring(0, 10),
          auditTrail: [newLog, ...opp.auditTrail]
        };
      })
    );

    fetch(`/api/opportunities/${id}/owner`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newOwner,
        newRole,
        actorRole: activeRole
      })
    }).catch((err) => console.warn('Backend sync failed:', err));
  };

  const updateOpportunityRecovery = (
    id: string,
    newTotalRecovered: number,
    note?: string
  ): boolean => {
    if (!permissions.canApproveRecovery) return false;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id !== id) return opp;

        const prevRecovered = opp.recoveredAmount;
        const newValueAtRisk = Math.max(0, opp.annualImpact - newTotalRecovered);
        const autoStatus: OpportunityStatus =
          newTotalRecovered >= opp.annualImpact ? 'Recovered' : opp.status;

        const newLog: AuditLogEntry = {
          id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          timestamp: now,
          actorName: `Sign-off (${activeRole})`,
          actorRole: activeRole,
          action: `Recovery Ledger Updated`,
          previousValue: `₹${prevRecovered.toLocaleString()}`,
          newValue: `₹${newTotalRecovered.toLocaleString()}`,
          details: note || `Verified recovered amount of ₹${newTotalRecovered.toLocaleString()}`
        };

        return {
          ...opp,
          recoveredAmount: newTotalRecovered,
          valueAtRisk: autoStatus === 'Recovered' ? 0 : newValueAtRisk,
          status: autoStatus,
          lastUpdated: now.substring(0, 10),
          auditTrail: [newLog, ...opp.auditTrail]
        };
      })
    );

    fetch(`/api/opportunities/${id}/recovery`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newTotalRecovered,
        note,
        actorRole: activeRole,
        actorName: `Sign-off (${activeRole})`
      })
    }).catch((err) => console.warn('Backend sync failed:', err));

    return true;
  };

  const batchUpdateStatus = (ids: string[], newStatus: OpportunityStatus) => {
    if (!permissions.canAct) return;
    if (newStatus === 'Recovered' && !permissions.canApproveRecovery) return;

    ids.forEach((id) => {
      updateOpportunityStatus(id, newStatus);
    });

    fetch('/api/opportunities/batch-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids,
        newStatus,
        actorRole: activeRole,
        actorName: `User (${activeRole})`
      })
    }).catch((err) => console.warn('Backend batch sync failed:', err));
  };

  const resetToBaseline = () => {
    setOpportunities(INITIAL_OPPORTUNITIES);
    localStorage.removeItem(STORAGE_KEY);
    fetch('/api/opportunities/reset', { method: 'POST' }).catch((err) =>
      console.warn('Backend reset error:', err)
    );
  };

  const analyzeOpportunityWithAI = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/ai/analyze-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: id })
      });
      if (res.ok) {
        const json = await res.json();
        return json.analysis;
      }
    } catch (err) {
      console.error('Error fetching AI analysis:', err);
    }
    const opp = opportunities.find((o) => o.id === id);
    return {
      summary: `Automated analysis for ${opp?.title || 'Opportunity'} (${opp?.code || ''}).`,
      keyRiskFactor: opp?.rootCause || 'Under-documentation and billing lag',
      fastestPathToCash: opp?.recommendedAction || 'Enforce protocol checklists',
      suggestedKpiGuardrail: 'Weekly reconciliation of billing logs'
    };
  }, [opportunities]);

  return (
    <StoreContext.Provider
      value={{
        opportunities,
        activeRole,
        activeModule,
        selectedOpportunityId,
        targetSolverOpen,
        searchQuery,
        kpis,
        permissions,
        auditLogs,
        isDbConnected,
        isSyncing,
        theme,
        setTheme,
        toggleTheme,
        setActiveRole: setActiveRoleState,
        setActiveModule,
        setSelectedOpportunityId,
        setTargetSolverOpen,
        setSearchQuery,
        updateOpportunityStatus,
        updateOpportunityOwner,
        updateOpportunityRecovery,
        batchUpdateStatus,
        resetToBaseline,
        analyzeOpportunityWithAI
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
