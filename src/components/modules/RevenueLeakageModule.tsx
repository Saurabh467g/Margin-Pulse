import React, { useMemo } from 'react';
import {
  TrendingDown,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  ChevronRight
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
  Tooltip,
  Legend
} from 'recharts';

export const RevenueLeakageModule: React.FC = () => {
  const { opportunities, setSelectedOpportunityId, kpis } = useStore();

  const revOpportunities = useMemo(() => {
    return opportunities.filter((o) => o.category === 'Revenue Leakage');
  }, [opportunities]);

  const totalIdentified = revOpportunities.reduce((acc, o) => acc + o.annualImpact, 0);
  const totalRecovered = revOpportunities.reduce((acc, o) => acc + o.recoveredAmount, 0);
  const openCount = revOpportunities.filter((o) => o.status !== 'Recovered').length;

  // Root cause sub-domain breakdown
  const denialBreakdownData = [
    { name: 'Uncaptured Add-on Codes & Biologics', value: 850200, count: 4 },
    { name: 'Acuity Down-Coding (ED & Neonatal)', value: 852000, count: 3 },
    { name: 'Timely Filing & Denial Expirations', value: 543000, count: 3 },
    { name: 'Missing Modifiers & Wastage (JW/JZ)', value: 373562, count: 2 },
    { name: 'Prior Auth Protocol Mismatch', value: 359400, count: 3 },
    { name: 'Unbilled Timed Therapy & Monitoring', value: 388400, count: 3 }
  ];

  return (
    <div id="module-revenue-leakage" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Category Domain • 18 Opportunities
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Revenue Leakage Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Surfaces money that should have been received from payers and patients: under-billing, claim denials, missing modifiers, uncaptured surgical add-ons, and coding gaps.
          </p>
        </div>

        <div className="flex items-center gap-6 text-right flex-shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Category Total</div>
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
          title="Revenue at Risk"
          value={`₹${(totalIdentified / 1000000).toFixed(2)}M`}
          subtitle="18 discrete opportunities"
          badge="High Impact"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Realized Recoveries"
          value={`₹${(totalRecovered / 1000).toFixed(0)}k`}
          subtitle={`${((totalRecovered / totalIdentified) * 100).toFixed(1)}% recovery rate`}
          badge="Cash In Bank"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Unresolved Pipeline"
          value={`₹${((totalIdentified - totalRecovered) / 1000000).toFixed(2)}M`}
          subtitle={`${openCount} open action items`}
          badge="Actionable"
          badgeColor="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
        />
        <StatCard
          title="Avg Time-to-Value"
          value="2.6 Weeks"
          subtitle="Rapid EHR & charge fixes"
          badge="Quick Turnaround"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* Breakdown Chart & Root Causes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Revenue Leakage by Root Cause Sub-Domain</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Distribution of unbilled and denied claims</p>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={denialBreakdownData}
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={10}
                  width={150}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Annual Leakage']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                    border: '1px solid #334155',
                    padding: '8px 12px'
                  }}
                />
                <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Payer Denial & Under-Billing Diagnosis</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Core operational leakage patterns identified in claims</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>EHR Biologics & Implant Drop-Off</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">₹519,000 / yr</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                Surgeons document high-cost BMP graft usage, but charge routers fail to map the required secondary billing code before final claim submission.
              </p>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Emergency Department Level 4/5 Downcoding</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">₹441,600 / yr</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                High-acuity resuscitation encounters coded as simple Level 3 visits due to missing medical decision-making checkboxes in triage notes.
              </p>
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Timely Filing & Appeal Expirations</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">₹354,000 / yr</span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-1">
                Commercial payer 60-day appeal deadlines lapse because unresolved high-dollar inpatient claims sit in FIFO queues without automated countdown alerts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* List of all 18 Revenue Leakage Opportunities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              All 18 Revenue Leakage Opportunities
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Ranked by annual impact</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">18 items • ₹3,366,562 Total</span>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {revOpportunities.map((opp, idx) => (
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
