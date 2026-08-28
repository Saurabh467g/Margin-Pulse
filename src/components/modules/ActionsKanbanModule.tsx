import React, { useState, useMemo } from 'react';
import {
  Kanban,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Shield,
  Building,
  UserCheck,
  Lock,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Opportunity, OpportunityStatus } from '../../types';

export const ActionsKanbanModule: React.FC = () => {
  const {
    opportunities,
    setSelectedOpportunityId,
    updateOpportunityStatus,
    permissions,
    activeRole,
    kpis
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const columns: { status: OpportunityStatus; title: string; color: string; border: string }[] = [
    { status: 'Discovered', title: 'Discovered', color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200', border: 'border-slate-300 dark:border-slate-700' },
    { status: 'In Review', title: 'In Review', color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-800' },
    { status: 'In Progress', title: 'In Progress', color: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200', border: 'border-slate-300 dark:border-slate-700' },
    { status: 'Approved', title: 'Approved', color: 'bg-slate-200/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100', border: 'border-slate-300 dark:border-slate-700' },
    { status: 'Recovered', title: 'Recovered', color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-800' }
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((o) => {
      if (selectedDept !== 'All' && o.department !== selectedDept) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          o.title.toLowerCase().includes(q) ||
          o.code.toLowerCase().includes(q) ||
          o.owner.toLowerCase().includes(q) ||
          o.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [opportunities, selectedDept, searchQuery]);

  const departmentList = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => set.add(o.department));
    return ['All', ...Array.from(set).sort()];
  }, [opportunities]);

  const handleAdvanceStatus = (opp: Opportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    const order: OpportunityStatus[] = ['Discovered', 'In Review', 'In Progress', 'Approved', 'Recovered'];
    const currentIndex = order.indexOf(opp.status);
    if (currentIndex < order.length - 1) {
      const nextStatus = order[currentIndex + 1];
      if (nextStatus === 'Recovered' && !permissions.canApproveRecovery) {
        alert(`Approval restricted: Role '${activeRole}' cannot approve recovery sums.`);
        return;
      }
      updateOpportunityStatus(opp.id, nextStatus);
    }
  };

  return (
    <div id="module-actions-kanban" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Operational Workflow Engine
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Opportunity Recovery Pipeline
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Live operational recovery workflow. Tracks each opportunity from initial algorithmic discovery through clinical audit, executive sign-off, and verified cash recovery.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter board..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-md pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
          >
            {departmentList.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colItems = filteredOpportunities.filter((o) => o.status === col.status);
          const colTotalValue = colItems.reduce(
            (acc, o) => acc + (col.status === 'Recovered' ? o.recoveredAmount : o.annualImpact),
            0
          );

          return (
            <div
              key={col.status}
              className="bg-slate-50/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[78vh] overflow-hidden shadow-2xs"
            >
              {/* Column Header */}
              <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {col.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {colItems.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                  ₹{colTotalValue.toLocaleString()}
                </div>
              </div>

              {/* Items Scrollable List */}
              <div className="p-3 overflow-y-auto space-y-3 flex-1 min-h-[350px]">
                {colItems.length === 0 ? (
                  <div className="text-center py-12 text-[11px] text-slate-400 dark:text-slate-500 italic">
                    No items in {col.title}
                  </div>
                ) : (
                  colItems.map((opp) => (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunityId(opp.id)}
                      className="p-4 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300">
                          {opp.code}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-emerald-400">
                          ₹{opp.annualImpact.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2 leading-snug transition-colors">
                        {opp.title}
                      </h4>

                      <div className="text-[10px] text-slate-400 dark:text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="truncate max-w-[110px]">{opp.department}</span>
                        <span className="font-mono text-slate-400 dark:text-slate-400">{opp.timeToValueWeeks}w TTV</span>
                      </div>

                      {/* Advance Button */}
                      {col.status !== 'Recovered' && (
                        <button
                          onClick={(e) => handleAdvanceStatus(opp, e)}
                          disabled={!permissions.canAct}
                          className="w-full mt-2 py-1.5 px-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 text-[10px] font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                        >
                          <span>Advance Step</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
