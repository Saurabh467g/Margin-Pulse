import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_OPPORTUNITIES } from './src/data/opportunities';
import {
  DATA_HEALTH_DATASETS,
  CONTRACT_INTELLIGENCE_RECORDS,
  SERVICE_LINES_BREAKDOWN
} from './src/data/datasets';
import { Opportunity, AuditLogEntry, OpportunityStatus } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// Persistent Database Layer (JSON file + In-Memory)
// ==========================================
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DatabaseSchema {
  version: string;
  lastUpdated: string;
  opportunities: Opportunity[];
  auditLogs: AuditLogEntry[];
  simulations: Array<{
    id: string;
    name: string;
    createdAt: string;
    projectedYield: number;
    parameters: Record<string, number>;
  }>;
}

function initializeDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed && Array.isArray(parsed.opportunities) && parsed.opportunities.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.error('Failed to read existing database file, re-initializing...', err);
    }
  }

  // Aggregate initial audit logs from opportunities
  const initialAuditLogs: AuditLogEntry[] = [];
  INITIAL_OPPORTUNITIES.forEach((opp) => {
    opp.auditTrail.forEach((log) => {
      initialAuditLogs.push({
        ...log,
        opportunityId: opp.id,
        opportunityTitle: opp.title
      });
    });
  });

  const initialDb: DatabaseSchema = {
    version: '2.0.0',
    lastUpdated: new Date().toISOString(),
    opportunities: INITIAL_OPPORTUNITIES,
    auditLogs: initialAuditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    simulations: [
      {
        id: 'sim-base-01',
        name: 'Target Base Scenario (FY2026)',
        createdAt: '2026-02-01 10:00',
        projectedYield: 5240000,
        parameters: {
          appealWinRate: 25,
          orOnTimeStart: 78,
          implantCompliance: 80,
          losReductionDays: 0.8,
          biosimilarRate: 65
        }
      }
    ]
  };

  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing initial db file:', err);
  }

  return initialDb;
}

let db = initializeDatabase();

function saveDatabase() {
  try {
    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}

// Gemini AI Client Lazy Initialization
let genAIClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

// ==========================================
// RESTful API Routes
// ==========================================

// 1. Health & Database Diagnostic
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    engine: 'JSON-Persistent-DB v2.0',
    currency: 'INR (₹)',
    totalOpportunities: db.opportunities.length,
    totalAuditLogs: db.auditLogs.length,
    savedSimulations: db.simulations.length,
    lastUpdated: db.lastUpdated,
    serverTime: new Date().toISOString()
  });
});

// 2. Get All Opportunities with Query Filtering
app.get('/api/opportunities', (req, res) => {
  const { category, status, department, search } = req.query;
  let list = db.opportunities;

  if (category && typeof category === 'string' && category !== 'All') {
    list = list.filter((o) => o.category === category);
  }
  if (status && typeof status === 'string' && status !== 'All') {
    list = list.filter((o) => o.status === status);
  }
  if (department && typeof department === 'string' && department !== 'All') {
    list = list.filter((o) => o.department === department);
  }
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    list = list.filter(
      (o) =>
        o.title.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        o.department.toLowerCase().includes(q) ||
        o.rootCause.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: list.length,
    data: list
  });
});

// 3. Get Single Opportunity
app.get('/api/opportunities/:id', (req, res) => {
  const opp = db.opportunities.find((o) => o.id === req.params.id);
  if (!opp) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }
  res.json({ success: true, data: opp });
});

// 4. Update Opportunity Status & Pipeline Stage
app.put('/api/opportunities/:id/status', (req, res) => {
  const { id } = req.params;
  const { newStatus, recoveredAmountDelta, note, actorRole, actorName } = req.body;

  const oppIndex = db.opportunities.findIndex((o) => o.id === id);
  if (oppIndex === -1) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }

  const opp = db.opportunities[oppIndex];
  const prevStatus = opp.status;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const delta = Number(recoveredAmountDelta) || 0;

  const newRecovered =
    newStatus === 'Recovered' && delta === 0 && opp.recoveredAmount === 0
      ? opp.expectedRecovery
      : opp.recoveredAmount + delta;

  const newValueAtRisk = Math.max(0, opp.annualImpact - newRecovered);

  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    actorName: actorName || 'Platform User',
    actorRole: actorRole || 'CFO / Finance',
    action: `Status: ${prevStatus} ➔ ${newStatus}`,
    previousValue: prevStatus,
    newValue: newStatus,
    details:
      note ||
      `Transitioned status to ${newStatus}.${delta > 0 ? ` Logged ₹${delta.toLocaleString()} cash recovered.` : ''}`
  };

  const updatedOpp: Opportunity = {
    ...opp,
    status: newStatus as OpportunityStatus,
    recoveredAmount: newRecovered,
    valueAtRisk: newStatus === 'Recovered' ? 0 : newValueAtRisk,
    lastUpdated: now.substring(0, 10),
    auditTrail: [newLog, ...opp.auditTrail]
  };

  db.opportunities[oppIndex] = updatedOpp;
  db.auditLogs = [
    {
      ...newLog,
      opportunityId: opp.id,
      opportunityTitle: opp.title
    },
    ...db.auditLogs
  ];

  saveDatabase();

  res.json({
    success: true,
    data: updatedOpp,
    auditLog: newLog
  });
});

