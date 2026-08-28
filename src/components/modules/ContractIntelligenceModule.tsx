import React from 'react';
import {
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CONTRACT_INTELLIGENCE_RECORDS } from '../../data/datasets';
import { StatCard } from '../common/StatCard';

export const ContractIntelligenceModule: React.FC = () => {
  return (
    <div id="module-contract-intelligence" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Commercial P&L Intelligence
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Contract Intelligence & Rate Anomalies
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Highlights unfavourable commercial payer and vendor terms, unindexed medical inflation clauses, uncollected volume rebates, and upcoming renewals where XYZ Hospital holds renegotiation leverage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md">
            5 Critical Contracts Audited
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Contracts under Scope"
          value="₹21.58M"
          subtitle="Combined annual value"
          badge="High Exposure"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Uncollected Rebates"
          value="₹142,000"
          subtitle="Tier 3 volume threshold met"
          badge="Immediate Cash"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Inflation Clause Gap"
          value="-2.8%"
          subtitle="Locked at 1.8% vs 4.6% CPI"
          badge="Erosion"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Avg Leverage Score"
          value="81.6 / 100"
          subtitle="Strong bargaining power"
          badge="Favorable"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Contract Detail Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Active Payer & Vendor Negotiation Pipeline
          </h3>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">5 accounts audited</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CONTRACT_INTELLIGENCE_RECORDS.map((cnt) => (
            <div
              key={cnt.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs tracking-wider">
                    {cnt.party.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{cnt.party}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {cnt.type}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          cnt.status === 'Renegotiation Needed'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                            : cnt.status === 'Volume Threshold Exceeded'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {cnt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                      Annual Exposure: <strong className="text-slate-700 dark:text-slate-200">{cnt.annualSpendOrRevenue}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                      Hospital Leverage
                    </div>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-emerald-400 mt-0.5">
                      {cnt.leverageScore}/100
                    </div>
                  </div>
                  <div className="border-l border-slate-200/80 dark:border-slate-800 pl-6">
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">
                      Renewal In
                    </div>
                    <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                      {cnt.daysToExpiry} Days
                    </div>
                  </div>
                </div>
              </div>

              {/* Anomaly & Action grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Contract Anomaly / Leakage Point:</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{cnt.anomaly}</p>
                </div>

                <div className="p-4 bg-slate-50/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Recommended Negotiation Action:</span>
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{cnt.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
