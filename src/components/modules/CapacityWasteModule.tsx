import React, { useMemo } from 'react';
import {
  Gauge,
  Clock,
  Bed,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Zap,
  Activity
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';

export const CapacityWasteModule: React.FC = () => {
  const { opportunities, setSelectedOpportunityId } = useStore();

  const capOpportunities = useMemo(() => {
    return opportunities.filter((o) => o.category === 'Capacity & Waste');
  }, [opportunities]);

  const totalIdentified = capOpportunities.reduce((acc, o) => acc + o.annualImpact, 0);
  const totalRecovered = capOpportunities.reduce((acc, o) => acc + o.recoveredAmount, 0);

  const capacityMetrics = [
    {
      label: 'OR First-Case On-Time Start',
      current: '44.8%',
      target: '> 85.0%',
      gap: '-40.2%',
      valueRisk: '₹1,014,000 / yr',
      status: 'Critical Bottleneck',
      progress: 44.8,
      color: 'bg-rose-500'
    },
    {
      label: 'Inpatient Length of Stay (ALOS)',
      current: '+1.8 Days',
      target: '± 0.2 Days DRG Mean',
      gap: '2,900 Bed Days',
      valueRisk: '₹837,600 / yr',
      status: 'Post-Acute Placement Delay',
      progress: 35,
      color: 'bg-rose-500'
    },
    {
      label: '3T MRI / CT Scanner Utilization',
      current: '61.4%',
      target: '> 85.0%',
      gap: '1,500 Scans Lost',
      valueRisk: '₹570,000 / yr',
      status: 'Protocol Slot Padding',
      progress: 61.4,
      color: 'bg-amber-500'
    },
    {
      label: 'Specialist Clinic No-Show Rate',
      current: '14.8%',
      target: '< 4.5%',
      gap: '3,420 Slots Lost',
      valueRisk: '₹410,400 / yr',
      status: 'Manual Confirmation Gap',
      progress: 72,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div id="module-capacity-waste" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Category Domain • 7 Opportunities
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Capacity & Waste Optimization
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Examines utilization of hospital assets: operating suites, inpatient beds, imaging scanners, and outpatient clinics to quantify revenue tied up in idle capacity.
          </p>
        </div>

        <div className="flex items-center gap-6 text-right flex-shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Capacity at Risk</div>
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
          title="Capacity Value at Risk"
          value={`₹${(totalIdentified / 1000000).toFixed(2)}M`}
          subtitle="7 high-impact areas"
          badge="High Monetization"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Recovered Capacity"
          value={`₹${(totalRecovered / 1000).toFixed(0)}k`}
          subtitle="Realized through fast-tracks"
          badge="Unlocked"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Avoidable Bed Days"
          value="2,900 Days"
          subtitle="Post-acute discharge lag"
          badge="Inpatient Drag"
          badgeColor="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
        />
        <StatCard
          title="Lost Prime OR Minutes"
          value="4,080 / mo"
          subtitle="34 min average morning delay"
          badge="Surgical Schedule"
          badgeColor="bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
        />
      </div>

      {/* 4 Core Capacity Bottlenecks Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Core Hospital Throughput & Utilization Benchmarks
          </h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
            Quantified operational metrics compared to regional peer top-decile performance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capacityMetrics.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{item.label}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {item.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400">Current: </span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">{item.current}</strong>
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 ml-2">Target: {item.target}</span>
                </div>
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono text-xs">{item.valueRisk}</span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List of 7 Capacity Opportunities */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              All 7 Capacity & Waste Opportunities
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Ranked by annual impact</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">7 items • ₹3,362,360 Total</span>
        </div>

        <div className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {capOpportunities.map((opp, idx) => (
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
