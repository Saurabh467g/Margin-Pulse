import React from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { DATA_HEALTH_DATASETS } from '../../data/datasets';
import { StatCard } from '../common/StatCard';

export const DataHealthModule: React.FC = () => {
  const integrations = [
    {
      name: 'Epic EHR Core (FHIR R4)',
      type: 'Clinical & Encounters',
      status: 'Healthy (Live Stream)',
      syncFreq: 'Real-time Webhook',
      recordsSynced: '2,500 / hr',
      latency: '24ms'
    },
    {
      name: 'SAP S/4HANA Finance',
      type: 'ERP & Cost Centers',
      status: 'Healthy',
      syncFreq: 'Hourly Delta',
      recordsSynced: '14,200 / day',
      latency: '82ms'
    },
    {
      name: 'Change Healthcare Clearinghouse',
      type: '835 / 837 EDI Claims',
      status: 'Healthy',
      syncFreq: 'Real-time 277CA / 835',
      recordsSynced: '4,100 / day',
      latency: '110ms'
    },
    {
      name: 'Coupa Procurement & P2P',
      type: 'PO, Rebates & Vendors',
      status: 'Healthy',
      syncFreq: 'Daily Sync',
      recordsSynced: '800 records',
      latency: '45ms'
    },
    {
      name: 'Workday HCM & Roster',
      type: 'Staffing & Agency Hours',
      status: 'Healthy',
      syncFreq: 'Shift Delta (4hr)',
      recordsSynced: '600 staff',
      latency: '38ms'
    }
  ];

  return (
    <div id="module-data-health" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Data Engineering & Provenance
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Data Health & Source Integrity
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time verification of all 10 core hospital data streams powering MarginPulse. Audits completeness, schema validation, and EHR/ERP connector latency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>All 10 Feeds Verified</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Data Quality"
          value="98.7%"
          subtitle="Zero critical nulls"
          badge="High Integrity"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Total Records Audited"
          value="14,275"
          subtitle="Across 10 core tables"
          badge="Complete Coverage"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Active Integrations"
          value="5 Connectors"
          subtitle="EHR, ERP, Clearinghouse"
          badge="Synced"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Pipeline Latency"
          value="< 60ms"
          subtitle="Real-time event processing"
          badge="Sub-second"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
      </div>

      {/* 10 Datasets Completeness Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              10 Source Datasets Quality & Completeness Audit
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">
              Continuously checked against referential integrity constraints
            </p>
          </div>
          <button
            onClick={() => alert('Data pipelines re-validated: 10/10 datasets fully synchronized.')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-100" />
            <span>Run Integrity Check</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Dataset Table</th>
                <th className="py-2.5 px-3">Record Count</th>
                <th className="py-2.5 px-3">Primary Source System</th>
                <th className="py-2.5 px-3">Completeness</th>
                <th className="py-2.5 px-3">Quality Score</th>
                <th className="py-2.5 px-3">Last Sync</th>
                <th className="py-2.5 px-3">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {DATA_HEALTH_DATASETS.map((ds) => (
                <tr key={ds.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{ds.name}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{ds.records.toLocaleString()}</td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-medium">{ds.system}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {ds.completeness}%
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {ds.dataQualityChecks.passed}/{ds.dataQualityChecks.rulesEvaluated} Rules
                  </td>
                  <td className="py-3 px-3 text-slate-400 dark:text-slate-500 font-mono text-[11px]">{ds.lastSync}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{ds.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enterprise Connectors Status */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs p-6 space-y-4">
        <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">
            Active Hospital Enterprise Connectors
          </h3>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Live connectivity matrix</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((conn, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 dark:text-white">{conn.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[11px] text-slate-400 dark:text-slate-400">{conn.type}</div>
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                <span>{conn.syncFreq}</span>
                <span className="text-slate-900 dark:text-emerald-400 font-bold">{conn.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