// 5. Update Opportunity Recovery Amount
app.put('/api/opportunities/:id/recovery', (req, res) => {
  const { id } = req.params;
  const { newTotalRecovered, note, actorRole, actorName } = req.body;

  const oppIndex = db.opportunities.findIndex((o) => o.id === id);
  if (oppIndex === -1) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }

  const opp = db.opportunities[oppIndex];
  const prevRecovered = opp.recoveredAmount;
  const amount = Number(newTotalRecovered) || 0;
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newValueAtRisk = Math.max(0, opp.annualImpact - amount);
  const autoStatus: OpportunityStatus = amount >= opp.annualImpact ? 'Recovered' : opp.status;

  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    actorName: actorName || 'Sign-off Lead',
    actorRole: actorRole || 'CFO / Finance',
    action: 'Recovery Ledger Updated',
    previousValue: `₹${prevRecovered.toLocaleString()}`,
    newValue: `₹${amount.toLocaleString()}`,
    details: note || `Verified recovered cash amount of ₹${amount.toLocaleString()}`
  };

  const updatedOpp: Opportunity = {
    ...opp,
    recoveredAmount: amount,
    valueAtRisk: autoStatus === 'Recovered' ? 0 : newValueAtRisk,
    status: autoStatus,
    lastUpdated: now.substring(0, 10),
    auditTrail: [newLog, ...opp.auditTrail]
  };

  db.opportunities[oppIndex] = updatedOpp;
  db.auditLogs = [
    {
      ...newLog,
      opportunityId: opp.id,
      opportunityTitle: opp.title
    },
    ...db.auditLogs
  ];

  saveDatabase();

  res.json({ success: true, data: updatedOpp, auditLog: newLog });
});

// 6. Update Owner & Role
app.put('/api/opportunities/:id/owner', (req, res) => {
  const { id } = req.params;
  const { newOwner, newRole, actorRole } = req.body;

  const oppIndex = db.opportunities.findIndex((o) => o.id === id);
  if (oppIndex === -1) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }

  const opp = db.opportunities[oppIndex];
  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    actorName: `User (${actorRole || 'Finance'})`,
    actorRole: actorRole || 'CFO / Finance',
    action: 'Reassigned Owner',
    previousValue: opp.owner,
    newValue: newOwner,
    details: `Reassigned accountability to ${newOwner} (${newRole})`
  };

  const updatedOpp: Opportunity = {
    ...opp,
    owner: newOwner,
    ownerRole: newRole,
    lastUpdated: now.substring(0, 10),
    auditTrail: [newLog, ...opp.auditTrail]
  };

  db.opportunities[oppIndex] = updatedOpp;
  db.auditLogs = [
    {
      ...newLog,
      opportunityId: opp.id,
      opportunityTitle: opp.title
    },
    ...db.auditLogs
  ];

  saveDatabase();

  res.json({ success: true, data: updatedOpp });
});

// 7. Batch Update Status
app.post('/api/opportunities/batch-status', (req, res) => {
  const { ids, newStatus, actorRole, actorName } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ success: false, error: 'ids must be an array' });
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
  let updatedCount = 0;

  ids.forEach((id) => {
    const oppIndex = db.opportunities.findIndex((o) => o.id === id);
    if (oppIndex !== -1) {
      const opp = db.opportunities[oppIndex];
      const prevStatus = opp.status;
      const newLog: AuditLogEntry = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        actorName: actorName || 'Batch Workflow Admin',
        actorRole: actorRole || 'CFO / Finance',
        action: `Batch Status: ${prevStatus} ➔ ${newStatus}`,
        previousValue: prevStatus,
        newValue: newStatus,
        details: `Batch transitioned to ${newStatus}`
      };

      db.opportunities[oppIndex] = {
        ...opp,
        status: newStatus as OpportunityStatus,
        lastUpdated: now.substring(0, 10),
        auditTrail: [newLog, ...opp.auditTrail]
      };

      db.auditLogs = [
        {
          ...newLog,
          opportunityId: opp.id,
          opportunityTitle: opp.title
        },
        ...db.auditLogs
      ];
      updatedCount++;
    }
  });

  saveDatabase();

  res.json({ success: true, updatedCount, opportunities: db.opportunities });
});

// 8. Reset to Baseline Data
app.post('/api/opportunities/reset', (req, res) => {
  db = initializeDatabase();
  db.opportunities = INITIAL_OPPORTUNITIES;
  const initialAuditLogs: AuditLogEntry[] = [];
  INITIAL_OPPORTUNITIES.forEach((opp) => {
    opp.auditTrail.forEach((log) => {
      initialAuditLogs.push({
        ...log,
        opportunityId: opp.id,
        opportunityTitle: opp.title
      });
    });
  });
  db.auditLogs = initialAuditLogs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  saveDatabase();
  res.json({ success: true, message: 'Database reset to baseline state', opportunities: db.opportunities });
});

