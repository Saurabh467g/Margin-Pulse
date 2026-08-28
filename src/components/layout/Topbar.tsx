import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  RotateCcw,
  UserCheck,
  ChevronDown,
  Shield,
  CheckCircle2,
  XCircle,
  Building,
  Info,
  Sun,
  Moon
} from 'lucide-react';
import { useStore, ALL_ROLES } from '../../context/StoreContext';
import { UserRole } from '../../types';

export const Topbar: React.FC = () => {
  const {
    activeModule,
    activeRole,
    setActiveRole,
    permissions,
    searchQuery,
    setSearchQuery,
    setTargetSolverOpen,
    resetToBaseline,
    opportunities,
    setSelectedOpportunityId,
    theme,
    toggleTheme
  } = useStore();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'overview':
        return { title: 'Executive Overview', group: 'Command' };
      case 'opportunities':
        return { title: 'Opportunities Backlog', group: 'Command' };
      case 'revenue-leakage':
        return { title: 'Revenue Leakage Intelligence', group: 'Intelligence' };
      case 'cost-intelligence':
        return { title: 'Cost Intelligence & Variances', group: 'Intelligence' };
      case 'contract-intelligence':
        return { title: 'Contract & Payer Intelligence', group: 'Intelligence' };
      case 'capacity-waste':
        return { title: 'Capacity & Waste Optimization', group: 'Intelligence' };
      case 'service-lines':
        return { title: 'Service Lines Contribution Margin', group: 'Intelligence' };
      case 'what-if':
        return { title: 'What-If Financial Simulator', group: 'Act' };
      case 'actions':
        return { title: 'Recovery Actions Kanban', group: 'Act' };
      case 'data-health':
        return { title: 'Data Health & Source Integrity', group: 'Trust' };
      case 'audit-log':
        return { title: 'Audit Trail & Compliance Log', group: 'Trust' };
      default:
        return { title: 'MarginPulse', group: 'Command' };
    }
  };

  const currentModule = getModuleTitle();

  // Search filter results
  const filteredOpps = searchQuery.trim()
    ? opportunities
        .filter(
          (o) =>
            o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResultsOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="main-topbar"
      className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-30 shrink-0 transition-colors duration-200"
    >
      {/* Left: Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="uppercase tracking-[0.15em] text-[10px] font-bold text-slate-400 dark:text-slate-500">{currentModule.group}</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{currentModule.title}</span>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-6 relative" ref={searchRef}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search opportunities, DRGs, departments, root causes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResultsOpen && searchQuery.trim() && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Opportunities matching "{searchQuery}" ({filteredOpps.length})
            </div>
            {filteredOpps.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500 text-center">
                No matching opportunities found.
              </div>
            ) : (
              filteredOpps.map((opp) => (
                <button
                  key={opp.id}
                  onClick={() => {
                    setSelectedOpportunityId(opp.id);
                    setSearchResultsOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors border-b border-slate-100 dark:border-slate-800/60 last:border-0 cursor-pointer"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {opp.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {opp.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {opp.department} • {opp.category} • Status: {opp.status}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-emerald-400 font-mono">
                      ₹{(opp.annualImpact / 1000).toFixed(0)}k/yr
                    </div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{opp.effort} Effort</div>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls: DB Status, Target Solver, Role Switcher, Theme Switcher, Reset Button */}
      <div className="flex items-center gap-2.5">
        {/* Backend Database Status Badge */}
        <div
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold tracking-tight shadow-2xs"
          title="Active Express REST API + JSON Persistent Database Engine"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>DB Synced</span>
        </div>

        {/* Quick Find Me ₹5M button with highlighted green accent */}
        <button
          id="btn-find-5m-topbar"
          onClick={() => setTargetSolverOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-all shadow-sm ring-1 ring-emerald-500/30 hover:ring-emerald-400 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="Find smallest optimal set of opportunities to recover ₹5,000,000"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
          <span>Find ₹5M</span>
        </button>

        {/* Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            id="role-switcher-button"
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/30 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="text-slate-400 dark:text-slate-500">Role:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{activeRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role Dropdown Menu */}
          {roleDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Select Active Persona
                </div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  Demonstrates role-gated workflow actions & approvals
                </div>
              </div>

              <div className="py-1">
                {ALL_ROLES.map((role) => {
                  const isCurrent = activeRole === role;
                  const isApprover =
                    role === 'Admin' || role === 'CFO / Finance' || role === 'Revenue Integrity';
                  const isViewerOnly = role === 'Viewer';

                  return (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRole(role as UserRole);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">{role}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>View: Yes</span>
                          <span>• Act: {isViewerOnly ? 'No' : 'Yes'}</span>
                          <span>• Sign-off: {isApprover ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Mode Toggle (Light / Dark) */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-all cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-2xs"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle light and dark mode"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 hover:text-slate-900 animate-in spin-in-90 duration-300" />
          )}
        </button>

        {/* Reset State Button */}
        <button
          id="btn-reset-state"
          onClick={() => setResetConfirmOpen(true)}
          className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-800 shadow-2xs"
          title="Reset to baseline synthetic state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Reset to Baseline?</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Restores 41 opportunities, ₹9.61M identified, and ₹668.7k baseline recovery state.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToBaseline();
                  setResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
