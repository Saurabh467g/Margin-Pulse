import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Clock,
  Shield,
  CheckCircle2,
  Calendar,
  User,
  Building,
  DollarSign,
  Layers,
  ArrowUpRight,
  History,
  FileCheck2,
  Lock
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OpportunityStatus, UserRole } from '../../types';

export const OpportunityDetailModal: React.FC = () => {
  const {
    opportunities,
    selectedOpportunityId,
    setSelectedOpportunityId,
    updateOpportunityStatus,
    updateOpportunityOwner,
    updateOpportunityRecovery,
    permissions,
    activeRole
  } = useStore();

  const [customRecoverAmount, setCustomRecoverAmount] = useState<string>('');
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [recoverySuccessNote, setRecoverySuccessNote] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const { analyzeOpportunityWithAI } = useStore();

  const opp = opportunities.find((o) => o.id === selectedOpportunityId);

  if (!opp) return null;

  const handleRunAi = async () => {
    setAiLoading(true);
    try {
      const result = await analyzeOpportunityWithAI(opp.id);
      setAiAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleStatusChange = (newStatus: OpportunityStatus) => {
    if (newStatus === 'Recovered' && !permissions.canApproveRecovery) {
      alert(`Approval restricted: Role '${activeRole}' cannot sign off recoveries. Switch to Admin, CFO, or Revenue Integrity.`);
      return;
    }
    const success = updateOpportunityStatus(opp.id, newStatus);
    if (success) {
      setRecoverySuccessNote(`Status updated to ${newStatus}`);
      setTimeout(() => setRecoverySuccessNote(null), 3000);
    }
  };

  const handleDirectRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customRecoverAmount);
    if (isNaN(amount) || amount < 0) {
      alert('Please enter a valid euro amount.');
      return;
    }
    if (!permissions.canApproveRecovery) {
      alert(`Approval restricted: Role '${activeRole}' cannot approve recovery sums.`);
      return;
    }

    const success = updateOpportunityRecovery(opp.id, amount);
    if (success) {
      setShowRecoveryInput(false);
      setCustomRecoverAmount('');
      setRecoverySuccessNote(`Successfully verified ₹${amount.toLocaleString()} recovered!`);
      setTimeout(() => setRecoverySuccessNote(null), 4000);
    }
  };

  const statusColors: Record<OpportunityStatus, { bg: string; text: string }> = {
    Discovered: { bg: 'bg-slate-100 dark:bg-slate-900', text: 'text-slate-700 dark:text-slate-300' },
    'In Review': { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-400' },
    'In Progress': { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-200' },
    Approved: { bg: 'bg-slate-200/80 dark:bg-slate-800/90', text: 'text-slate-900 dark:text-slate-100' },
    Recovered: { bg: 'bg-emerald-50 dark:bg-emerald-950/60', text: 'text-emerald-700 dark:text-emerald-400' },
    Dismissed: { bg: 'bg-rose-50 dark:bg-rose-950/60', text: 'text-rose-700 dark:text-rose-400' }
  };

  const categoryColors: Record<string, string> = {
    'Revenue Leakage': 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400',
    'Capacity & Waste': 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400',
    'Cost Intelligence': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400',
    'Service Lines': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
  };

  return (
    <div
      id="opportunity-detail-modal"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={() => setSelectedOpportunityId(null)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 dark:bg-emerald-600 text-white">
                {opp.code}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  categoryColors[opp.category] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {opp.category}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  statusColors[opp.status].bg
                } ${statusColors[opp.status].text}`}
              >
                Status: {opp.status}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <Building className="w-3.5 h-3.5" />
                {opp.department}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {opp.title}
            </h2>
          </div>

          <button
            onClick={() => setSelectedOpportunityId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body with the 5-Step Core Questions */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs text-slate-700 dark:text-slate-300">
          {recoverySuccessNote && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{recoverySuccessNote}</span>
            </div>
          )}

          {/* QUESTION 1: WHAT IS WRONG? */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-5 h-5 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                What is Wrong?
              </h3>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
              <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
                {opp.plainEnglishWhy}
              </p>
              <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-4 pt-1">
                <span>
                  <strong className="text-slate-600 dark:text-slate-300">Clinical Lead / Owner:</strong> {opp.owner} ({opp.ownerRole})
                </span>
                <span>
                  <strong className="text-slate-600 dark:text-slate-300">Identified Date:</strong> {opp.createdAt}
                </span>
                <span>
                  <strong className="text-slate-600 dark:text-slate-300">Target Due Date:</strong> {opp.dueDate}
                </span>
              </div>
            </div>
          </section>

          {/* QUESTION 2: HOW MUCH MONEY IS AT RISK? */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-5 h-5 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                How much money is at risk? (Rupees Calculation)
              </h3>
            </div>

            {/* Financial Numbers Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Annual Impact
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                  ₹{opp.annualImpact.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Annualized model</span>
              </div>

              <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
                  Monthly Impact
                </span>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                  ₹{Math.round(opp.monthlyImpact).toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">Monthly run-rate</span>
              </div>

              <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.15em]">
                  Recovered YTD
                </span>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  ₹{opp.recoveredAmount.toLocaleString()}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {opp.annualImpact > 0
                    ? `${((opp.recoveredAmount / opp.annualImpact) * 100).toFixed(0)}% captured`
                    : '0%'}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-[0.15em]">
                  Unresolved Value
                </span>
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
                  ₹{opp.valueAtRisk.toLocaleString()}
                </div>
                <span className="text-[10px] text-rose-500 dark:text-rose-400">Remaining to close</span>
              </div>
            </div>

            {/* Formula Breakdown Box */}
            <div className="p-4 bg-slate-900 dark:bg-slate-950 text-slate-200 rounded-xl space-y-2.5 font-mono text-xs border border-slate-800">
              <div className="flex items-center justify-between text-emerald-400 font-semibold border-b border-slate-800 pb-1.5">
                <span>Deterministic Calculation Model</span>
                <span>Formula</span>
              </div>
              <div className="text-slate-100 font-medium">{opp.calculation.formula}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                {opp.calculation.factors.map((factor, i) => (
                  <div key={i} className="bg-slate-800/80 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400">{factor.name}</div>
                    <div className="text-emerald-300 font-bold text-xs mt-0.5">{factor.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* QUESTION 3: WHY IS IT HAPPENING? */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-5 h-5 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                Why is it happening? (Root Cause Chain & Evidence)
              </h3>
            </div>

            {/* Step-by-step root cause chain */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Root-Cause Cascade:</div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 relative">
                {opp.rootCauseChain.map((step, idx) => (
                  <div
                    key={step.step}
                    className="p-3.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center justify-center font-bold text-[10px]">
                        {step.step}
                      </span>
                      {idx < opp.rootCauseChain.length - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden md:block" />
                      )}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">{step.title}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400 leading-snug">{step.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supporting Evidence Metrics */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Supporting Data Evidence:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {opp.evidence.map((ev, i) => (
                  <div key={i} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700">
                    <div className="text-slate-400 dark:text-slate-400 text-[11px]">{ev.metric}</div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{ev.value}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        Benchmark: {ev.benchmark} ({ev.sourceDataset})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* QUESTION 4: WHAT SHOULD WE DO? */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-5 h-5 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                4
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                What Should We Do? (Action & Policy Recommendation)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Recommended Corrective Action</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{opp.recommendedAction}</p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Clinical / Operating Policy Change</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{opp.policyChange}</p>
              </div>
            </div>

            {/* Server-Side AI Clinical & Financial Audit */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-emerald-600 text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      AI Deep Strategic Diagnostic
                    </span>
                    <span className="ml-2 text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                      Server API
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRunAi}
                  disabled={aiLoading}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-all shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-emerald-100" />
                  <span>{aiLoading ? 'Analyzing...' : 'Run AI Diagnostic'}</span>
                </button>
              </div>

              {aiAnalysis && (
                <div className="p-3.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs animate-in fade-in">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Executive Summary: </span>
                    <span className="text-slate-700 dark:text-slate-300">{aiAnalysis.summary}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded">
                      <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Fastest Path to Cash:</strong>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{aiAnalysis.fastestPathToCash}</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded">
                      <strong className="text-slate-900 dark:text-slate-100 block mb-0.5">Audit KPI Guardrail:</strong>
                      <span className="text-slate-700 dark:text-slate-300">{aiAnalysis.suggestedKpiGuardrail}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Decision Metrics */}
            <div className="grid grid-cols-4 gap-2 pt-1 text-center">
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Confidence</div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono mt-0.5">
                  {opp.confidence}%
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Effort</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{opp.effort}</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Horizon</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{opp.horizon}</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Time-to-Value</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                  {opp.timeToValueWeeks} Weeks
                </div>
              </div>
            </div>
          </section>

          {/* QUESTION 5: WHO OWNS IT — AND DID WE RECOVER IT? */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="w-5 h-5 rounded bg-slate-900 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                5
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                Who Owns It — And Did We Recover It?
              </h3>
            </div>

            {/* Action Bar & Workflow Controls */}
            <div className="p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Workflow:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['Discovered', 'In Review', 'In Progress', 'Approved', 'Recovered'] as OpportunityStatus[]).map(
                      (st) => {
                        const isCurrent = opp.status === st;
                        const isRecoveredBtn = st === 'Recovered';
                        const disabled =
                          !permissions.canAct || (isRecoveredBtn && !permissions.canApproveRecovery);

                        return (
                          <button
                            key={st}
                            disabled={disabled || isCurrent}
                            onClick={() => handleStatusChange(st)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                              isCurrent
                                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500/30'
                                : disabled
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {st}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Direct recovery amount sign-off */}
                {permissions.canApproveRecovery ? (
                  <button
                    onClick={() => setShowRecoveryInput(!showRecoveryInput)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Log / Sign-off Recovery</span>
                  </button>
                ) : (
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Role '{activeRole}' cannot approve recovery</span>
                  </div>
                )}
              </div>

              {/* Recovery input form popup */}
              {showRecoveryInput && permissions.canApproveRecovery && (
                <form
                  onSubmit={handleDirectRecoverySubmit}
                  className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm space-y-2.5 animate-in fade-in"
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    Sign-off Recovered Revenue Amount (INR ₹)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">
                        ₹
                      </span>
                      <input
                        type="number"
                        placeholder={opp.expectedRecovery.toString()}
                        value={customRecoverAmount}
                        onChange={(e) => setCustomRecoverAmount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md pl-7 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all"
                    >
                      Verify & Sign Off
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRecoveryInput(false)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-md cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    Entering ₹{opp.expectedRecovery.toLocaleString()} (expected recovery) or full
                    ₹{opp.annualImpact.toLocaleString()} updates all live KPIs hospital-wide immediately.
                  </div>
                </form>
              )}
            </div>

            {/* Embedded Audit Trail */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Opportunity Audit History ({opp.auditTrail.length} events)</span>
              </div>

              {opp.auditTrail.length === 0 ? (
                <div className="text-xs text-slate-400 dark:text-slate-500 italic p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                  No manual modifications recorded yet.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {opp.auditTrail.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-start justify-between text-[11px]"
                    >
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {log.action} •{' '}
                          <span className="text-slate-400 dark:text-slate-500 font-normal">
                            by {log.actorName} ({log.actorRole})
                          </span>
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 mt-0.5">{log.details}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex-shrink-0 ml-2">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            XYZ Hospital • Opportunity ID: <span className="font-mono text-slate-700 dark:text-slate-300">{opp.id}</span>
          </div>
          <button
            onClick={() => setSelectedOpportunityId(null)}
            className="px-4 py-2 text-xs font-bold bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-md transition-colors cursor-pointer"
          >
            Close Detail
          </button>
        </div>
      </div>
    </div>
  );
};
