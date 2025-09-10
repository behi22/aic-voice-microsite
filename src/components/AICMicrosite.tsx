'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  PhoneIncoming,
  Cpu,
  Settings,
  Network,
  ShieldCheck,
  Gauge,
  Code2,
  Sparkles,
  Database,
  ListChecks,
  GitBranch,
  AlertTriangle,
  ClipboardList,
  ServerCog,
  Wand2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  TerminalSquare,
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
 * AIC – AI Voice Agent Microsite
 * Responsive, clear, and detailed demo for an AI voice agent in restaurants.
 * Brand colors are provided by CSS variables (globals.css).
 */

const kpiData = [
  { name: 'Week 1', latency: 1.9, containment: 62 },
  { name: 'Week 2', latency: 1.6, containment: 70 },
  { name: 'Week 3', latency: 1.3, containment: 78 },
  { name: 'Week 4', latency: 1.1, containment: 83 },
];

/* ---------- Small UI helpers ---------- */

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="container">{children}</div>
);

const Section = ({
  id,
  title,
  icon,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24">
    <div className="flex flex-col gap-1 mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
          {subtitle}
        </p>
      ) : null}
    </div>
    <div className="min-w-0 bg-[var(--secondary)]/60 backdrop-blur rounded-2xl p-5 md:p-7 shadow-lg shadow-[var(--glow)]/10 ring-1 ring-white/5">
      {children}
    </div>
  </section>
);

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="min-w-0 p-4 md:p-5 rounded-xl bg-[var(--primary)]/40 ring-1 ring-white/10">
    <h4 className="text-[var(--text-primary)] font-medium mb-2">{title}</h4>
    <div className="text-[var(--text-secondary)] text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