// 9. Audit Logs Endpoint
app.get('/api/audit-logs', (req, res) => {
  res.json({
    success: true,
    count: db.auditLogs.length,
    data: db.auditLogs
  });
});

app.post('/api/audit-logs', (req, res) => {
  const { actorName, actorRole, action, details, opportunityId, opportunityTitle } = req.body;
  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    actorName: actorName || 'System',
    actorRole: actorRole || 'Admin',
    action: action || 'Action Logged',
    details: details || '',
    opportunityId,
    opportunityTitle
  };

  db.auditLogs = [newLog, ...db.auditLogs];
  saveDatabase();
  res.json({ success: true, data: newLog });
});

// 10. Secondary Data Endpoints (Contracts, Datasets, Service Lines)
app.get('/api/contracts', (req, res) => {
  res.json({ success: true, data: CONTRACT_INTELLIGENCE_RECORDS });
});

app.get('/api/datasets', (req, res) => {
  res.json({ success: true, data: DATA_HEALTH_DATASETS });
});

app.get('/api/service-lines', (req, res) => {
  res.json({ success: true, data: SERVICE_LINES_BREAKDOWN });
});

// 11. Saved Simulations Endpoint
app.get('/api/simulations', (req, res) => {
  res.json({ success: true, data: db.simulations });
});

app.post('/api/simulations', (req, res) => {
  const { name, projectedYield, parameters } = req.body;
  const newSim = {
    id: `sim-${Date.now()}`,
    name: name || 'Custom Scenario',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    projectedYield: Number(projectedYield) || 0,
    parameters: parameters || {}
  };
  db.simulations.unshift(newSim);
  saveDatabase();
  res.json({ success: true, data: newSim });
});

// 12. Server-Side AI Analysis (Gemini API with secure server-side API Key)
app.post('/api/ai/analyze-opportunity', async (req, res) => {
  const { opportunityId } = req.body;
  const opp = db.opportunities.find((o) => o.id === opportunityId);

  if (!opp) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }

  const client = getGeminiClient();

  if (!client) {
    // Graceful fallback with deterministic domain intelligence
    return res.json({
      success: true,
      aiGenerated: false,
      analysis: {
        summary: `Strategic analysis for ${opp.title} (${opp.code}) in ${opp.department}.`,
        keyRiskFactor: `Primary leakage driver: ${opp.rootCause}`,
        fastestPathToCash: `Implement "${opp.recommendedAction}" within ${opp.timeToValueWeeks} weeks to unlock ₹${(opp.annualImpact / 12).toLocaleString()} per month.`,
        suggestedKpiGuardrail: `Maintain benchmark threshold from ${opp.evidence[0]?.sourceDataset || 'EHR logs'}.`
      }
    });
  }

  try {
    const prompt = `You are the Chief Medical & Financial Optimization AI for XYZ Hospital.
Analyze this hospital profit leakage opportunity and provide concise, actionable executive recommendations in JSON format.

Opportunity Details:
- Code: ${opp.code}
- Title: ${opp.title}
- Department: ${opp.department}
- Annual Financial Impact: ₹${opp.annualImpact.toLocaleString()}
- Monthly Impact: ₹${opp.monthlyImpact.toLocaleString()}
- Confidence: ${opp.confidence}%
- Severity: ${opp.severity}
- Time to Value: ${opp.timeToValueWeeks} weeks
- Root Cause: ${opp.rootCause}
- Plain English Explanation: ${opp.plainEnglishWhy}
- Current Recommended Action: ${opp.recommendedAction}
- Current Policy Mandate: ${opp.policyChange}

Respond with a JSON object containing:
- summary: A crisp 2-sentence executive summary.
- keyRiskFactor: The primary clinical/operational bottleneck.
- fastestPathToCash: Specific steps to recover cash within 30 days.
- suggestedKpiGuardrail: Measurable metric for ongoing audit monitoring.`;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      aiGenerated: true,
      analysis: parsed
    });
  } catch (err: any) {
    console.error('Gemini AI analysis error:', err);
    return res.json({
      success: true,
      aiGenerated: false,
      fallbackMessage: 'Generated via hospital analytical engine.',
      analysis: {
        summary: `Financial optimization audit for ${opp.title} (${opp.code}).`,
        keyRiskFactor: opp.rootCause,
        fastestPathToCash: opp.recommendedAction,
        suggestedKpiGuardrail: `Audit weekly against ${opp.evidence[0]?.sourceDataset || 'Clearinghouse 837/835 EDI'}`
      }
    });
  }
});

// ==========================================
// Vite Middleware / Static Asset Serving
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MarginPulse Backend & Database Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
