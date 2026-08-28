import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  TrendingDown,
  Coins,
  FileSpreadsheet,
  Gauge,
  Layers,
  SlidersHorizontal,
  KanbanSquare,
  ShieldCheck,
  History,
  Building2,
  Sparkles,
  ChevronRight,
  Zap,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ModuleId } from '../../types';
import { BrandSymbol } from '../common/BrandSymbol';

interface NavItem {
  id: ModuleId;
  label: string;
  shortDesc?: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeType?: 'currency' | 'count' | 'status' | 'neutral';
}

interface NavGroup {
  name: string;
  tag: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeModule, setActiveModule, kpis, setTargetSolverOpen } = useStore();

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(2)}M`;
    }
    return `₹${Math.round(amount / 1000)}k`;
  };

  const navGroups: NavGroup[] = [
    {
      name: 'Executive Command',
      tag: '01',
      items: [
        {
          id: 'overview',
          label: 'Executive Overview',
          shortDesc: 'Hospital-wide P&L snapshot',
          icon: LayoutDashboard
        },
        {
          id: 'opportunities',
          label: 'Opportunity Backlog',
          shortDesc: 'Full 41 leakages register',
          icon: ListTodo,
          badge: `${kpis.totalOpportunities} Items`,
          badgeType: 'neutral'
        }
      ]
    },
    {
      name: 'Clinical Intelligence',
      tag: '02',
      items: [
        {
          id: 'revenue-leakage',
          label: 'Revenue Leakage',
          shortDesc: 'CDI, unbilled & denials',
          icon: TrendingDown,
          badge: formatCurrencyShort(kpis.categorySummaries['Revenue Leakage'].annualImpact),
          badgeType: 'currency'
        },
        {
          id: 'cost-intelligence',
          label: 'Cost Intelligence',
          shortDesc: 'Implants, pharma & supply',
          icon: Coins,
          badge: formatCurrencyShort(kpis.categorySummaries['Cost Intelligence'].annualImpact),
          badgeType: 'currency'
        },
        {
          id: 'contract-intelligence',
          label: 'Contract Intelligence',
          shortDesc: 'Payer rate variances & terms',
          icon: FileSpreadsheet,
          badge: '5 Active',
          badgeType: 'status'
        },
        {
          id: 'capacity-waste',
          label: 'Capacity & Waste',
          shortDesc: 'OR delays, ALOS & bed blocks',
          icon: Gauge,
          badge: formatCurrencyShort(kpis.categorySummaries['Capacity & Waste'].annualImpact),
          badgeType: 'currency'
        },
        {
          id: 'service-lines',
          label: 'Service Line Margins',
          shortDesc: 'Department contribution P&L',
          icon: Layers,
          badge: formatCurrencyShort(kpis.categorySummaries['Service Lines'].annualImpact),
          badgeType: 'currency'
        }
      ]
    },
    {
      name: 'Strategic Action',
      tag: '03',
      items: [
        {
          id: 'what-if',
          label: 'What-If Simulator',
          shortDesc: 'Scenario & policy forecasting',
          icon: SlidersHorizontal
        },
        {
          id: 'actions',
          label: 'Recovery Pipeline',
          shortDesc: 'Live execution Kanban',
          icon: KanbanSquare,
          badge: `${kpis.openOpportunities} Open`,
          badgeType: 'status'
        }
      ]
    },
    {
      name: 'Governance & Trust',
      tag: '04',
      items: [
        {
          id: 'data-health',
          label: 'Data Health & Feeds',
          shortDesc: '10 EHR/ERP connectors',
          icon: ShieldCheck,
          badge: '98.7%',
          badgeType: 'status'
        },
        {
          id: 'audit-log',
          label: 'Audit & Governance',
          shortDesc: 'Immutable compliance trail',
          icon: History
        }
      ]
    }
  ];

  const recoveryProgress = Math.min(
    100,
    Number(((kpis.recoveredYTD / kpis.totalIdentified) * 100).toFixed(1))
  );

  return (
    <aside
      id="main-sidebar"
      className="w-76 flex-shrink-0 bg-white/95 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col justify-between border-r border-slate-200/90 dark:border-slate-800/80 select-none transition-colors duration-200 z-20 backdrop-blur-md"
    >
      {/* Upper Section */}
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/70 to-transparent dark:from-slate-900/30 dark:to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Refined Brand Emblem */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 dark:from-slate-800 dark:to-slate-950 p-1 flex items-center justify-center shadow-md ring-1 ring-emerald-500/40 group-hover:ring-emerald-400 transition-all">
                  <BrandSymbol size={30} />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#07090e] shadow-xs" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    MarginPulse
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60 font-mono tracking-widest uppercase">
                    PRO
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400 dark:text-slate-500 uppercase">
                    Hospital Intelligence
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Facility Status Card with Micro-Accents */}
          <div className="mt-4 p-2.5 rounded-xl bg-slate-50/80 dark:bg-[#0e121a] border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-200/60 dark:border-emerald-800/40">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-[12px]">
                    XYZ Hospital
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span className="font-medium">400 Beds</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">NABH Tier-1</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-1 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              
              {/* Group Header */}
              <div className="px-3 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-extrabold tracking-[0.22em] text-slate-400 dark:text-slate-500 uppercase">
                  {group.name}
                </span>
                <span className="text-[9px] font-mono font-semibold text-slate-400/80 dark:text-slate-600">
                  {group.tag}
                </span>
              </div>

              {/* Group Items */}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      id={`nav-item-${item.id}`}
                      onClick={() => setActiveModule(item.id)}
                      className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 text-left cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-600 to-emerald-700 dark:from-emerald-600 dark:to-emerald-700 text-white font-semibold shadow-md shadow-emerald-900/20 ring-1 ring-emerald-500/40'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/70'
                      }`}
                    >
                      {/* Left Subtle Glow Bar for Active Item */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-200 shadow-sm" />
                      )}

                      <div className="flex items-center gap-3 min-w-0">
                        {/* Classy Squircle Icon Housing */}
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                            isActive
                              ? 'bg-white/20 text-white backdrop-blur-xs'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200/80 dark:group-hover:bg-slate-800 group-hover:text-slate-900 dark:group-hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                        </div>

                        <div className="truncate">
                          <div className={`truncate text-[12.5px] leading-tight ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                            {item.label}
                          </div>
                          {item.shortDesc && (
                            <div
                              className={`text-[10px] truncate leading-tight mt-0.5 ${
                                isActive ? 'text-emerald-100/90 font-normal' : 'text-slate-400 dark:text-slate-500'
                              }`}
                            >
                              {item.shortDesc}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dynamic Refined Badge */}
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold tabular-nums flex-shrink-0 transition-all border ${
                            isActive
                              ? 'bg-emerald-800/90 text-emerald-100 border-emerald-400/40 shadow-xs'
                              : item.badgeType === 'currency'
                              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40'
                              : item.badgeType === 'status'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/40'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Executive Target Card & Real-time Recovery Metric */}
      <div className="p-4 border-t border-slate-200/90 dark:border-slate-800/90 bg-gradient-to-t from-slate-50 to-white dark:from-[#05070a] dark:to-[#07090e] space-y-3">
        
        {/* EBITDA Target Solver Luxury CTA */}
        <button
          id="btn-find-5m-sidebar"
          onClick={() => setTargetSolverOpen(true)}
          className="w-full relative overflow-hidden group p-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/20 ring-1 ring-emerald-400/40 hover:ring-emerald-300 transition-all cursor-pointer"
        >
          {/* Subtle Ambient Shimmer Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider">
                  Target Recovery Solver
                </div>
                <div className="text-xs font-black text-white">
                  Find Me ₹5M EBITDA
                </div>
              </div>
            </div>

            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform flex-shrink-0">
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </button>

        {/* Real-time Financial Ledger Telemetry Gauge */}
        <div className="p-3 bg-white dark:bg-[#0d1017] border border-slate-200/90 dark:border-slate-800/90 rounded-xl shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.16em]">
                YTD Realization
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              ₹{(kpis.recoveredYTD / 1000).toFixed(0)}k <span className="text-slate-400 text-[10px] font-normal">recvd</span>
            </span>
          </div>

          {/* Precision Gradient Progress Bar */}
          <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
              style={{ width: `${recoveryProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {recoveryProgress}% of ₹{(kpis.totalIdentified / 1000000).toFixed(1)}M
            </span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[9px] font-semibold text-slate-600 dark:text-slate-300">
              {kpis.openOpportunities} backlog
            </span>
          </div>
        </div>

        {/* Micro System Footer Note */}
        <div className="flex items-center justify-between px-1 text-[9px] text-slate-400 dark:text-slate-600 font-mono">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>FHIR v4.0 Stream Nominal</span>
          </span>
          <span>Encrypted (256-bit)</span>
        </div>

      </div>
    </aside>
  );
};
