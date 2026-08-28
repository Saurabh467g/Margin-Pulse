import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StatCard } from '../common/StatCard';

export const WhatIfSimulatorModule: React.FC = () => {
  const { kpis, setTargetSolverOpen } = useStore();

  // 5 Interactive Sliders with realistic hospital levers
  const [appealWinRate, setAppealWinRate] = useState<number>(15); // +% win rate
  const [orOnTimeStart, setOrOnTimeStart] = useState<number>(75); // % on-time (baseline 44.8%)
  const [implantCompliance, setImplantCompliance] = useState<number>(70); // % standard formulary compliance
  const [losReductionDays, setLosReductionDays] = useState<number>(1.0); // days saved
  const [biosimilarRate, setBiosimilarRate] = useState<number>(65); // % biosimilar (baseline 32.1%)

  // Preset scenarios
  const applyPreset = (preset: 'conservative' | 'base' | 'aggressive') => {
    if (preset === 'conservative') {
      setAppealWinRate(8);
      setOrOnTimeStart(60);
      setImplantCompliance(50);
      setLosReductionDays(0.5);
      setBiosimilarRate(50);
    } else if (preset === 'base') {
      setAppealWinRate(18);
      setOrOnTimeStart(80);
      setImplantCompliance(75);
      setLosReductionDays(1.2);
      setBiosimilarRate(75);
    } else {
      setAppealWinRate(30);
      setOrOnTimeStart(92);
      setImplantCompliance(95);
      setLosReductionDays(1.8);
      setBiosimilarRate(92);
    }
  };

  // Live simulation financial model
  const simulationResults = useMemo(() => {
    // 1. Appeal gains: ~₹1.2M total denial pool * appealWinRate%
    const appealGain = 1200000 * (appealWinRate / 100);

    // 2. OR start improvements: ₹1,014,000 * ((orOnTimeStart - 44.8) / 40.2)
    const orGain = Math.max(0, 1014000 * ((orOnTimeStart - 44.8) / 40.2));

    // 3. Implant standardization: ₹670,800 * (implantCompliance / 100)
    const implantGain = 670800 * (implantCompliance / 100);

    // 4. LOS Bed Day savings: 2,900 days * ₹288.83 * (losReductionDays / 1.8)
    const losGain = Math.min(837600, 837600 * (losReductionDays / 1.8));

    // 5. Biosimilar conversion: ₹271,200 * ((biosimilarRate - 32.1) / 52.9)
    const biosimilarGain = Math.max(0, 271200 * ((biosimilarRate - 32.1) / 52.9));

    const totalProjectedAnnual = Math.round(
      appealGain + orGain + implantGain + losGain + biosimilarGain
    );
    const totalProjectedMonthly = Math.round(totalProjectedAnnual / 12);
    const percentOfIdentified = Math.min(
      100,
      Number(((totalProjectedAnnual / kpis.totalIdentified) * 100).toFixed(1))
    );

    return {
      appealGain: Math.round(appealGain),
      orGain: Math.round(orGain),
      implantGain: Math.round(implantGain),
      losGain: Math.round(losGain),
      biosimilarGain: Math.round(biosimilarGain),
      totalProjectedAnnual,
      totalProjectedMonthly,
      percentOfIdentified
    };
  }, [appealWinRate, orOnTimeStart, implantCompliance, losReductionDays, biosimilarRate, kpis.totalIdentified]);

  return (
    <div id="module-what-if" className="space-y-6">
      {/* Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">
            Financial Impact Modeling
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            What-If Financial Impact Simulator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Model the exact financial return of proposed clinical and operational interventions before committing resources. Adjust key management levers to project cashflow impact.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider">Presets:</span>
          <button
            onClick={() => applyPreset('conservative')}
            className="px-3 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            Conservative
          </button>
          <button
            onClick={() => applyPreset('base')}
            className="px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
          >
            Target Base
          </button>
          <button
            onClick={() => applyPreset('aggressive')}
            className="px-3 py-1.5 text-xs font-bold rounded-md bg-emerald-600 text-white hover:bg-emerald-500 transition-all cursor-pointer shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Aggressive
          </button>
        </div>
      </div>

      {/* Headline Simulation Results Display */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xs border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Projected Annual Profit Uplift
          </span>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight mt-1">
            ₹{simulationResults.totalProjectedAnnual.toLocaleString()} / year
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Represents <strong className="text-white">{simulationResults.percentOfIdentified}%</strong> of total ₹9.61M identified profit leakage recovered into operating income.
          </p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Monthly Cashflow Boost
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            +₹{simulationResults.totalProjectedMonthly.toLocaleString()} / mo
          </div>
          <span className="text-[10px] text-slate-500">Recurring cashflow recovery</span>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-slate-800 md:pl-6 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            Break-Even Payback
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            &lt; 5.2 Weeks
          </div>
          <span className="text-[10px] text-slate-500">Net of implementation effort</span>
        </div>
      </div>

      {/* Interactive Controls & Financial Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5 Interventions Sliders (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Intervention Lever Parameters
            </h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Dynamic sensitivity modeling</p>
          </div>

          {/* 1. Denial Appeals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                1. Claim Denial Appeal Win Rate Improvement
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                +{appealWinRate}% win rate (+₹{simulationResults.appealGain.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={35}
              step={1}
              value={appealWinRate}
              onChange={(e) => setAppealWinRate(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Baseline: Current standard appeals</span>
              <span>+35% aggressive clinical response</span>
            </div>
          </div>

          {/* 2. OR Start Compliance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                2. Operating Suite First-Case On-Time Start Compliance
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {orOnTimeStart}% on-time (+₹{simulationResults.orGain.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={45}
              max={95}
              step={1}
              value={orOnTimeStart}
              onChange={(e) => setOrOnTimeStart(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Baseline: 44.8% (34m delay)</span>
              <span>95% Top-Decile Performance</span>
            </div>
          </div>

          {/* 3. Implant Formulary Compliance */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                3. Surgeon Implant Price Parity & Formulary Cap
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {implantCompliance}% compliance (+₹{simulationResults.implantGain.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={implantCompliance}
              onChange={(e) => setImplantCompliance(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Baseline: Uncapped Brand Choice</span>
              <span>100% Dual-Vendor Cap (₹2,150)</span>
            </div>
          </div>

          {/* 4. Post-Acute Length of Stay Reduction */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                4. Inpatient Post-Acute Length of Stay (LOS) Trimming
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                -{losReductionDays.toFixed(1)} Days (+₹{simulationResults.losGain.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2.0}
              step={0.1}
              value={losReductionDays}
              onChange={(e) => setLosReductionDays(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Baseline: +1.8 excess days</span>
              <span>-2.0 Days (Eliminate discharge lag)</span>
            </div>
          </div>

          {/* 5. Biosimilar Conversion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                5. High-Cost Biologic Biosimilar Conversion
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {biosimilarRate}% adoption (+₹{simulationResults.biosimilarGain.toLocaleString()})
              </span>
            </div>
            <input
              type="range"
              min={32}
              max={95}
              step={1}
              value={biosimilarRate}
              onChange={(e) => setBiosimilarRate(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500">
              <span>Baseline: 32.1% penetration</span>
              <span>95% Mandatory P&T Switch</span>
            </div>
          </div>
        </div>

        {/* Right: Gain Waterfall Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Projected Annual Yield Breakdown
              </h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mt-0.5">Component contributions</p>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {[
                {
                  label: 'Denial Appeals Acceleration',
                  amount: simulationResults.appealGain,
                  color: 'bg-emerald-700',
                  textColor: 'text-slate-900 dark:text-white'
                },
                {
                  label: 'OR First-Case Start Optimization',
                  amount: simulationResults.orGain,
                  color: 'bg-emerald-600',
                  textColor: 'text-slate-900 dark:text-white'
                },
                {
                  label: 'Implant Price Cap Parity',
                  amount: simulationResults.implantGain,
                  color: 'bg-emerald-500',
                  textColor: 'text-slate-900 dark:text-white'
                },
                {
                  label: 'Inpatient LOS Trimming',
                  amount: simulationResults.losGain,
                  color: 'bg-teal-500',
                  textColor: 'text-slate-900 dark:text-white'
                },
                {
                  label: 'Biosimilar Formulary Interchange',
                  amount: simulationResults.biosimilarGain,
                  color: 'bg-emerald-400',
                  textColor: 'text-emerald-700 dark:text-emerald-400'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.label}</span>
                    <span className={`font-mono font-bold ${item.textColor}`}>
                      ₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${Math.min(
                          100,
                          (item.amount / (simulationResults.totalProjectedAnnual || 1)) * 100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setTargetSolverOpen(true)}
            className="w-full py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm ring-1 ring-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer transition-all mt-4"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Map Simulation to 41 Opportunities</span>
          </button>
        </div>
      </div>
    </div>
  );
};
