import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandSymbol } from '../common/BrandSymbol';
import { 
  ShieldCheck, 
  Download, 
  Sparkles, 
  Lock, 
  Building2,
  Clock
} from 'lucide-react';
import { ModuleId } from '../../types';

const formatCurrency = (val?: number) => {
  if (typeof val !== 'number' || isNaN(val)) return '₹0';
  return `₹${val.toLocaleString()}`;
};

export const Footer: React.FC = () => {
  const { 
    kpis, 
    activeModule, 
    setActiveModule, 
    setTargetSolverOpen,
    auditLogs
  } = useStore();

  const handleExportAuditTrail = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `xyz_hospital_audit_trail_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleNav = (mod: ModuleId) => {
    setActiveModule(mod);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="mt-12 pt-10 pb-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-black text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-10">
        
        {/* Top Section: Brand & Live Telemetry Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Left Brand Identity (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-900 p-1 flex items-center justify-center shadow-md ring-1 ring-emerald-500/40">
                <BrandSymbol size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">MarginPulse</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100/70 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono">
                    XYZ Hospital
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Hospital Profit Leakage & Recovery Intelligence</div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              Comprehensive hospital financial optimization engine for XYZ Hospital (400-bed facility). Continuously reconciling clinical encounters, supply chains, payer contracts, and theater utilization into verifiable EBITDA recovery.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Facility: XYZ Hospital (400 Beds)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>FY 2026-27 • Live Ledger</span>
              </span>
            </div>
          </div>

          {/* Center: Live Hospital Metrics Bar (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Live Financial Telemetry
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">Identified Leakage</div>
                <div className="text-sm font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(kpis?.totalIdentified)}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">41 opportunities</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/50">
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Realized YTD</div>
                <div className="text-sm font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {formatCurrency(kpis?.recoveredYTD)}
                </div>
                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5 font-semibold">Verified in cash</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setTargetSolverOpen(true)}
                className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Find Me ₹5M</span>
              </button>

              <button
                onClick={handleExportAuditTrail}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Export compliance audit ledger"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          </div>

          {/* Right: Security, Governance & Status (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Governance & Integrity
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  10 Core Feeds Synced (98.7% Integrity)
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  NABH / JCI & HIPAA Compliant
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  Immutable Audit Trail ({auditLogs.length} Events)
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Navigation Map */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3">
              Executive Modules
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('overview')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'overview' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Executive Overview</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('opportunities')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'opportunities' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>All 41 Opportunities</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('actions')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'actions' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Recovery Pipeline (Kanban)</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3">
              Clinical Domains
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('revenue-leakage')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'revenue-leakage' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Revenue Leakage Ledger</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('cost-intelligence')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'cost-intelligence' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Cost Intelligence & Supplies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('capacity-waste')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'capacity-waste' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>OR Capacity & Inpatient Waste</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3">
              Commercial & Strategy
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('contract-intelligence')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'contract-intelligence' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Contract Intelligence</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('service-lines')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'service-lines' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Service Lines Contribution</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('what-if')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'what-if' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>What-If Financial Simulator</span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[10px] mb-3">
              Data & Governance
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNav('data-health')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'data-health' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Data Health & Connectors</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('audit-log')}
                  className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1 ${
                    activeModule === 'audit-log' ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''
                  }`}
                >
                  <span>Hospital Governance & Audit Log</span>
                </button>
              </li>
              <li>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  Schema: DICOM/HL7/FHIR v4.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 dark:text-slate-500">
          <div className="text-center md:text-left leading-relaxed">
            <p>
              <strong>CONFIDENTIAL HOSPITAL GOVERNANCE DOCUMENT:</strong> For authorized XYZ Hospital administrative & clinical department leadership only. Contains protected financial margin modeling and rate renegotiation intelligence.
            </p>
            <p className="mt-1">
              All currency figures expressed in Indian Rupees (INR / ₹) based on verified EHR encounter ledgers and ERP supply invoices.
            </p>
          </div>

          <div className="text-center md:text-right flex-shrink-0">
            <div>© 2026 XYZ Hospital • MarginPulse Intelligence Platform</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-600 font-mono mt-0.5">
              Build v2.4.8-release • Cloud Ingress Protected
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
