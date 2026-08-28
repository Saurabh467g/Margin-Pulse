import { DataSourceDataset } from '../types';

export const DATA_HEALTH_DATASETS: DataSourceDataset[] = [
  {
    id: 'ds-patients',
    name: 'Patients & Demographics Master',
    records: 2500,
    system: 'Epic EHR / ADT Feeds',
    completeness: 99.4,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 18, warnings: 1, failed: 0, rulesEvaluated: 19 }
  },
  {
    id: 'ds-encounters',
    name: 'Inpatient & Ambulatory Encounters',
    records: 2500,
    system: 'Epic EHR / Cerner Core',
    completeness: 98.8,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 24, warnings: 2, failed: 0, rulesEvaluated: 26 }
  },
  {
    id: 'ds-procedures',
    name: 'Surgical & Procedural Records',
    records: 2500,
    system: 'OR Master / Cath Lab Logs',
    completeness: 97.9,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 22, warnings: 3, failed: 0, rulesEvaluated: 25 }
  },
  {
    id: 'ds-claims',
    name: 'Payer Claims, Remittances & Denials',
    records: 2500,
    system: 'Clearinghouse 837/835 EDI Stream',
    completeness: 96.5,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 31, warnings: 4, failed: 0, rulesEvaluated: 35 }
  },
  {
    id: 'ds-capacity',
    name: 'Capacity, Bed Census & OR Schedules',
    records: 1800,
    system: 'Real-time Locating System (RTLS) & Cerner BedBoard',
    completeness: 95.2,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 15, warnings: 2, failed: 0, rulesEvaluated: 17 }
  },
  {
    id: 'ds-staffing',
    name: 'Staffing Rosters & Agency Nursing Timesheets',
    records: 600,
    system: 'Workday HR / Kronos Timekeeper',
    completeness: 94.1,
    status: 'Warning',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 12, warnings: 3, failed: 1, rulesEvaluated: 16 }
  },
  {
    id: 'ds-inventory',
    name: 'Supply Chain & Pharmacy Inventory',
    records: 500,
    system: 'SAP S/4HANA Materials Management',
    completeness: 98.2,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 19, warnings: 1, failed: 0, rulesEvaluated: 20 }
  },
  {
    id: 'ds-contracts',
    name: 'Commercial Payer & Vendor Fee Schedules',
    records: 30,
    system: 'Coupa / Contract Lifecycle Manager',
    completeness: 100.0,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 14, warnings: 0, failed: 0, rulesEvaluated: 14 }
  },
  {
    id: 'ds-service-lines',
    name: 'Service Line Financial Ledger & Cost Allocations',
    records: 45,
    system: 'Oracle Hyperion / Financial GL',
    completeness: 99.1,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 16, warnings: 1, failed: 0, rulesEvaluated: 17 }
  },
  {
    id: 'ds-supplies',
    name: 'High-Cost Implants & Surgical Consumables',
    records: 800,
    system: 'Pyxis / Omnicell Surgical Tissue Vaults',
    completeness: 97.6,
    status: 'Healthy',
    lastSync: '2026-06-30 23:59:00',
    dataQualityChecks: { passed: 20, warnings: 2, failed: 0, rulesEvaluated: 22 }
  }
];

