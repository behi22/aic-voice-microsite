'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  PhoneIncoming,
  Cpu,
  Settings,
  Network,
  BookOpen,
  ShieldCheck,
  Gauge,
  Code2,
  Sparkles,
  ChevronRight,
  Copy,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * AI Voice Agent – Live Microsite (React)
 *
 * Purpose: An interactive, single‑page showcase for the AIC AI Voice Agent design.
 * Audience: Hiring committee, investors, and engineers. Navigable by role.
 *
 * ⚠️ Theme: The CSS variables below are lifted from alexic.ca's root styles to match brand feel.
 *    Source provided by candidate (attention to detail):
 *    :root {
 *      --primary: #0a0e27;
 *      --secondary: #1a1e3a;
 *      --accent: #00d4ff;
 *      --accent-secondary: #0099ff;
 *      --text-primary: #ffffff;
 *      --text-secondary: #8892b0;
 *      --glow: rgba(0, 212, 255, 0.5);
 *    }
 *
 * Stack alignment: React + TypeScript-ready UI (this file is TS-friendly),
 * Tailwind utility classes, shadcn/ui compatible, lucide-react icons, Recharts for analytics.
 */

const kpiData = [
  { name: 'Week 1', latency: 1.9, containment: 62 },
  { name: 'Week 2', latency: 1.6, containment: 70 },
  { name: 'Week 3', latency: 1.3, containment: 78 },
  { name: 'Week 4', latency: 1.1, containment: 83 },
];

const Section = ({ id, title, icon, children }: any) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <h2 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)]">
        {title}
      </h2>
    </div>
    <div className="bg-[var(--secondary)]/60 backdrop-blur rounded-2xl p-4 md:p-6 shadow-lg shadow-[var(--glow)]/10 ring-1 ring-white/5">
      {children}
    </div>
  </section>
);

