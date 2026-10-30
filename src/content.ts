export type WorkMetric = Readonly<{
  from?: number;
  to?: number;
  value?: number;
  unit: string;
  label: string;
}>;

export type WorkItem = Readonly<{
  id: string;
  kind: string;
  title: string;
  context: string;
  status?: "in-progress";
  live?: string;
  metric: WorkMetric | null;
  points: readonly string[];
  stack: readonly string[];
}>;

export const profile = {
  name: "Rafael Dancel",
  short: "Raf",
  title: "AI Developer",
  location: "Cavite, Philippines",
  email: "rafaeljandancel@gmail.com",
  linkedin: "https://linkedin.com/in/rafaeldancel",
  github: "https://github.com/YOUR_HANDLE",
  // resume: not yet. Add a "Download résumé" button later when the PDF exists.
};

export const experience = [
  { role: "AI Developer", org: "WPH Digital Phil.", range: "Mar 2026 – Present",
    note: "Full-stack + AI solutions for Southeast Asian clients. Client work under NDA." },
  { role: "Freelance AI Developer (subcontract)", org: "Independent", range: "Mar–Jun 2025 · Dec 2025–Apr 2026",
    note: "~10 AI-driven SaaS MVPs for one client with Lovable, Replit and Claude, incl. ChristFit (camera rep counting, Spotify, Apple HealthKit, ElevenLabs voice coach)." },
];

export const stack = {
  "ai/llm": ["AWS Bedrock (Claude)", "OpenAI", "Gemini", "RAG", "Embeddings", "Qdrant", "Bedrock KB", "Structured output", "LLM evaluation", "OCR", "YOLO"],
  "full-stack": ["Next.js", "React", "TypeScript", "Tailwind", "tRPC", "Prisma", "PostgreSQL", "Supabase", "Zod", "Auth.js", "Docker"],
  "cloud": ["AWS", "Google Cloud Platform"],
  "tooling": ["Claude Code", "Codex", "Cursor", "Antigravity", "Vitest", "GitLab", "GitHub", "pgAdmin", "Figma"],
};

export const work: readonly WorkItem[] = [
  { id: "a", kind: "PoC · client · team", title: "AI equity research platform",
    context: "Regulated financial services client",
    metric: { from: 562, to: 113, unit: "s", label: "extraction time" },
    points: [
      "6 LLM extractors pull source-cited financial data from filings up to ~500 pages; every value must quote a real source passage.",
      "Chunked RAG retrieval cut context from 96k to 12k tokens per call; 400k-token documents now process.",
      "Extraction 562s → 113s via parallelization; 173s → 13s after fixing 3 Bedrock migration bugs.",
      "Market data pipeline and financial computations end to end; segment figures reconcile exactly to audited filings.",
      "AI insight confidence 0.72–0.96 after rebuilding grounding.",
    ],
    stack: ["Next.js", "TypeScript", "tRPC", "Prisma", "PostgreSQL", "AWS Bedrock (Claude)", "Vitest"] },
  { id: "vestra", kind: "personal", title: "Vestra", context: "v2 of UWear, built on my thesis",
    status: "in-progress", live: "TODO", // Vercel URL, Raf will supply
    metric: null, points: [], stack: [] },
  // Placeholder card: dimmed, mono `STATUS: BUILDING` tag, blinking cursor,
  // non-expandable, no metric. Show a `live ↗` link only once `live` is a real URL.
  { id: "logos", kind: "bootcamp · personal", title: "Logos", context: "RAG mentorship assistant · Hytel AI Bootcamp, Feb–Mar 2026",
    metric: null,
    points: ["Ingestion pipeline with chunking, embeddings and Firestore.", "React / TypeScript Turborepo frontend."],
    stack: ["RAG", "Embeddings", "Firestore", "React", "TypeScript"] },
];

export const education = {
  degree: "BS Computer Science, Intelligent Systems",
  school: "De La Salle University – Dasmariñas", range: "2021–2025", honor: "Dean's Lister",
  certs: [
    "AI-Driven Full-Stack Development: Google Cloud, Vertex AI & RAG (Hytel, 2026)",
    "Google IT Automation with Python (Coursera, 2025)",
    "TOEIC 860 (B2)",
  ],
};

// Interface copy follows AGENTS.md and Raf's approved hero direction.
export const siteContent = {
  description: "Rafael Dancel, AI Developer in Cavite, Philippines.",
  skipLink: "Skip to content",
  identity: "rafael.dancel",
  available: "available",
  commandHint: "⌘K",
  heroLabel: "CAVITE, PH",
  heroTitle: "Gen AI Developer",
  specialties: "Full-stack · Agentic systems · Automation",
  emailLabel: "Email",
  linkedinLabel: "LinkedIn",
  githubLabel: "GitHub",
  building: "STATUS: BUILDING",
  replay: "replay",
  pipelineCheck: "✓",
  nda: "Under NDA: anonymized, no code or screenshots",
  footer: "built with Next.js · Tailwind · Framer Motion · AI-assisted, human-reviewed",
} as const;

export const sections = [
  { id: "experience", index: "01", label: "Experience" },
  { id: "stack", index: "02", label: "Stack" },
  { id: "work", index: "03", label: "Work" },
  { id: "contact", index: "04", label: "Contact" },
] as const;

export type PipelineLine = Readonly<{
  time: string;
  verb: string;
  detail: string;
  passed?: boolean;
  count?: Readonly<{
    from: number;
    to: number;
    prefix: string;
    suffix: string;
  }>;
}>;

export const pipeline: readonly PipelineLine[] = [
  { time: "00:00", verb: "ingest", detail: "annual_report.pdf  ~500 pages" },
  { time: "00:01", verb: "chunk", detail: "96k → 12k tokens / call",
    count: { from: 96, to: 12, prefix: "96k → ", suffix: "k tokens / call" } },
  { time: "00:02", verb: "extract", detail: "6 extractors · source-cited" },
  { time: "00:03", verb: "run", detail: "562s → 113s   (parallelized)",
    count: { from: 562, to: 113, prefix: "562s → ", suffix: "s   (parallelized)" } },
  { time: "00:04", verb: "verify", detail: "every value quotes a source passage", passed: true },
] as const;

