import React, { useState, useMemo } from 'react';
import {
  Filter,
  Search,
  Sparkles,
  ArrowUpDown,
  ChevronRight,
  Shield,
  Layers,
  Clock,
  Zap,
  TrendingDown,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId, OpportunityStatus, Opportunity } from '../../types';

export const OpportunitiesModule: React.FC = () => {
  const {
    opportunities,
    setSelectedOpportunityId,
    setTargetSolverOpen,
    kpis
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedEffort, setSelectedEffort] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'value' | 'confidence' | 'ttv' | 'code'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract unique departments
  const departments = useMemo(() => {
    const set = new Set<string>();
    opportunities.forEach((o) => set.add(o.department));
    return ['All', ...Array.from(set).sort()];
  }, [opportunities]);

  // Filter & Sort
  const filteredList = useMemo(() => {
    return opportunities
      .filter((opp) => {
        if (selectedCategory !== 'All' && opp.category !== selectedCategory) return false;
        if (selectedStatus !== 'All' && opp.status !== selectedStatus) return false;
        if (selectedDept !== 'All' && opp.department !== selectedDept) return false;
        if (selectedEffort !== 'All' && opp.effort !== selectedEffort) return false;
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const match =
            opp.title.toLowerCase().includes(q) ||
            opp.code.toLowerCase().includes(q) ||
            opp.department.toLowerCase().includes(q) ||
            opp.owner.toLowerCase().includes(q) ||
            opp.rootCause.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'value') {
          diff = b.annualImpact - a.annualImpact;
        } else if (sortBy === 'confidence') {
          diff = b.confidence - a.confidence;
        } else if (sortBy === 'ttv') {
          diff = a.timeToValueWeeks - b.timeToValueWeeks;
        } else if (sortBy === 'code') {
          diff = a.code.localeCompare(b.code);
        }
        return sortOrder === 'asc' ? -diff : diff;
      });
  }, [
    opportunities,
    selectedCategory,
    selectedStatus,
    selectedDept,
    selectedEffort,
    searchFilter,
    sortBy,
    sortOrder
  ]);

  const filteredTotalValue = useMemo(() => {
    return filteredList.reduce((acc, o) => acc + o.annualImpact, 0);
  }, [filteredList]);

  const filteredRecoveredValue = useMemo(() => {
    return filteredList.reduce((acc, o) => acc + o.recoveredAmount, 0);
  }, [filteredList]);

  const statusBadge = (status: OpportunityStatus) => {
    switch (status) {
      case 'Recovered':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300';
      case 'Approved':
        return 'bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
      case 'In Progress':
        return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800';
      case 'In Review':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div id="module-opportunities" className="space-y-6">
      {/* Header & Find Me ₹5M Action Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            41 Cataloged Targets
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Opportunities Backlog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ranked, multi-factor prioritized catalog of all profit leakage opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTargetSolverOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold tracking-wide shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Target Solver ("Find Me ₹5M")</span>
          </button>
        </div>
      </div>

      {/* Filter Bar & Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code, title, clinical root cause, owner..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-md pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Categories (4)</option>
              <option value="Revenue Leakage">Revenue Leakage (18)</option>
              <option value="Capacity & Waste">Capacity & Waste (7)</option>
              <option value="Cost Intelligence">Cost Intelligence (10)</option>
              <option value="Service Lines">Service Lines (6)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Discovered">Discovered</option>
              <option value="In Review">In Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Approved">Approved</option>
              <option value="Recovered">Recovered</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary & Sort Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <span>
              Showing <strong className="text-slate-900 dark:text-slate-100">{filteredList.length}</strong> of {opportunities.length}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>
              Filtered Value:{' '}
              <strong className="font-mono text-slate-900 dark:text-emerald-400">
                ₹{filteredTotalValue.toLocaleString()}
              </strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Recovered: <strong className="font-mono">₹{filteredRecoveredValue.toLocaleString()}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 font-medium cursor-pointer"
            >
              <option value="value">Annual Value (₹)</option>
              <option value="confidence">Confidence Score (%)</option>
              <option value="ttv">Time-to-Value (Weeks)</option>
              <option value="code">Code (ID)</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 border border-slate-200/80 dark:border-slate-700 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer"
              title="Toggle sort order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              <tr>
                <th className="py-3 px-4">Code / Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Annual Impact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Owner</th>
                <th className="py-3 px-3">Confidence</th>
                <th className="py-3 px-3">TTV</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                    No opportunities match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((opp) => (
                  <tr
                    key={opp.id}
                    onClick={() => setSelectedOpportunityId(opp.id)}
                    className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 text-slate-700 dark:text-slate-300 flex-shrink-0 transition-colors">
                          {opp.code}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate transition-colors">
                          {opp.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                        {opp.plainEnglishWhy}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {opp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                      {opp.department}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-900 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                        ₹{opp.annualImpact.toLocaleString()}
                      </div>
                      {opp.recoveredAmount > 0 && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ₹{opp.recoveredAmount.toLocaleString()} recovered
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusBadge(
                          opp.status
                        )}`}
                      >
                        {opp.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                      <div className="font-medium text-slate-900 dark:text-white">{opp.owner}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">{opp.ownerRole}</div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-900 dark:text-slate-200 font-semibold">
                      {opp.confidence}%
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium font-mono">
                      {opp.timeToValueWeeks}w
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <span className="text-slate-900 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 font-bold inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-all text-xs px-2.5 py-1 rounded bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-100/70 dark:group-hover:bg-emerald-950">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
