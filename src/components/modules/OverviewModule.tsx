import React from 'react';
import {
  TrendingDown,
  Coins,
  Gauge,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const OverviewModule: React.FC = () => {
  const { kpis, opportunities, setSelectedOpportunityId, setTargetSolverOpen, setActiveModule } =
    useStore();

  // Monthly trend data for the 6-month analysis window (Jan - Jun 2026)
  const monthlyTrendData = [
    { month: 'Jan 2026', identified: 1450000, recovered: 42000, inProgress: 80000 },
    { month: 'Feb 2026', identified: 1580000, recovered: 78000, inProgress: 140000 },
    { month: 'Mar 2026', identified: 1620000, recovered: 115000, inProgress: 210000 },
    { month: 'Apr 2026', identified: 1590000, recovered: 138000, inProgress: 320000 },
    { month: 'May 2026', identified: 1670000, recovered: 142000, inProgress: 410000 },
    { month: 'Jun 2026', identified: 1698231, recovered: 153714, inProgress: 894988 }
  ];

  // Category mix for pie chart
  const categoryChartData = [
    {
      name: 'Revenue Leakage',
      value: kpis.categorySummaries['Revenue Leakage'].annualImpact,
      color: '#f43f5e',
      count: kpis.categorySummaries['Revenue Leakage'].count
    },
    {
      name: 'Capacity & Waste',
      value: kpis.categorySummaries['Capacity & Waste'].annualImpact,
      color: '#a855f7',
      count: kpis.categorySummaries['Capacity & Waste'].count
    },
    {
      name: 'Cost Intelligence',
      value: kpis.categorySummaries['Cost Intelligence'].annualImpact,
      color: '#f59e0b',
      count: kpis.categorySummaries['Cost Intelligence'].count
    },
    {
      name: 'Service Lines',
      value: kpis.categorySummaries['Service Lines'].annualImpact,
      color: '#10b981',
      count: kpis.categorySummaries['Service Lines'].count
    }
  ];

  // Top 5 largest unrecovered opportunities
  const topOpportunities = [...opportunities]
    .filter((o) => o.status !== 'Recovered')
    .sort((a, b) => b.valueAtRisk - a.valueAtRisk)
    .slice(0, 5);

  const formatEuro = (val: number) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(2)}M`;
    return `₹${Math.round(val / 1000)}k`;
  };

  return (
    <div id="module-overview" className="space-y-6">
      {/* Top Header Card in Clean Minimalism */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/50">
              XYZ Hospital • 400-Bed Facility
            </span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
              Analysis Window: Jan – Jun 2026
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            Profit Leakage Executive Command Center
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Consolidates hidden revenue losses, supply cost drift, under-used capacity, and payer rate discrepancies into one continuous recovery engine.
          </p>
        </div>

        <button
          onClick={() => setTargetSolverOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex-shrink-0"
        >
          <Sparkles className="w-4 h-4 text-emerald-100" />
          <span>Launch "Find Me ₹5M" Solver</span>
        </button>
      </div>

      {/* 5 Core Headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Identified"
          value={`₹${(kpis.totalIdentified / 1000000).toFixed(2)}M`}
          subtitle={`${kpis.totalOpportunities} Total Opportunities`}
          badge="Annualized"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
        />
        <StatCard
          title="Recovered YTD"
          value={`₹${(kpis.recoveredYTD / 1000).toFixed(0)}k`}
          subtitle={`${((kpis.recoveredYTD / kpis.totalIdentified) * 100).toFixed(1)}% of Identified`}
          badge="Verified"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
          trend="+12.4% vs last mo"
          trendGood={true}
        />
        <StatCard
          title="In-Progress Pipeline"
          value={`₹${(kpis.inProgressValue / 1000).toFixed(0)}k`}
          subtitle="Assigned & Active"
          badge="Active"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Unresolved Value"
          value={`₹${(kpis.unresolvedValue / 1000000).toFixed(2)}M`}
          subtitle={`${kpis.openOpportunities} Open Items`}
          badge="Actionable"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Leakage Rate"
          value={`${kpis.revenueLeakageRate}%`}
          subtitle="of Expected Revenue"
          badge="Risk Metric"
          badgeColor="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
        />
      </div>

      {/* Visual Analytics Grid: Category Mix + 6-Month Trajectory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4 Category Deep Dive Cards (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Improvement by Category</h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">4 distinct leakage domains</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-900 dark:text-emerald-400">
                ₹{(kpis.totalIdentified / 1000000).toFixed(2)}M Total
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {[
                {
                  id: 'revenue-leakage',
                  name: 'Revenue Leakage',
                  impact: kpis.categorySummaries['Revenue Leakage'].annualImpact,
                  count: kpis.categorySummaries['Revenue Leakage'].count,
                  recovered: kpis.categorySummaries['Revenue Leakage'].recovered,
                  color: 'text-rose-600 bg-rose-50 border-rose-100',
                  barColor: 'bg-rose-500',
                  dotColor: 'bg-rose-500',
                  icon: TrendingDown,
                  sub: 'Under-billing, denied claims, coding gaps'
                },
                {
                  id: 'capacity-waste',
                  name: 'Capacity & Waste',
                  impact: kpis.categorySummaries['Capacity & Waste'].annualImpact,
                  count: kpis.categorySummaries['Capacity & Waste'].count,
                  recovered: kpis.categorySummaries['Capacity & Waste'].recovered,
                  color: 'text-purple-600 bg-purple-50 border-purple-100',
                  barColor: 'bg-purple-500',
                  dotColor: 'bg-purple-500',
                  icon: Gauge,
                  sub: 'OR starts, excess LOS, scanner idle time'
                },
                {
                  id: 'cost-intelligence',
                  name: 'Cost Intelligence',
                  impact: kpis.categorySummaries['Cost Intelligence'].annualImpact,
                  count: kpis.categorySummaries['Cost Intelligence'].count,
                  recovered: kpis.categorySummaries['Cost Intelligence'].recovered,
                  color: 'text-amber-600 bg-amber-50 border-amber-100',
                  barColor: 'bg-amber-500',
                  dotColor: 'bg-amber-500',
                  icon: Coins,
                  sub: 'Implant variance, agency nursing, pharma'
                },
                {
                  id: 'service-lines',
                  name: 'Service Lines',
                  impact: kpis.categorySummaries['Service Lines'].annualImpact,
                  count: kpis.categorySummaries['Service Lines'].count,
                  recovered: kpis.categorySummaries['Service Lines'].recovered,
                  color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
                  barColor: 'bg-emerald-500',
                  dotColor: 'bg-emerald-500',
                  icon: Layers,
                  sub: 'Contribution margin by procedure & dept'
                }
              ].map((cat) => {
                const Icon = cat.icon;
                const percent = ((cat.impact / kpis.totalIdentified) * 100).toFixed(1);
                return (
                  <div
                    key={cat.id}
                    onClick={() => setActiveModule(cat.id as any)}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center gap-1">
                            <span>{cat.name}</span>
                            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">{cat.sub}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          ₹{(cat.impact / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          {cat.count} opps • {percent}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.barColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: 6-Month Financial Trajectory Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">6-Month Recovery Trajectory</h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
                Monthly Leakage Identified vs. Realized Recoveries
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Identified</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Recovered</span>
              </span>
            </div>
          </div>

          <div className="h-64 mt-4 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorId" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: '1px solid #334155',
                    padding: '8px 12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="identified"
                  name="Identified Risk"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorId)"
                />
                <Area
                  type="monotone"
                  dataKey="recovered"
                  name="Recovered Cash"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRec)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 mt-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Current Recovery Run-rate: <strong className="text-emerald-900 dark:text-emerald-300 font-semibold">₹153.7k / month</strong></span>
            </span>
            <button
              onClick={() => setActiveModule('actions')}
              className="text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 font-bold flex items-center gap-1 cursor-pointer transition-colors px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              <span>View Kanban Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Priority Opportunities Ranked by Size */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Priority Recovery Opportunities</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Ranked by annual value at risk across clinical and operational areas
            </p>
          </div>
          <button
            onClick={() => setActiveModule('opportunities')}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center gap-1 cursor-pointer transition-all px-3 py-1.5 rounded-md bg-emerald-50/70 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/60 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>View All 41 Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {topOpportunities.map((opp, index) => (
            <div
              key={opp.id}
              onClick={() => setSelectedOpportunityId(opp.id)}
              className="p-4 bg-white dark:bg-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-xs rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="w-7 h-7 rounded-md bg-slate-900 dark:bg-emerald-600 group-hover:bg-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center transition-colors">
                  #{index + 1}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {opp.code}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors">
                      {opp.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    {opp.department} • {opp.category} • Owner: {opp.owner} • Status: {opp.status}
                  </div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-4">
                <div className="font-mono text-sm font-bold text-slate-900 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  ₹{opp.annualImpact.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-end gap-2 mt-0.5">
                  <span>{opp.confidence}% confidence</span>
                  <span>• {opp.timeToValueWeeks}w TTV</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