const CodeBlock = ({
  language = 'xml',
  code = '',
}: {
  language?: string;
  code: string;
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="overflow-auto text-sm bg-black/50 text-[var(--text-secondary)] p-4 rounded-xl ring-1 ring-white/10">
        <div className="text-[10px] uppercase tracking-wider text-[var(--accent-secondary)] mb-2">
          {language}
        </div>
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg bg-[var(--primary)]/60 hover:bg-[var(--primary)]/80 text-[var(--text-secondary)] ring-1 ring-white/10"
        aria-label="Copy code"
      >
        <Copy className="h-3.5 w-3.5" /> {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
};

const CallFlowSimulator = () => {
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const twiml = useMemo(() => {
    if (level === 'L1')
      return `<Response>\n  <Gather input="speech dtmf" action="/voice/route" timeout="3" hints="reservation,order,hours,menu">\n    <Say>Hi, thanks for calling. Say reservation, order, or question.</Say>\n  </Gather>\n  <Redirect>/voice/route</Redirect>\n</Response>`;
    if (level === 'L2')
      return `<Response>\n  <Connect>\n    <Stream url="wss://orchestrator.aic.ai/stream?tenant=TENANT_ID&session=SESSION_ID"/>\n  </Connect>\n</Response>`;
    return `<Response>\n  <Enqueue waitUrl="/voice/queue">level3_support</Enqueue>\n</Response>`;
  }, [level]);

  const nodeWebhook = `app.post('/voice/inbound', verifyTwilio, async (req, res) => {\n  const number = req.body.To;\n  const tenant = await mapNumberToTenant(number);\n  const flow = await getFlow(tenant);\n  const twiml = new VoiceResponse();\n  if (flow.mode === 'L1_PROMPTS') {\n    const g = twiml.gather({ input: 'speech dtmf', action: '/voice/route', timeout: 3, hints: flow.hints.join(',') });\n    g.say(flow.prompt);\n    twiml.redirect('/voice/route');\n  } else {\n    const c = twiml.connect();\n    c.stream({ url: wssUrl(tenant) });\n  }\n  res.type('text/xml').send(twiml.toString());\n});`;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Sparkles className="h-4 w-4" />
          <span>Select a call flow level to preview implementation.</span>
        </div>
        <div className="flex gap-2">
          {(
            [
              { k: 'L1', label: 'Level 1 – AI Prompts' },
              { k: 'L2', label: 'Level 2 – AI Agent' },
              { k: 'L3', label: 'Level 3 – Human' },
            ] as const
          ).map(({ k, label }) => (
            <button
              key={k}
              onClick={() => setLevel(k)}
              className={`px-3 py-1.5 rounded-xl text-sm ring-1 ring-white/10 ${
                level === k
                  ? 'bg-[var(--accent)]/20 text-[var(--text-primary)]'
                  : 'bg-[var(--secondary)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <CodeBlock language={level === 'L2' ? 'xml' : 'xml'} code={twiml} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Code2 className="h-4 w-4" />
          <span>Node.js webhook for inbound routing</span>
        </div>
        <CodeBlock language="ts" code={nodeWebhook} />
      </div>
    </div>
  );
};

const ArchitectureAscii = () => (
  <CodeBlock
    language="txt"
    code={`PSTN/SIP\n  |\n[Telephony (Twilio/ACS)] --> webhook (TwiML/ACS)\n  |             \\-- streams -->> [Agent Orchestrator: Node.js]\n  |                                      |\n  |                                      |-> RAG / KB (pgvector, Postgres)\n  |                                      |-> Reservations Adapter\n  |                                      |-> Ordering + Payment Link\n  |                                      |-> Notifications (SMS/Email)\n  |                                      \\-> Streaming TTS to caller\n[Queues/TaskRouter] <--- handoff (L3 Human)\n`}
  />
);

const NumberProvisioning = () => (
  <div className="grid md:grid-cols-3 gap-4">
    {[
      {
        title: 'Buy / Port Number',
        body: 'Search & purchase local/toll‑free DID (Twilio/ACS) or port with LOA. Configure CNAM, A2P 10DLC (US), E911 as needed.',
      },
      {
        title: 'Attach Call Flow vX',
        body: 'Map number → tenant call‑flow via TwiML App / ACS routing. Store mapping in Postgres with audit trail.',
      },
      {
        title: 'Secure & Failover',
        body: 'Verify webhook signatures, mTLS optional. Secondary webhook + backup PSTN for resilience; health checks & alerts.',
      },
    ].map((c, i) => (
      <div
        key={i}
        className="p-4 rounded-xl bg-[var(--primary)]/40 ring-1 ring-white/10"
      >
        <h4 className="text-[var(--text-primary)] font-medium mb-2">
          {c.title}
        </h4>
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          {c.body}
        </p>
      </div>
    ))}
  </div>
);

const Analytics = () => (
  <div className="h-60 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={kpiData}
        margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis
          dataKey="name"
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="var(--text-secondary)"
          hide
        />
        <Tooltip
          contentStyle={{
            background: '#020617',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="latency"
          stroke="var(--accent)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="containment"
          stroke="var(--accent-secondary)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const Pill = ({ children }: any) => (
  <span className="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--text-primary)] ring-1 ring-[var(--accent)]/20">
    {children}
  </span>
);

export default function AICVoiceAgentMicrosite() {
  const nav = [
    { id: 'overview', label: 'Overview', icon: <Gauge className="h-4 w-4" /> },
    {
      id: 'callflow',
      label: 'Call Flow',
      icon: <PhoneIncoming className="h-4 w-4" />,
    },
    {
      id: 'architecture',
      label: 'Architecture',
      icon: <Network className="h-4 w-4" />,
    },
    {
      id: 'numbers',
      label: 'Numbers',
      icon: <PhoneCall className="h-4 w-4" />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    { id: 'devex', label: 'Dev & Ops', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(1200px 600px at 10% -10%, var(--secondary) 0%, var(--primary) 40%, #000 90%)',
      }}
    >
      {/* Theme variables lifted from alexic.ca to respect brand aesthetics */}
      <style>{`
        :root {
          --primary: #0a0e27;
          --secondary: #1a1e3a;
          --accent: #00d4ff;
          --accent-secondary: #0099ff;
          --text-primary: #ffffff;
          --text-secondary: #8892b0;
          --glow: rgba(0, 212, 255, 0.5);
        }
        ::selection { background: var(--accent); color: #000; }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-[var(--primary)]/70">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-[var(--accent)]" />
            <span className="text-sm md:text-base text-[var(--text-primary)] font-semibold">
              AIC – AI Voice Agent
            </span>
            <Pill>JD‑aligned: React • Node.js • AWS</Pill>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[var(--text-secondary)] text-sm">
            <Sparkles className="h-4 w-4" /> Built with their brand theme
            variables
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10 grid md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <nav className="hidden md:block sticky top-20 self-start space-y-2">
          {nav.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/5"
            >
              {n.icon}
              <span>{n.label}</span>
              <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </a>
          ))}
        </nav>

        {/* Content */}
        <div className="space-y-10 md:space-y-14">
          <motion.section
            id="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[var(--secondary)]/60 rounded-2xl p-6 ring-1 ring-white/10 shadow-xl shadow-[var(--glow)]/10"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
                  Production‑grade Voice Agent for Restaurants
                </h1>
                <p className="mt-2 text-[var(--text-secondary)]">
                  Multi‑level call experience:{' '}
                  <strong className="text-[var(--text-primary)]">
                    L1 AI prompts
                  </strong>{' '}
                  →{' '}
                  <strong className="text-[var(--text-primary)]">
                    L2 AI agent
                  </strong>{' '}
                  →{' '}
                  <strong className="text-[var(--text-primary)]">
                    L3 human handoff
                  </strong>
                  . Designed for low latency, reliability, and JD‑aligned stack.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Pill>Missed‑call ↓ 60%+</Pill>
                <Pill>Containment 80% (L1+L2)</Pill>
                <Pill>p50 turn &lt; 1.2s</Pill>
              </div>
            </div>
          </motion.section>

          <Section
            id="callflow"
            title="Call Flow – Interactive"
            icon={<PhoneIncoming className="h-5 w-5 text-[var(--accent)]" />}
          >
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <CallFlowSimulator />
              </div>
              <div className="space-y-3">
                <h3 className="text-[var(--text-primary)] font-medium">
                  Why multi‑level?
                </h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  Level‑1 captures intent fast with robust fallbacks; Level‑2
                  handles natural conversation with RAG over menus/policies;
                  Level‑3 guarantees a human when confidence is low or policies
                  require it (e.g., allergy uncertainty).
                </p>
                <ul className="text-[var(--text-secondary)] text-sm list-disc pl-5 space-y-1">
                  <li>Barge‑in, DTMF fallback, recording consent prompts.</li>
                  <li>
                    Handoff includes transcript & intent summary for staff
                    context.
                  </li>
                  <li>
                    Strict mode for reservations/totals; open mode for small
                    talk.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          <Section
            id="architecture"
            title="Architecture"
            icon={<Network className="h-5 w-5 text-[var(--accent)]" />}
          >
            <ArchitectureAscii />
          </Section>

          <Section
            id="numbers"
            title="Phone Numbers – Provisioning & Registration"
            icon={<PhoneCall className="h-5 w-5 text-[var(--accent)]" />}
          >
            <NumberProvisioning />
          </Section>

          <Section
            id="security"
            title="Security & Compliance"
            icon={<ShieldCheck className="h-5 w-5 text-[var(--accent)]" />}
          >
            <ul className="text-[var(--text-secondary)] text-sm space-y-2 list-disc pl-5">
              <li>
                PII minimization, per‑tenant RLS, audit logs. Encrypted
                recordings with retention controls.
              </li>
              <li>
                PCI out‑of‑scope via hosted payment links; no card capture on
                calls.
              </li>
              <li>
                STIR/SHAKEN for outbound; A2P 10DLC where applicable; recording
                consent per jurisdiction.
              </li>
            </ul>
          </Section>

          <Section
            id="devex"
            title="Dev & Ops (JD‑Aligned)"
            icon={<Settings className="h-5 w-5 text-[var(--accent)]" />}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-2">
                  Stack
                </h4>
                <ul className="text-[var(--text-secondary)] text-sm space-y-2 list-disc pl-5">
                  <li>
                    <strong>Frontend:</strong> React + MUI (Next.js
                    deploy‑ready)
                  </li>
                  <li>
                    <strong>Backend:</strong> Node.js (TypeScript) orchestrator;
                    Python workers for ASR/TTS/POS SDKs
                  </li>
                  <li>
                    <strong>Data:</strong> Postgres + pgvector, Redis caches, S3
                    audio
                  </li>
                  <li>
                    <strong>Cloud:</strong> AWS (ECS/EKS, API Gateway/Lambda,
                    Route53, KMS)
                  </li>
                  <li>
                    <strong>CI/CD:</strong> GitHub Actions, Terraform, canary
                    releases
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-2">
                  Live KPIs (sample)
                </h4>
                <Analytics />
              </div>
            </div>
          </Section>

          <footer className="pt-6 text-[var(--text-secondary)] text-xs">
            Theme note: **CSS variables sourced from alexic.ca root** to respect
            brand aesthetic —
            <code className="ml-1">
              --primary #0a0e27 • --secondary #1a1e3a • --accent #00d4ff •
              --accent-secondary #0099ff • --text-primary #ffffff •
              --text-secondary #8892b0 • --glow rgba(0,212,255,0.5)
            </code>
          </footer>
        </div>
      </main>
    </div>
  );
}