export const CONTRACT_INTELLIGENCE_RECORDS = [
  {
    id: 'cnt-01',
    party: 'Aevita Health Mutual',
    type: 'Payer Contract',
    annualSpendOrRevenue: '₹8,450,000',
    status: 'Renegotiation Needed',
    leverageScore: 82,
    renewalDate: '2026-09-30',
    daysToExpiry: 34,
    anomaly: 'Medical Inflation clause locked at 1.8% vs current 4.6% CPI; missing robotic surgery carve-out tier.',
    action: 'Trigger Article 14.2 rate review demanding 4.2% base uplift and separate implant carve-out schedule.'
  },
  {
    id: 'cnt-02',
    party: 'Helvetia Care Premier',
    type: 'Payer Contract',
    annualSpendOrRevenue: '₹6,120,000',
    status: 'Active / Favorable',
    leverageScore: 68,
    renewalDate: '2027-03-31',
    daysToExpiry: 216,
    anomaly: 'High denial rate (11.2%) on post-acute rehab transfers due to outdated prior authorization window (24h vs 72h).',
    action: 'Submit protocol addendum aligning authorization turnarounds with national standard.'
  },
  {
    id: 'cnt-03',
    party: 'Stryker & Zimmer Spine Formulary',
    type: 'Vendor Contract',
    annualSpendOrRevenue: '₹2,350,000',
    status: 'Volume Threshold Exceeded',
    leverageScore: 94,
    renewalDate: '2026-11-15',
    daysToExpiry: 80,
    anomaly: 'Volume tier 3 (+12% rebate) reached in May 2026 but uncollected; manual rebate claim required.',
    action: 'Issue retroactive credit note demand for ₹142,000 and lock dual-vendor single price cap.'
  },
  {
    id: 'cnt-04',
    party: 'Medtronic Biologics & Cath Lab',
    type: 'Vendor Contract',
    annualSpendOrRevenue: '₹3,180,000',
    status: 'Renegotiation Needed',
    leverageScore: 88,
    renewalDate: '2026-10-31',
    daysToExpiry: 65,
    anomaly: 'Cryo-ablation catheter priced 34% above peer regional consortium benchmarks.',
    action: 'Initiate competitive RFP with Biosense Webster to force 25% price reduction.'
  },
  {
    id: 'cnt-05',
    party: 'SoluStaff Nursing Emergency Agency',
    type: 'Vendor Contract',
    annualSpendOrRevenue: '₹1,480,000',
    status: 'Penalty Enforceable',
    leverageScore: 76,
    renewalDate: '2026-12-31',
    daysToExpiry: 126,
    anomaly: 'SLA breach: 18% of booked shifts canceled with <4h notice without contractual 15% discount credit.',
    action: 'Enforce ₹48,500 contract deduction and cap maximum billable overtime rates.'
  }
];

export const SERVICE_LINES_BREAKDOWN = [
  {
    name: 'Cardiology & Vascular',
    headOfDept: 'Dr. Julian Sterling',
    annualRevenue: 8450000,
    directCost: 5915000,
    contributionMargin: 2535000,
    marginPercent: 30.0,
    cases: 1420,
    marginPerCase: 1785,
    trend: '+4.2%',
    leakageIdentified: 472760,
    status: 'High Performer'
  },
  {
    name: 'Orthopedics & Spine',
    headOfDept: 'Dr. Clara Vance',
    annualRevenue: 7890000,
    directCost: 5760000,
    contributionMargin: 2130000,
    marginPercent: 27.0,
    cases: 980,
    marginPerCase: 2173,
    trend: '+1.5%',
    leakageIdentified: 1189800,
    status: 'High Variance'
  },
  {
    name: 'General & Colorectal Surgery',
    headOfDept: 'Dr. Clara Vance',
    annualRevenue: 5420000,
    directCost: 4227600,
    contributionMargin: 1192400,
    marginPercent: 22.0,
    cases: 1350,
    marginPerCase: 883,
    trend: '-2.1%',
    leakageIdentified: 412800,
    status: 'Optimizable'
  },
  {
    name: 'Oncology & Infusion',
    headOfDept: 'Dr. Aris Thorne',
    annualRevenue: 4950000,
    directCost: 4059000,
    contributionMargin: 891000,
    marginPercent: 18.0,
    cases: 2150,
    marginPerCase: 414,
    trend: '+6.8%',
    leakageIdentified: 507000,
    status: 'Optimizable'
  },
  {
    name: 'Internal Medicine & Geriatrics',
    headOfDept: 'Dr. Henrik Lind',
    annualRevenue: 3820000,
    directCost: 3361600,
    contributionMargin: 458400,
    marginPercent: 12.0,
    cases: 1680,
    marginPerCase: 273,
    trend: '-4.8%',
    leakageIdentified: 1011600,
    status: 'At Risk (LOS Drag)'
  },
  {
    name: 'Maternity & Obstetrics',
    headOfDept: 'Dr. Marie Laurent',
    annualRevenue: 1660948,
    directCost: 1478244,
    contributionMargin: 182704,
    marginPercent: 11.0,
    cases: 940,
    marginPerCase: 194,
    trend: '-1.2%',
    leakageIdentified: 226800,
    status: 'Margin Evasion'
  }
];
