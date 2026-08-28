import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  ListPlus,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Opportunity } from '../../types';

export const TargetSolverModal: React.FC = () => {
  const {
    targetSolverOpen,
    setTargetSolverOpen,
    opportunities,
    setSelectedOpportunityId,
    batchUpdateStatus,
    permissions
  } = useStore();

  const [targetAmount, setTargetAmount] = useState<number>(5000000);
  const [strategy, setStrategy] = useState<'quickest' | 'highest_value' | 'highest_confidence' | 'lowest_effort'>('quickest');
  const [appliedBatch, setAppliedBatch] = useState(false);

  // Compute the optimal subset based on strategy
  const selectedSubset = useMemo(() => {
    // Only pick opportunities that are not already fully recovered
    const candidates = opportunities.filter((o) => o.status !== 'Recovered' && o.status !== 'Dismissed');

    const sorted = [...candidates].sort((a, b) => {
      if (strategy === 'quickest') {
        // Quickest time to value, then highest impact
        if (a.timeToValueWeeks !== b.timeToValueWeeks) {
          return a.timeToValueWeeks - b.timeToValueWeeks;
        }
        return b.annualImpact - a.annualImpact;
      } else if (strategy === 'highest_confidence') {
        // Highest confidence score, then impact
        if (b.confidence !== a.confidence) {
          return b.confidence - a.confidence;
        }
        return b.annualImpact - a.annualImpact;
      } else if (strategy === 'lowest_effort') {
        const effortRank = { Low: 1, Medium: 2, High: 3 };
        if (effortRank[a.effort] !== effortRank[b.effort]) {
          return effortRank[a.effort] - effortRank[b.effort];
        }
        return b.annualImpact - a.annualImpact;
      } else {
        // Highest individual value (smallest set)
        return b.annualImpact - a.annualImpact;
      }
    });

    const subset: Opportunity[] = [];
    let accumulated = 0;

    for (const opp of sorted) {
      subset.push(opp);
      accumulated += opp.annualImpact;
      if (accumulated >= targetAmount) {
        break;
      }
    }

    return {
      items: subset,
      totalImpact: accumulated,
      averageConfidence: subset.length
        ? Math.round(subset.reduce((acc, o) => acc + o.confidence, 0) / subset.length)
        : 0,
      averageWeeks: subset.length
        ? (subset.reduce((acc, o) => acc + o.timeToValueWeeks, 0) / subset.length).toFixed(1)
        : '0',
      count: subset.length
    };
  }, [opportunities, targetAmount, strategy]);

  if (!targetSolverOpen) return null;

  const handleBatchAdvance = () => {
    if (!permissions.canAct) return;
    const openIds = selectedSubset.items
      .filter((o) => o.status === 'Discovered' || o.status === 'In Review')
      .map((o) => o.id);

    batchUpdateStatus(openIds, 'In Progress');
    setAppliedBatch(true);
    setTimeout(() => {
      setAppliedBatch(false);
      setTargetSolverOpen(false);
    }, 2000);
  };

  return (
    <div
      id="target-solver-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={() => setTargetSolverOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Mathematical Optimization Engine
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Target Recovery Solver ("Find Me ₹5M")
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identifies the minimal, highest-confidence subset of opportunities to reach your financial target.
            </p>
          </div>
          <button
            onClick={() => setTargetSolverOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 space-y-4">
          {/* Target Amount Selector */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Financial Target:</span>
              <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                ₹{(targetAmount / 1000000).toFixed(2)}M ({targetAmount.toLocaleString()} INR)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[1000000, 2500000, 5000000, 7500000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTargetAmount(amt)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold font-mono transition-all cursor-pointer ${
                    targetAmount === amt
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/40 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  ₹{(amt / 1000000).toFixed(1)}M
                </button>
              ))}

              <div className="flex items-center gap-2 ml-auto flex-1 max-w-xs">
                <input
                  type="range"
                  min={500000}
                  max={9000000}
                  step={250000}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Strategy Selector */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 block mb-2">
              Optimization Strategy:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quickest', label: 'Fastest Time-to-Value', icon: Clock },
                { id: 'highest_value', label: 'Smallest Set (Max Value)', icon: TrendingUp },
                { id: 'highest_confidence', label: 'Highest Confidence', icon: ShieldCheck },
                { id: 'lowest_effort', label: 'Lowest Effort First', icon: Zap }
              ].map((strat) => {
                const Icon = strat.icon;
                const active = strategy === strat.id;
                return (
                  <button
                    key={strat.id}
                    onClick={() => setStrategy(strat.id as any)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-2.5 text-xs transition-all cursor-pointer ${
                      active
                        ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/60 text-slate-900 dark:text-emerald-300 font-bold shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:scale-[1.01]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span className="leading-tight">{strat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Summary Box */}
        <div className="p-5 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between gap-4 text-xs border-b border-slate-800">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Solver Solution:</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              ₹{selectedSubset.totalImpact.toLocaleString()} in {selectedSubset.count} Opportunities
            </div>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div className="border-l border-slate-800 pl-5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Confidence</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{selectedSubset.averageConfidence}%</div>
            </div>
            <div className="border-l border-slate-800 pl-5">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Time-to-Value</div>
              <div className="text-sm font-bold font-mono text-white mt-0.5">{selectedSubset.averageWeeks} wks</div>
            </div>
          </div>
        </div>

        {/* Selected Opportunities List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 max-h-64 bg-slate-50/40 dark:bg-slate-900/60">
          {selectedSubset.items.map((opp, idx) => (
            <div
              key={opp.id}
              onClick={() => {
                setSelectedOpportunityId(opp.id);
                setTargetSolverOpen(false);
              }}
              className="p-3.5 bg-white dark:bg-slate-800/90 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {opp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors">{opp.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    {opp.department} • {opp.category} • {opp.timeToValueWeeks}w time-to-value • {opp.confidence}% conf
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                <div className="text-xs font-bold text-slate-900 dark:text-emerald-400 font-mono">
                  ₹{opp.annualImpact.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">
                  View Detail →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {appliedBatch ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Opportunities moved to In Progress!
              </span>
            ) : (
              '1-click assigns open items to active recovery pipeline'
            )}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetSolverOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleBatchAdvance}
              disabled={!permissions.canAct || appliedBatch}
              className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-all shadow-sm ring-1 ring-emerald-500/30 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <ListPlus className="w-3.5 h-3.5 text-emerald-100" />
              <span>Advance All to In Progress</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