const CodeBlock = ({
  language = 'txt',
  code = '',
}: {
  language?: string;
  code: string;
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative w-full max-w-full min-w-0">
      <div className="w-full max-w-full min-w-0 overflow-x-auto rounded-xl ring-1 ring-white/10 bg-black/50">
        <pre className="inline-block w-full min-w-0 text-xs md:text-sm text-[var(--text-secondary)] p-4 leading-relaxed whitespace-pre">
          <div className="text-[10px] uppercase tracking-wider text-[var(--accent-secondary)] mb-2">
            {language}
          </div>
          <code className="break-words [overflow-wrap:anywhere]">{code}</code>
        </pre>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute top-2 right-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-lg bg-[var(--primary)]/70 hover:bg-[var(--primary)]/90 text-[var(--text-secondary)] ring-1 ring-white/10"
        aria-label="Copy code"
      >
        {copied ? (
          <>
            <Sparkles className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <ClipboardList className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-[var(--primary)]/40 ring-1 ring-white/10 p-4">
    <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wide">
      {label}
    </div>
    <div className="text-[var(--text-primary)] text-xl md:text-2xl font-semibold mt-1">
      {value}
    </div>
  </div>
);

/* ---------- Charts ---------- */

const KPIChart = () => (
  <div className="h-56 md:h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={kpiData}
        margin={{ top: 10, right: 20, bottom: 0, left: -10 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
        <XAxis
          dataKey="name"
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
        />
        <YAxis
          yAxisId="left"
          stroke="var(--text-secondary)"
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          domain={[0.8, 2.0]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="var(--text-secondary)"
          hide
          domain={[50, 90]}
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

/* ---------- Interactive bits ---------- */

const CallFlowSimulator = () => {
  const [level, setLevel] = useState<'L1' | 'L2' | 'L3'>('L1');
  const twiml = useMemo(() => {
    if (level === 'L1')
      return `<Response>
  <Gather input="speech dtmf" action="/voice/route" timeout="3" hints="reservation,order,hours,menu">
    <Say>Hi, thanks for calling. Say reservation, order, or question.</Say>
  </Gather>
  <Redirect>/voice/route</Redirect>
</Response>`;
    if (level === 'L2')
      return `<Response>
  <Connect>
    <Stream url="wss://orchestrator.aic.ai/stream?tenant=TENANT_ID&session=SESSION_ID"/>
  </Connect>
</Response>`;
    return `<Response>
  <Enqueue waitUrl="/voice/queue">level3_support</Enqueue>
</Response>`;
  }, [level]);

  const nodeWebhook = `app.post('/voice/inbound', verifyTwilio, async (req, res) => {
  const number = req.body.To;
  const tenant = await mapNumberToTenant(number);
  const flow = await getFlow(tenant);
  const twiml = new VoiceResponse();
  if (flow.mode === 'L1_PROMPTS') {
    const g = twiml.gather({ input: 'speech dtmf', action: '/voice/route', timeout: 3, hints: flow.hints.join(',') });
    g.say(flow.prompt);
    twiml.redirect('/voice/route');
  } else {
    const c = twiml.connect();
    c.stream({ url: wssUrl(tenant) });
  }
  res.type('text/xml').send(twiml.toString());
});`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Sparkles className="h-4 w-4" />
        <span>Pick a level to see how the phone system responds.</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { k: 'L1', label: 'Level 1 — AI Prompts' },
            { k: 'L2', label: 'Level 2 — AI Agent' },
            { k: 'L3', label: 'Level 3 — Human' },
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

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3 min-w-0">
          <div className="text-[var(--text-primary)] font-medium">
            Phone flow (TwiML)
          </div>
          <CodeBlock language="xml" code={twiml} />
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            <strong>What this means:</strong> The phone number can either ask a
            short “menu” question (Level 1), start a real-time AI conversation
            (Level 2), or pass you to a real person (Level 3).
          </p>
        </div>
        <div className="space-y-3 min-w-0">
          <div className="text-[var(--text-primary)] font-medium">
            Server code (Node.js)
          </div>
          <CodeBlock language="ts" code={nodeWebhook} />
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            <strong>Plain English:</strong> When someone calls, our server looks
            up which business they called, loads that business’s settings, and
            decides whether to do Level 1 (simple prompts), Level 2 (AI
            conversation), or Level 3 (human).
          </p>
        </div>
      </div>
    </div>
  );
};

const ArchitectureAscii = () => (
  <CodeBlock
    language="txt"
    code={`PSTN/SIP
  |
[Phone Provider (Twilio/ACS)] --> our webhook (instructions for what to do)
  |                     \\-- live audio --> [Agent Orchestrator (Node.js)]
  |                                            |
  |                                            |-> Ask our knowledge base (menus, hours, rules)
  |                                            |-> Make bookings (reservations)
  |                                            |-> Take simple orders (send payment link)
  |                                            |-> Send confirmations (SMS/Email)
  |                                            \\-> Speak back to caller (TTS)
[Human Queue] <--- if needed, send the call to staff with context
`}
  />
);

/* ---------- Admin Wizard mock ---------- */

const AdminWizardMock = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  return (
    <div className="space-y-4">
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        This shows how a restaurant would get set up. We keep it simple, so an
        owner or manager can do it in minutes.
      </p>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((s) => (
          <button
            key={s}
            onClick={() => setStep(s as 1 | 2 | 3)}
            className={`px-3 py-1.5 rounded-xl text-sm ring-1 ring-white/10 ${
              step === s
                ? 'bg-[var(--accent)]/20 text-[var(--text-primary)]'
                : 'bg-[var(--secondary)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Step {s}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard title="Business Info">
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, address, phone, time zone, hours.</li>
              <li>Choose your main language (e.g., English).</li>
              <li>Upload your logo (for emails/SMS).</li>
            </ul>
          </InfoCard>
          <InfoCard title="Buy or Port a Number">
            <ul className="list-disc pl-5 space-y-1">
              <li>Pick a local or toll-free number (fast).</li>
              <li>Or port your existing number (with a simple form).</li>
              <li>Safety: 911 address, caller ID name, spam protection.</li>
            </ul>
          </InfoCard>
        </div>
      )}

      {step === 2 && (
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard title="Call Flow (Levels)">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Level 1</strong>: a short voice menu (e.g., “say
                reservation, order, or question”).
              </li>
              <li>
                <strong>Level 2</strong>: a real conversation with the AI (menu
                questions, bookings, simple orders).
              </li>
              <li>
                <strong>Level 3</strong>: connect to a human, with a quick
                summary sent to them.
              </li>
            </ul>
          </InfoCard>
          <InfoCard title="Prompts & Policies">
            <ul className="list-disc pl-5 space-y-1">
              <li>Greeting, hours, address, quick FAQ answers.</li>
              <li>Rules: allergy handling, deposits, cancellation windows.</li>
              <li>Languages and tone (polite, direct, etc.).</li>
            </ul>
          </InfoCard>
        </div>
      )}

      {step === 3 && (
        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard title="Menus & Knowledge">
            <ul className="list-disc pl-5 space-y-1">
              <li>Upload a menu file (CSV/PDF) or link to your menu page.</li>
              <li>
                We turn it into structured data so the AI can answer questions.
              </li>
              <li>Mark items out of stock; set common allergens.</li>
            </ul>
          </InfoCard>
          <InfoCard title="Test & Go Live">
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the simulator to test “reservation at 7pm for 4”.</li>
              <li>Make a real call to your number and try all three levels.</li>
              <li>Click “Go Live”. You can switch it off anytime.</li>
            </ul>
          </InfoCard>
        </div>
      )}
    </div>
  );
};

/* ---------- Prompt Catalog mock ---------- */

const PromptCatalogMock = () => {
  const [open, setOpen] = useState(true);
  const samplePrompt = `Greeting v3:
"Thanks for calling {{restaurant_name}}. You can say reservation, order, or a quick question, and I’ll help."`;

  return (
    <div className="space-y-4">
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        This is where we keep reusable phrases the system says at Level 1 (and
        some Level 2). We keep versions, so you can try new wording and roll
        back if needed.
      </p>

      <div className="rounded-xl bg-[var(--primary)]/40 ring-1 ring-white/10">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-left"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-[var(--text-primary)] font-medium flex items-center gap-2">
            <Wand2 className="h-4 w-4 text-[var(--accent)]" />
            Level-1 Prompts (versioned)
          </span>
          {open ? <ChevronUp /> : <ChevronDown />}
        </button>
        {open && (
          <div className="px-4 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <InfoCard title="Examples">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Greeting, hours, address, directions.</li>
                  <li>“Say reservation, order, or question.”</li>
                  <li>“Press 0 to talk to a person.”</li>
                </ul>
              </InfoCard>
              <InfoCard title="A Prompt Version">
                <CodeBlock language="txt" code={samplePrompt} />
              </InfoCard>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- Demo API panel ---------- */

const DemoAPIPanel = () => {
  const [party, setParty] = useState(2);
  const [time, setTime] = useState('2025-09-10T19:00');
  const payload = {
    restaurant_id: 'resto_123',
    datetime: time,
    party_size: party,
    name: 'Alex',
    phone: '+1-604-555-0101',
  };

  const exampleResponse = {
    reservation_id: 'resv_789',
    status: 'confirmed',
    sms_confirmation_sent: true,
  };

  return (
    <div className="space-y-4">
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        This shows what the “make a reservation” request looks like. In real
        life, the AI would call this during Level 2.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard title="Request (what the AI sends)">
          <CodeBlock language="json" code={JSON.stringify(payload, null, 2)} />
        </InfoCard>
        <InfoCard title="Response (what our API returns)">
          <CodeBlock
            language="json"
            code={JSON.stringify(exampleResponse, null, 2)}
          />
        </InfoCard>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-secondary)]">
            Party size
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={party}
            onChange={(e) => setParty(Number(e.target.value))}
            className="bg-[var(--primary)]/40 ring-1 ring-white/10 rounded-lg px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--text-secondary)]">Time</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-[var(--primary)]/40 ring-1 ring-white/10 rounded-lg px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
        <div className="flex items-end">
          <button
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[var(--accent)]/20 text-[var(--text-primary)] ring-1 ring-[var(--accent)]/30"
            onClick={() =>
              alert(
                `We'd POST this payload:\n\n${JSON.stringify(payload, null, 2)}`
              )
            }
          >
            Simulate API Call
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Page ---------- */

export default function AICVoiceAgentMicrosite() {
  const nav = [
    { id: 'overview', label: 'Overview', icon: <Gauge className="h-4 w-4" /> },
    {
      id: 'jump',
      label: 'Jump to a Section',
      icon: <ChevronRight className="h-4 w-4" />,
    },
    {
      id: 'goals',
      label: 'Goals & KPIs',
      icon: <GitBranch className="h-4 w-4" />,
    },
    {
      id: 'callflow',
      label: 'Call Flows',
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
      id: 'admin',
      label: 'Admin Wizard',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: 'prompts',
      label: 'Prompt Catalog',
      icon: <Wand2 className="h-4 w-4" />,
    },
    { id: 'data', label: 'Data Model', icon: <Database className="h-4 w-4" /> },
    { id: 'apis', label: 'APIs', icon: <Code2 className="h-4 w-4" /> },
    {
      id: 'demoapi',
      label: 'Demo API',
      icon: <ServerCog className="h-4 w-4" />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: 'devops',
      label: 'Dev & Ops',
      icon: <Settings className="h-4 w-4" />,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: <ListChecks className="h-4 w-4" />,
    },
    {
      id: 'risks',
      label: 'Risks',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 'cli',
      label: 'AI CLI Tools',
      icon: <TerminalSquare className="h-4 w-4" />,
    },
  ];

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          'radial-gradient(1200px 600px at 10% -10%, var(--secondary) 0%, var(--primary) 40%, #000 90%)',
      }}
    >
      {/* Top Navbar (desktop + mobile) */}
      <nav className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-[var(--primary)]/70">
        <Container>
          <div className="py-3">
            {/* Title row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Cpu className="h-6 w-6 text-[var(--accent)]" />
                <span className="text-lg md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  AIC – AI Voice Agent
                </span>
              </div>
            </div>
            <div className="h-2" />
            {/* Full nav list; wraps on desktop, scrolls on smaller screens */}
            <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-xs md:text-sm px-3 py-1.5 rounded-lg bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  {n.icon}
                  <span>{n.label}</span>
                </a>
              ))}
            </div>
          </div>
        </Container>
      </nav>

      <main className="py-8 md:py-12">
        <Container>
          {/* Overview */}
          <motion.section
            id="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[var(--secondary)]/60 rounded-2xl p-6 md:p-8 ring-1 ring-white/10 shadow-xl shadow-[var(--glow)]/10 space-y-5"
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
                AI Voice Agent for Restaurants — clear, fast, and reliable
              </h1>
              <p className="text-[var(--text-secondary)]">
                A production-ready plan and demo for answering restaurant calls
                with AI and clean handoff to humans.
              </p>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              This project shows that I can design and explain a complete,
              end-to-end system: telephony (phone numbers and call flows),
              real-time speech, the AI logic, the data model, and handoff to
              humans. It’s built with React/Next.js (TypeScript) and styled
              using alexic.ca’s theme variables to match your brand.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The phone service has three levels: <strong>Level 1</strong> is a
              short voice menu for quick tasks,
              <strong> Level 2</strong> is a natural conversation with the AI
              that can check menus and make bookings, and{' '}
              <strong>Level 3</strong> connects the caller to a real person with
              useful context gathered by the AI. This keeps wait times low and
              reduces missed calls.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <Stat label="Missed-call reduction" value="60%+" />
              <Stat label="Containment (L1 + L2)" value="≥ 80%" />
              <Stat label="Turn latency (p50)" value="< 1.2s" />
            </div>
          </motion.section>

          {/* Jump to a Section */}
          <Section
            id="jump"
            title="Jump to a Section"
            icon={<ChevronRight className="h-5 w-5 text-[var(--accent)]" />}
            subtitle="Pick what you want to see. You don’t have to read everything in order."
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'goals',
                  title: 'Goals & KPIs',
                  desc: 'What we’re building and how we measure it.',
                },
                {
                  id: 'callflow',
                  title: 'Call Flows',
                  desc: 'How the phone number behaves at L1/L2/L3.',
                },
                {
                  id: 'architecture',
                  title: 'Architecture',
                  desc: 'How calls, AI, and data connect.',
                },
                {
                  id: 'numbers',
                  title: 'Phone Numbers',
                  desc: 'Buying/porting numbers and wiring call flows.',
                },
                {
                  id: 'admin',
                  title: 'Admin Wizard',
                  desc: 'How a restaurant gets set up (mock).',
                },
                {
                  id: 'prompts',
                  title: 'Prompt Catalog',
                  desc: 'Versioned phrases for L1 and L2 (mock).',
                },
                {
                  id: 'data',
                  title: 'Data Model',
                  desc: 'The main tables/entities we store.',
                },
                {
                  id: 'apis',
                  title: 'APIs',
                  desc: 'Endpoints used by the phone + AI.',
                },
                {
                  id: 'demoapi',
                  title: 'Demo API',
                  desc: 'Try a sample reservation request.',
                },
                {
                  id: 'security',
                  title: 'Security',
                  desc: 'Privacy, encryption, and compliance basics.',
                },
                {
                  id: 'devops',
                  title: 'Dev & Ops',
                  desc: 'Stack, deployment, observability, SLOs.',
                },
                {
                  id: 'timeline',
                  title: 'Timeline',
                  desc: 'What ships when (6 weeks).',
                },
                {
                  id: 'risks',
                  title: 'Risks',
                  desc: 'What can go wrong and how we handle it.',
                },
                {
                  id: 'cli',
                  title: 'AI CLI Tools',
                  desc: 'Quick tools I use from the terminal.',
                },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block p-4 rounded-xl bg-[var(--primary)]/40 ring-1 ring-white/10 hover:ring-white/20"
                >
                  <div className="text-[var(--text-primary)] font-medium">
                    {item.title}
                  </div>
                  <div className="text-[var(--text-secondary)] text-sm">
                    {item.desc}
                  </div>
                </a>
              ))}
            </div>
          </Section>

          {/* Main sections */}
          <div className="mt-10 md:mt-14 space-y-10">
            {/* Goals & KPIs */}
            <Section
              id="goals"
              title="Goals & KPIs"
              icon={<GitBranch className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Clear goals and practical measures so we know it’s working."
            >
              <div className="grid lg:grid-cols-2 gap-6">
                <InfoCard title="MVP Goals">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Register a phone number and attach a call flow.</li>
                    <li>
                      Level 1 prompts; Level 2 AI for menu Q&A and reservations;
                      Level 3 human handoff.
                    </li>
                    <li>
                      Text confirmations, transcripts for quality review, and
                      basic dashboards.
                    </li>
                    <li>Onboard a new restaurant in under 30 minutes.</li>
                  </ul>
                </InfoCard>
                <InfoCard title="KPIs">
                  <KPIChart />
                </InfoCard>
              </div>
            </Section>

            {/* Call Flows */}
            <Section
              id="callflow"
              title="Call Flows (Interactive)"
              icon={<PhoneIncoming className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Three clear levels: quick prompts, smart AI, and a human when needed."
            >
              <CallFlowSimulator />
            </Section>

            {/* Architecture */}
            <Section
              id="architecture"
              title="Architecture"
              icon={<Network className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="From the phone network to the AI and back to the caller."
            >
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-3">
                The phone company sends us events for each call. We respond with
                instructions (like “play this prompt” or “start streaming
                audio”). The AI logic runs in our Orchestrator (Node.js). It can
                read the restaurant’s info, check menus, create reservations,
                and speak back to the caller. If needed, we send the call to a
                real person and include a short summary so staff can jump in
                quickly.
              </p>
              <ArchitectureAscii />
            </Section>

            {/* Numbers */}
            <Section
              id="numbers"
              title="Phone Numbers — Provisioning & Registration"
              icon={<PhoneCall className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Exactly how we connect a number to Level 1, 2, and 3."
            >
              <div className="grid md:grid-cols-3 gap-4">
                <InfoCard title="Buy or Port">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Buy a local or toll-free number quickly.</li>
                    <li>
                      Or port your existing number (simple authorization form).
                    </li>
                    <li>Set 911 address and caller ID name if needed.</li>
                  </ul>
                </InfoCard>

                <InfoCard title="Attach Call Flow — How">
                  <p className="mb-2">
                    We wire the number to our server using the provider’s API:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>Twilio:</strong> set the number’s Voice URL to{' '}
                      <code>/v1/voice/inbound</code>. Our endpoint returns TwiML
                      to choose L1 (<code>Gather</code>), L2 (
                      <code>Connect/Stream</code>), or L3 (
                      <code>Enqueue/Dial</code>).
                    </li>
                    <li>
                      <strong>ACS:</strong> accept the call, attach media
                      streaming to our WebSocket, and apply the same level
                      logic.
                    </li>
                    <li>
                      <strong>DB mapping:</strong>{' '}
                      <code>
                        phone_number(id, tenant_id, e164, provider,
                        flow_version, status)
                      </code>{' '}
                      so we pick the right restaurant and flow version.
                    </li>
                    <li>
                      <strong>Versioning:</strong> <code>flow_version</code>{' '}
                      lets us roll out new logic safely.
                    </li>
                  </ul>
                  <p className="mt-2">
                    <strong>Escalation rules:</strong> confidence thresholds,
                    “max attempts” limits, and keyword triggers (e.g.,
                    “manager”) decide when to move from L1→L2 or L2→L3.
                  </p>
                </InfoCard>

                <InfoCard title="Safety & Reliability">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Verify provider signatures on webhooks; optional mTLS.
                    </li>
                    <li>
                      Secondary webhook & backup route/provider for failover.
                    </li>
                    <li>Record only with consent; encrypt & set retention.</li>
                  </ul>
                </InfoCard>
              </div>
            </Section>

            {/* Admin Wizard */}
            <Section
              id="admin"
              title="Admin Onboarding — Wizard (Mock)"
              icon={<Settings className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="How an owner/manager completes setup in minutes."
            >
              <AdminWizardMock />
            </Section>

            {/* Prompt Catalog */}
            <Section
              id="prompts"
              title="Prompt Catalog — Versioned (Mock)"
              icon={<Wand2 className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Reusable phrases for Level 1 (and some Level 2), kept in versions so we can test and roll back."
            >
              <PromptCatalogMock />
            </Section>

            {/* Data Model */}
            <Section
              id="data"
              title="Data Model (Selected)"
              icon={<Database className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="What we store and why."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard title="Core Entities">
                  <ul className="text-sm list-disc pl-5 space-y-2">
                    <li>
                      <code className="text-[var(--text-primary)]">
                        restaurant
                      </code>
                      : basic info, time zone, hours, policies.
                    </li>
                    <li>
                      <code className="text-[var(--text-primary)]">
                        phone_number
                      </code>
                      : number, provider, flow version, status.
                    </li>
                    <li>
                      <code className="text-[var(--text-primary)]">
                        call_session
                      </code>
                      : start/end, which level handled, outcome.
                    </li>
                    <li>
                      <code className="text-[var(--text-primary)]">
                        menu_item
                      </code>
                      : name, price, allergens, tags, availability.
                    </li>
                    <li>
                      <code className="text-[var(--text-primary)]">
                        reservation
                      </code>
                      : party size, time, name, phone, status.
                    </li>
                    <li>
                      <code className="text-[var(--text-primary)]">order</code>:
                      items, totals, payment status.
                    </li>
                  </ul>
                </InfoCard>
                <InfoCard title="Storage Approach">
                  <ul className="text-sm list-disc pl-5 space-y-2">
                    <li>Postgres with row-level security per restaurant.</li>
                    <li>pgvector to find relevant menu/policy answers.</li>
                    <li>
                      Redis for speed; S3 for audio; events to a warehouse.
                    </li>
                  </ul>
                </InfoCard>
              </div>
            </Section>

            {/* APIs */}
            <Section
              id="apis"
              title="APIs — What Developers Use"
              icon={<Code2 className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Endpoints called by the phone provider and by the AI logic."
            >
              <div className="grid lg:grid-cols-2 gap-4">
                <InfoCard title="Telephony & IVR">
                  <CodeBlock
                    language="http"
                    code={`POST /v1/voice/inbound     -> returns call instructions (menu vs AI)
POST /v1/voice/route       -> resolve Level 1; stream to AI or queue human
GET  /v1/phone-numbers     -> list/buy/port numbers; attach flow
POST /v1/call/{id}/handoff -> send to Level 3 (human) with context`}
                  />
                </InfoCard>
                <InfoCard title="Agent & Admin Tools">
                  <CodeBlock
                    language="http"
                    code={`POST /v1/intent              -> {session_id, text} => {intent, confidence}
POST /v1/tools/reserve      -> {restaurant_id, datetime, party_size, name, phone}
POST /v1/tools/order        -> {restaurant_id, items[], modifiers[]} => {order_id, pay_link}
POST /v1/tools/kb/query     -> {restaurant_id, query} => {passages[], citations[]}
POST /v1/prompts            -> register Level-1 prompt sets; versioned
GET  /v1/sessions/:id/summary -> context for staff screen-pop`}
                  />
                </InfoCard>
              </div>
            </Section>

            {/* Demo API */}
            <Section
              id="demoapi"
              title="Demo API — Try a Reservation Payload"
              icon={<ServerCog className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="A tiny, realistic example of what the AI sends and what our server replies with."
            >
              <DemoAPIPanel />
            </Section>

            {/* Security */}
            <Section
              id="security"
              title="Security & Compliance"
              icon={<ShieldCheck className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Keep data safe; follow phone, texting, and recording rules."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard title="Data">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Only collect what we need; encrypt recordings.</li>
                    <li>Row-level security; audit logs; data retention.</li>
                    <li>Keep card details out of calls (use payment links).</li>
                  </ul>
                </InfoCard>
                <InfoCard title="Telephony">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Outbound caller reputation (anti-spam measures).</li>
                    <li>Webhook signatures; optional mutual TLS.</li>
                    <li>Consent prompts based on local rules.</li>
                  </ul>
                </InfoCard>
              </div>
            </Section>

            {/* Dev & Ops */}
            <Section
              id="devops"
              title="Dev & Ops — How We Build and Ship"
              icon={<Settings className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="Stack choices, deployment, and what we monitor."
            >
              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard title="Stack">
                  <ul className="text-sm list-disc pl-5 space-y-2">
                    <li>Frontend: React + Next.js (Tailwind/MUI)</li>
                    <li>
                      Backend: Node.js (TypeScript); Python for speech SDKs
                    </li>
                    <li>Data: Postgres + pgvector; Redis; S3 audio</li>
                    <li>
                      Cloud: AWS (ECS/EKS, API Gateway/Lambda, Route53, KMS)
                    </li>
                    <li>CI/CD: GitHub Actions; Terraform; canary releases</li>
                  </ul>
                </InfoCard>
                <InfoCard title="Operations & SLOs">
                  <ul className="text-sm list-disc pl-5 space-y-2">
                    <li>Availability target: 99.9% at the phone edge</li>
                    <li>
                      Turn latency: p50 {'< 1.2s'}, p95 {'< 2.5s'}; tool error{' '}
                      {'< 2%'}
                    </li>
                    <li>
                      Tracing and dashboards for speech quality and errors
                    </li>
                  </ul>
                </InfoCard>
              </div>
            </Section>

            {/* Timeline */}
            <Section
              id="timeline"
              title="Delivery Timeline — 6 Weeks"
              icon={<ListChecks className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="A practical plan to reach a pilot quickly."
            >
              <div className="grid md:grid-cols-3 gap-4">
                <InfoCard title="Week 1–2: Telephony + Level 1">
                  Buy/port numbers; prompts; inbound webhooks; admin skeleton.
                </InfoCard>
                <InfoCard title="Week 3–4: AI + RAG + Reservations">
                  Streaming speech; orchestrator; menu/policy knowledge;
                  capacity model; SMS confirmations.
                </InfoCard>
                <InfoCard title="Week 5–6: Ordering + Handoff + Pilot">
                  Payment links; kitchen email/webhook; human handoff;
                  dashboards; canary rollouts.
                </InfoCard>
              </div>
            </Section>

            {/* Risks */}
            <Section
              id="risks"
              title="Risks & Mitigations"
              icon={<AlertTriangle className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="What can go wrong and how we handle it quickly."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard title="ASR accuracy on local dish names">
                  Custom vocabulary per restaurant; phonetic hints; monitor word
                  error rate; hand off when confidence is low.
                </InfoCard>
                <InfoCard title="Latency spikes">
                  Pre-warm AI engines; budget time spent on tools; start
                  speaking early (“anticipatory TTS”); fall back to Level 1 +
                  human.
                </InfoCard>
                <InfoCard title="POS fragmentation">
                  Start with one clean order format + kitchen email/webhook; add
                  POS adapters (Toast/Square) after MVP.
                </InfoCard>
                <InfoCard title="Regulatory differences">
                  Set recording rules per region; follow local texting rules;
                  allow data residency by region.
                </InfoCard>
              </div>
            </Section>

            {/* AI CLI Tools (bonus) */}
            <Section
              id="cli"
              title="(Bonus - Unrelated) AI CLI Tools I Actually Use"
              icon={<TerminalSquare className="h-5 w-5 text-[var(--accent)]" />}
              subtitle="You asked me about this in the interview, so I explored and standardized my workflow! These are some of the Quick, practical tools I run from the terminal to speed up everyday work."
            >
              <div className="grid md:grid-cols-2 gap-4">
                <InfoCard title="Everyday helpers">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>OpenAI CLI</strong> (<code>openai</code>): JSON
                      summaries, quick spec → code stubs, embeddings; easy to
                      script with npm/yarn.
                    </li>
                    <li>
                      <strong>GitHub Copilot CLI</strong> (
                      <code>gh copilot</code>): draft commit messages & PR
                      descriptions; explain diffs right in my Git flow.
                    </li>
                    <li>
                      <strong>aider</strong>: “AI pair programmer” that proposes
                      diffs across a repo; great for targeted refactors or docs.
                    </li>
                    <li>
                      <strong>curl + API keys</strong>: simple one-liners to hit
                      model endpoints from SSH (handy on remote servers).
                    </li>
                  </ul>
                </InfoCard>
                <InfoCard title="How I fit them into my stack">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>PHP / WordPress (day job)</strong>: with{' '}
                      <strong>WP-CLI</strong> I scaffold code; then run{' '}
                      <strong>OpenAI CLI</strong> to draft docblocks or convert
                      rough notes → README, and <strong>gh copilot</strong> to
                      polish PRs.
                    </li>
                    <li>
                      <strong>MERN / TypeScript (personal)</strong>: use{' '}
                      <strong>aider</strong> to suggest focused diffs;{' '}
                      <strong>OpenAI CLI</strong> to sketch route handlers or
                      test cases; quick <strong>curl</strong> calls during local
                      API tests.
                    </li>
                    <li>
                      <strong>SSH habits</strong>: tmux + CLI tools for
                      repeatable prompts; paste snippets back into VS
                      Code/Atom/Pulsar as needed.
                    </li>
                  </ul>
                </InfoCard>
              </div>
            </Section>

            {/* Footer */}
            <footer className="pt-6 text-[var(--text-secondary)] text-xs text-center">
              © {new Date().getFullYear()} • Designed & developed by Behbod
              Babai — brand colors use alexic.ca’s CSS variables.
            </footer>
          </div>
        </Container>
      </main>
    </div>
  );
}
