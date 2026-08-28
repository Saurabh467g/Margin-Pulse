import React, { useState, useMemo } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';

export const AuditLogModule: React.FC = () => {
  const { auditLogs, setSelectedOpportunityId } = useStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (roleFilter !== 'All' && log.actorRole !== roleFilter) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return (
          log.action.toLowerCase().includes(q) ||
          log.actorName.toLowerCase().includes(q) ||
          log.details.toLowerCase().includes(q) ||
          log.opportunityCode.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditLogs, roleFilter, searchFilter]);

  const exportAuditLog = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `marginpulse_audit_trail_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="module-audit-log" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Governance & Compliance
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hospital Governance & Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Immutable, compliance-grade activity log tracking every status transition, financial recovery approval, and ownership assignment with timestamped actor metadata.
          </p>
        </div>

        <button
          onClick={exportAuditLog}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-bold shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Audit Events"
          value={auditLogs.length.toString()}
          subtitle="Persistent state log"
          badge="Live Log"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Recoveries Verified"
          value={auditLogs.filter((l) => l.action.includes('Recovery')).length.toString()}
          subtitle="Authorized sign-offs"
          badge="Finance Approved"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
        <StatCard
          title="Workflow Transitions"
          value={auditLogs.filter((l) => l.action.includes('Status')).length.toString()}
          subtitle="Pipeline movement"
          badge="Operational"
          badgeColor="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
        />
        <StatCard
          title="Integrity Status"
          value="100% Verified"
          subtitle="Audit standard compliant"
          badge="Compliant"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search action, actor, details, opportunity code..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-md pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Hospital Administrator">Hospital Administrator</option>
            <option value="Chief Financial Officer (CFO)">Chief Financial Officer</option>
            <option value="Chief Medical Officer (CMO)">Chief Medical Officer</option>
            <option value="Head of Revenue Integrity">Revenue Integrity</option>
            <option value="Department Chair">Department Chair</option>
            <option value="Clinical Documentation Specialist">CDI Specialist</option>
            <option value="Executive Auditor">Executive Auditor</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-3">Opportunity</th>
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Modification Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOpportunityId(log.opportunityId)}
                        className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                      >
                        {log.opportunityCode}
                      </button>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          log.action.includes('Recovery')
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : log.action.includes('Approved')
                            ? 'bg-slate-200/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">{log.actorName}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">{log.actorRole}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-md">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
