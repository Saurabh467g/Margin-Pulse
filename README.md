# 🩺 MarginPulse — Hospital Profit Leakage & Recovery Intelligence

> **Enterprise-Grade Hospital Financial Optimization Platform for XYZ Hospital (400-Bed Facility)**  
> Real-time clinical encounter reconciliation, supply chain cost intelligence, payer contract renegotiation, and OR capacity recovery into verifiable EBITDA.

---

## 📋 Executive Overview

**MarginPulse** is a specialized financial intelligence platform engineered for tertiary and multi-specialty hospitals. By bridging clinical documentation (EHR), inventory supply chains (ERP), payer remittance adjudication, and theater scheduling, MarginPulse continuously identifies, prioritizes, and guides the recovery of uncaptured hospital margins.

### 🌟 Key Highlights

- **41 Modeled Leakage & Opportunity Vectors** across 4 clinical domains.
- **₹18.4M+ Identified Annual Leakage** mapped down to individual DRGs, implants, and surgeon workflows.
- **AI Executive Action Briefings**: Dynamic root cause diagnosis, immediate recovery playbooks, and negotiation scripts powered by Gemini models.
- **Target EBITDA Solver ("Find Me ₹5M")**: Knapsack algorithmic optimization to achieve target EBITDA milestones with the fewest clinical disruptions.
- **What-If Scenario Simulator**: Real-time modeling of denial appeal win rates, OR first-case on-time starts, implant standardization compliance, and ALOS reductions.
- **NABH / JCI & HIPAA Governance**: Real-time pipeline audit trail with exportable governance ledgers.

---

## 🏗️ Architectural Topology

MarginPulse is architected as a full-stack, cloud-native application:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Application                            │
│           (React 18 + Vite + Tailwind CSS + Lucide Icons)              │
│                                                                        │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │ Executive Dashboard  │ │ Clinical Leakage Map │ │ What-If Engine │ │
│  └──────────────────────┘ └──────────────────────┘ └────────────────┘ │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ HTTP / JSON API
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Full-Stack Express API Server                       │
│                     (Node.js + TypeScript + ESM)                       │
│                                                                        │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────┐ │
│  │ 11 Analytic Modules  │ │  Knapsack Optimizer  │ │ AI Strategy AI │ │
│  └──────────────────────┘ └──────────────────────┘ └────────────────┘ │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                     Connected Systems & AI Engine                      │
│                                                                        │
│   [EHR Feeds]   [ERP Supplies]   [Payer Claims]   [Gemini API]        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Core Functional Modules

| Module | Purpose | Key Metrics & Features |
| :--- | :--- | :--- |
| **01. Executive Command** | C-Suite & CFO P&L overview | Realized YTD, EBITDA risk, opportunity backlog, department heatmap |
| **02. Opportunity Backlog** | Master registry of all 41 opportunities | Search, domain filters, status progression, value ranking |
| **03. Revenue Leakage** | Clinical revenue cycle & billing | CDI uncaptured severity, unbilled consumables, denial appeals |
| **04. Cost Intelligence** | Non-salary surgical supply & pharma spend | Knee/hip implant price variance, biosimilar conversion, vendor rebates |
| **05. Contract Intelligence** | Commercial payer renegotiations | Under-reimbursed ICU stop-loss, carve-out implants, payer power index |
| **06. Capacity & Waste** | Theater & bed throughput optimization | OR idle turnover, post-op ALOS reduction, PACU boarding delays |
| **07. Service Line Margins** | Direct contribution by specialty | Cardiology, Orthopedics, Oncology, Neuro margin-per-case analysis |
| **08. What-If Simulator** | Dynamic policy & operational forecasting | Interactive sliders with instant annual & monthly P&L projection |
| **09. Recovery Pipeline** | Operational execution Kanban | Discovered → In Review → In Progress → Approved → Recovered |
| **10. Data Health & Feeds** | Interoperability & feed telemetry | 10 core connectors, FHIR v4.0 pipeline status, data latency |
| **11. Audit & Governance** | Hospital compliance & change ledger | Immutable timestamped audit entries, JSON/CSV ledger export |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React icons
- **Backend**: Express.js REST API with Vite middleware integration
- **AI Engine**: Google Gen AI SDK (`@google/genai`) for executive clinical optimization strategy
- **Packaging & Build**: Vite, `esbuild`, `tsx`
- **Data Standard**: Indian Rupee (`INR / ₹`) formatted clinical ledger models, FHIR v4.0 schema compatibility

---

## 📦 Getting Started & Local Development

### Prerequisites

- Node.js (v18.0 or higher)
- npm or yarn

### 1. Installation

Clone or export the project repository and install dependencies:

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set your optional Gemini API key for live AI executive strategy recommendations:

```env
# Server-side Gemini API key for hospital strategy analysis
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: The application includes full deterministic fallback intelligence if an API key is not supplied).*

### 3. Development Server

Start the full-stack development server:

```bash
npm run dev
```

The application will be accessible at: `http://localhost:3000`

---

## 🚢 Production Deployment Guide

MarginPulse is pre-configured and verified for containerized production deployment (e.g., Google Cloud Run, AWS ECS, Docker, or bare metal).

### 1. Build the Production Artifacts

Run the multi-stage compilation script:

```bash
npm run build
```

This single command:
1. Compiles and minifies the client SPA assets into `/dist`.
2. Bundles the TypeScript backend into a self-contained CommonJS artifact: `/dist/server.cjs`.

### 2. Start the Production Server

```bash
npm start
```

This executes `node dist/server.cjs`, binding to `0.0.0.0:3000` and serving both the API routes and static client assets.

---

## 🔒 Security, Compliance & Data Governance

- **Tenant Isolation**: Pre-configured for single or multi-tenant hospital deployments.
- **Client-Safe API Architecture**: All sensitive operations and AI keys execute server-side; credentials are never exposed in browser bundles.
- **Audit Logging**: Every status transition, financial recovery verification, and strategy modification is recorded with user attribution and timestamps.
- **Regulatory Alignment**: Designed to assist NABH / JCI financial governance documentation and HIPAA patient safety confidentiality.

---

## 📄 License & Attribution

© 2026 XYZ Hospital • MarginPulse Intelligence Platform.  
Built for hospital administration and clinical department leadership.
