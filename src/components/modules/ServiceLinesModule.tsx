import React, { useMemo } from 'react';
import {
  Layers,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Stethoscope,
  Building
} from 'lucide-react';
import { SERVICE_LINES_BREAKDOWN } from '../../data/datasets';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const ServiceLinesModule: React.FC = () => {
  const { opportunities, setSelectedOpportunityId } = useStore();

  const srvOpportunities = useMemo(() => {
    return opportunities.filter((o) => o.category === 'Service Lines');
  }, [opportunities]);

  const totalIdentified = srvOpportunities.reduce((acc, o) => acc + o.annualImpact, 0);
  const totalRecovered = srvOpportunities.reduce((acc, o) => acc + o.recoveredAmount, 0);

  const chartData = SERVICE_LINES_BREAKDOWN.map((s) => ({
    name: s.name.split('&')[0].trim(),
    Revenue: Math.round(s.annualRevenue / 1000),
    Contribution: Math.round(s.contributionMargin / 1000),
    Leakage: Math.round(s.leakageIdentified / 1000)
  }));

  return (
    <div id="module-service-lines" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Category Domain • 6 Opportunities
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Service Lines Contribution Margin
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Ranks clinical procedures and clinical departments by direct contribution margin to show which clinical service lines earn their keep, which subsidize overhead, and where margin is quietly eroding.
          </p>
        </div>

        <div className="flex items-center gap-6 text-right flex-shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Service Line Leakage</div>
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
          title="Top Performer Margin"
          value="30.0%"
          subtitle="Cardiology & Vascular"
          badge="High Margin"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Highest Leakage Line"
          value="₹1.19M"
          subtitle="Orthopedics & Spine"
          badge="Supply Spread"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Total Service Lines"
          value="6 Master Lines"
          subtitle="45 detailed sub-specialties"
          badge="Complete Coverage"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        />
        <StatCard
          title="Avg Margin / Case"
          value="₹1,135"
          subtitle="Weighted hospital average"
          badge="Direct Margin"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Service Lines Visual Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Revenue vs. Contribution Margin vs. Identified Leakage (₹k)
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Department-by-department economics across XYZ Hospital
            </p>
          </div>
        </div>

        <div className="h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(v) => `₹${v}k`}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: number) => [`₹${(val * 1000).toLocaleString()}`, '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '11px',
                  border: '1px solid #334155',
                  padding: '8px 12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="Revenue" fill="#64748b" name="Annual Revenue" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Contribution"
                fill="#10b981"
                name="Contribution Margin"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Leakage"
                fill="#f43f5e"
                name="Identified Leakage"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Full Service Lines Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Service Line P&L Contribution & Leakage Ledger
          </h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Departmental economics and clinical volume</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Service Line</th>
                <th className="py-2.5 px-3">Department Head</th>
                <th className="py-2.5 px-3">Annual Revenue</th>
                <th className="py-2.5 px-3">Contribution Margin</th>
                <th className="py-2.5 px-3">Margin %</th>
                <th className="py-2.5 px-3">Annual Cases</th>
                <th className="py-2.5 px-3">Margin / Case</th>
                <th className="py-2.5 px-3">Leakage Identified</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {SERVICE_LINES_BREAKDOWN.map((line, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{line.name}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium">{line.headOfDept}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{line.annualRevenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{line.contributionMargin.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {line.marginPercent}%
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">{line.cases}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{line.marginPerCase.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                    ₹{line.leakageIdentified.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        line.status === 'High Performer'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : line.status === 'At Risk (LOS Drag)'
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {line.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* List of 6 Service Lines Opportunities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              All 6 Service Line Optimization Opportunities
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Ranked by annual impact</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">6 items • ₹1,101,216 Total</span>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {srvOpportunities.map((opp, idx) => (
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
