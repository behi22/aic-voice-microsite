# AIC – AI Voice Agent Microsite

An interactive, responsive showcase of a production-grade **AI Voice Agent for Restaurants**:

- **Level 1 → AI IVR Prompts** (FAQs, hours, basic reservations)
- **Level 2 → AI Conversational Agent** (menu Q&A, complex orders, structured reservations)
- **Level 3 → Human Handoff** (context + transcript passed to staff)

This microsite presents the **system design, call flows, data model, APIs, KPIs, risks, and DevOps plan**—aligned with AIC’s stack:
**React + Next.js (TypeScript), Tailwind, Node.js, Python workers, AWS**.

---

## Why this exists

I built this to clearly show end-to-end system thinking for an AI voice agent in the restaurant space: telephony entry points, multi-level routing (L1/L2/L3), real-time speech, AI orchestration, data storage, security, and a pragmatic rollout plan. It’s designed so different audiences (engineering, product, or investors) can jump straight to what they care about.

---

## What’s inside (sections on the site)

- **Overview** — high-level goals and simple explanation
- **Jump to a Section** — quick navigation tiles (desktop + mobile)
- **Goals & KPIs** — MVP goals and live KPI chart
- **Call Flows (Interactive)** — L1/L2/L3 simulator with TwiML + Node code
- **Architecture** — caller → provider → orchestrator → tools → handoff
- **Phone Numbers** — how numbers are bought/ported and connected to flows
- **Admin Wizard (Mock)** — how a restaurant onboards in minutes
- **Prompt Catalog (Mock)** — versioned L1 prompts with examples
- **Data Model** — core entities and storage approach
- **APIs** — endpoints the phone + agent call
- **Demo API** — try a reservation payload (simulated)
- **Security** — data & telephony controls
- **Dev & Ops** — stack, deployment, observability, SLOs
- **Timeline** — 6-week plan to reach a pilot
- **Risks & Mitigations** — what can go wrong and how we handle it
- **AI CLI Tools (Bonus)** — quick CLIs I actually use in daily dev flows

> “Risks” and “AI CLI Tools” are also included in the **Jump to a Section** panel so stakeholders can find them quickly.

---

## Brand & Theme

Styled using **CSS variables sourced from [alexic.ca](https://alexic.ca)** (hoping to show attention to detail, consistent look & feel!):

```css
:root {
  --primary: #0a0e27;
  --secondary: #1a1e3a;
  --accent: #00d4ff;
  --accent-secondary: #0099ff;
  --text-primary: #ffffff;
  --text-secondary: #8892b0;
  --glow: rgba(0, 212, 255, 0.5);
}
```
