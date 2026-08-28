import React, { useMemo } from 'react';
import {
  Coins,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  ChevronRight,
  Stethoscope,
  Pill,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const CostIntelligenceModule: React.FC = () => {
  const { opportunities, setSelectedOpportunityId } = useStore();

  const costOpportunities = useMemo(() => {
    return opportunities.filter((o) => o.category === 'Cost Intelligence');
  }, [opportunities]);

  const totalIdentified = costOpportunities.reduce((acc, o) => acc + o.annualImpact, 0);
  const totalRecovered = costOpportunities.reduce((acc, o) => acc + o.recoveredAmount, 0);

  // Surgeon implant variance data
  const implantVarianceData = [
    { surgeon: 'Dr. A. Richter', costPerKnee: 3450, cases: 142, totalSpend: 489900, diff: '+₹1,300' },
    { surgeon: 'Dr. M. Bernard', costPerKnee: 3380, cases: 98, totalSpend: 331240, diff: '+₹1,230' },
    { surgeon: 'Dr. C. Vance', costPerKnee: 2180, cases: 110, totalSpend: 239800, diff: '+₹30' },
    { surgeon: 'Dr. S. Koster', costPerKnee: 2150, cases: 135, totalSpend: 290250, diff: 'Base Formulary' }
  ];

  return (
    <div id="module-cost-intelligence" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Category Domain • 10 Opportunities
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Cost Intelligence & Supply Variance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Compares supply, implant, pharmacy, and labour costs against expected regional benchmarks to show where operational spend is rising faster than expected.
          </p>
        </div>

        <div className="flex items-center gap-6 text-right flex-shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Variance</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-0.5">
              ₹{totalIdentified.toLocaleString()}
            </div>
          </div>
          <div className="border-l border-slate-200/80 dark:border-slate-800 pl-6">
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Recovered YTD</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
              ₹{totalRecovered.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Annual Cost Variance"
          value={`₹${(totalIdentified / 1000000).toFixed(2)}M`}
          subtitle="10 cost opportunities"
          badge="High Savings"
          badgeColor="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
        />
        <StatCard
          title="Implant Price Spread"
          value="+60.4%"
          subtitle="₹2,150 to ₹3,450 per knee"
          badge="Formulary Drift"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Agency Nursing Hours"
          value="11.4%"
          subtitle="Target: < 3.0% of total"
          badge="Labor Variance"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        />
        <StatCard
          title="Biosimilar Adoption"
          value="32.1%"
          subtitle="EU Benchmark: > 85%"
          badge="Pharma Opportunity"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Surgeon Implant Variance Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Surgeon Implant Cost Variance Matrix (Total Knee Arthroplasty)
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Identical clinical indications and outcomes with a ₹1,300 per-case price spread
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded">
            ₹402,000 Annual Variance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Surgeon</th>
                <th className="py-2.5 px-3">Cost / Knee Implant</th>
                <th className="py-2.5 px-3">Annual Volume</th>
                <th className="py-2.5 px-3">Total Department Spend</th>
                <th className="py-2.5 px-3">Variance vs Formulary</th>
                <th className="py-2.5 px-3">Clinical Infection / Readmit Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {implantVarianceData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{row.surgeon}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-emerald-400">
                    ₹{row.costPerKnee.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{row.cases} cases</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{row.totalSpend.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono ${
                        row.diff.startsWith('+')
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {row.diff}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 dark:text-slate-500">0.0% Variance (Equivalent)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* List of 10 Cost Opportunities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              All 10 Cost Intelligence Opportunities
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Ranked by annual impact</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">10 items • ₹1,778,093 Total</span>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {costOpportunities.map((opp, idx) => (
            <div
              key={opp.id}
              onClick={() => setSelectedOpportunityId(opp.id)}
              className="py-3 px-2 flex items-center justify-between hover:bg-emerald-50/40 dark:hover:bg-slate-800/70 rounded-xl transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-6 h-6 rounded bg-slate-900 dark:bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {opp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors">
                      {opp.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                      {opp.department}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 truncate mt-0.5">
                    {opp.rootCause}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4 flex items-center gap-4">
                <div>
                  <div className="font-mono text-xs font-bold text-slate-900 dark:text-emerald-400">
                    ₹{opp.annualImpact.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    {opp.status} • {opp.timeToValueWeeks}w TTV
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
