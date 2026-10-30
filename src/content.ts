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
  model?: string;
  hidden?: boolean;
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
  github: "https://github.com/rafaeldancel",
  // resume: not yet. Add a "Download résumé" button later when the PDF exists.
};

export const experience = [
  { role: "AI Developer", org: "WPH Digital Phil.", range: "Mar 2026 – Present",
    note: "Full-stack + AI solutions for Southeast Asian clients. Client work under NDA." },
  { role: "Freelance AI Developer (subcontract)", org: "Independent", range: "Mar–Jun 2025 · Dec 2025–Apr 2026",
    note: "~10 AI-driven SaaS MVPs for one client with Lovable, Replit and Claude, incl. a fitness app with real-time camera rep counting and exercise form checks, plus Spotify, Apple HealthKit and ElevenLabs voice coach integrations." },
];

export const stack = {
  "ai/llm": ["Amazon Bedrock", "Claude", "OpenAI", "Gemini", "RAG", "Qdrant", "Bedrock Knowledge Bases", "LLM evaluation", "YOLO"],
  "full-stack": ["JavaScript", "TypeScript", "Python", "Next.js", "React", "Tailwind", "tRPC", "Prisma", "PostgreSQL", "Supabase", "Zod", "Auth.js", "Docker"],
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
    stack: ["Next.js", "TypeScript", "tRPC", "Prisma", "PostgreSQL", "Amazon Bedrock", "Vitest"] },
  { id: "vestra", kind: "personal", title: "Vestra",
    context: "Real-time dress code detection in the browser",
    live: "https://vestra-dresscode.vercel.app",
    model: "https://huggingface.co/rafdancel/vestra-y26s",
    metric: { from: 0.468, to: 0.547, unit: "mAP@.5:.95", label: "vs YOLOv5s baseline (+17%)" },
    points: [
      "Trained YOLO26s on 15,604 images across 9 classes (Roboflow skirts set, cleaned, + dress and leggings from Fashionpedia, license-checked).",
      "mAP@.5:.95 0.468 → 0.547 (+17%) and crop-top 0.241 → 0.409 vs a YOLOv5s baseline, on a 283-image test split.",
      "Runs on-device with WebGPU via ONNX: first inference 1270 ms → 36 ms after a warm-up fix; live camera at 8–10 fps.",
      "Evaluated on 433 held-out images (283 test split + 150 real-world photos never trained on); trousers detected 6 → 43 of 54 in the real-world set.",
      "In progress: next model version targets leggings vs trousers, outerwear, and a footwear class.",
    ],
    stack: ["YOLO", "ONNX", "WebGPU", "TypeScript", "Vitest"] },
  { id: "logos", kind: "bootcamp · personal", title: "Logos", context: "RAG mentorship assistant · Hytel AI Bootcamp, Feb–Mar 2026",
    hidden: true,
    metric: null,
    points: ["Ingestion pipeline with chunking, embeddings and Firestore.", "React / TypeScript Turborepo frontend."],
    stack: ["RAG", "Embeddings", "Firestore", "React", "TypeScript"] },
];

export const education = {
  degree: "BS Computer Science, Intelligent Systems",
  school: "De La Salle University – Dasmariñas", range: "2021–2025",
};

// Interface copy follows AGENTS.md and Raf's approved hero direction.
export const siteContent = {
  description: "Rafael Dancel, AI Developer in Cavite, Philippines.",
  skipLink: "Skip to content",
  identity: "rafael.dancel",
  available: "available",
  commandHint: "⌘K",
  commandHintLabel: "Open command palette",
  paletteLabel: "Command palette",
  palettePlaceholder: "Type a command or search…",
  paletteEmpty: "No matches.",
  paletteNavigate: "Navigate",
  paletteProjects: "Projects",
  paletteActions: "Actions",
  copyEmailLabel: "Copy email",
  openLinkedinLabel: "Open LinkedIn",
  openGithubLabel: "Open GitHub",
  usedInLabel: "used in:",
  usedInNone: "—",
  heroLabel: "~/portfolio · 2026",
  // The first title is the static, screen-reader and reduced-motion title.
  heroTitles: ["Gen AI Developer", "AI Engineer"],
  heroScrollCue: "↓ SCROLL · 01 / EXPERIENCE",
  specialties: "Full-stack · Agentic systems · Automation",
  connectLabel: "Connect with Raf ↓",
  viewWorkLabel: "View work",
  emailLabel: "Email",
  copiedLabel: "copied",
  emailCopied: "Email address copied",
  linkedinLabel: "LinkedIn",
  githubLabel: "GitHub",
  building: "STATUS: BUILDING",
  previousRun: "Previous run",
  nextRun: "Next run",
  pipelineSwitcher: "Pipeline runs",
  pipelineRunLabel: "run",
  pipelineRunOf: "of",
  liveLabel: "live",
  modelLabel: "model",
  pipelineCheck: "✓",
  nda: "Under NDA: anonymized, no code or screenshots",
  contactLocation: "Based in the Philippines · UTC+8",
  formLabel: "Send a message",
  nameLabel: "Name",
  formEmailLabel: "Email",
  messageLabel: "Message",
  sendLabel: "Send",
  sendingLabel: "sending…",
  sentMailto: "opening your mail app…",
  sentWeb3forms: "sent ✓",
  sendError: "Could not send the message.",
  sendFallback: "Email me directly",
  requiredError: "required",
  emailError: "enter a valid email",
  footer: "built with Next.js · Tailwind · Framer Motion",
} as const;

// `nav: false` keeps a section out of the top bar.
export const sections = [
  { id: "experience", index: "01", label: "Experience", nav: true },
  { id: "education", index: "02", label: "Education", nav: false },
  { id: "stack", index: "03", label: "Stack", nav: true },
  { id: "work", index: "04", label: "Work", nav: true },
  { id: "contact", index: "05", label: "Contact", nav: true },
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
    precision?: number;
  }>;
}>;

export type PipelineJob = Readonly<{
  id: string;
  header: string;
  lines: readonly PipelineLine[];
}>;

export const pipelineRuns: readonly PipelineJob[] = [
  {
    id: "equity-extract",
    header: "job: equity-extract",
    lines: [
      { time: "00:00", verb: "ingest", detail: "annual_report.pdf  ~500 pages" },
      { time: "00:01", verb: "chunk", detail: "96k → 12k tokens / call",
        count: { from: 96, to: 12, prefix: "96k → ", suffix: "k tokens / call" } },
      { time: "00:02", verb: "extract", detail: "6 extractors · source-cited" },
      { time: "00:03", verb: "run", detail: "562s → 113s   (parallelized)",
        count: { from: 562, to: 113, prefix: "562s → ", suffix: "s   (parallelized)" } },
      { time: "00:04", verb: "verify", detail: "every value quotes a source passage", passed: true },
    ],
  },
  {
    id: "vestra-detect",
    header: "job: vestra-detect",
    lines: [
      { time: "00:00", verb: "load", detail: "vestra-y26s-m1.onnx  38 MB · WebGPU" },
      { time: "00:01", verb: "warmup", detail: "first inference 1270ms → 36ms",
        count: { from: 1270, to: 36, prefix: "first inference 1270ms → ", suffix: "ms" } },
      { time: "00:02", verb: "detect", detail: "9 classes · live camera 8–10 fps" },
      { time: "00:03", verb: "eval", detail: "mAP@.5:.95 0.468 → 0.547  (+17%)",
        count: { from: 0.468, to: 0.547, precision: 3, prefix: "mAP@.5:.95 0.468 → ", suffix: "  (+17%)" } },
      { time: "00:04", verb: "verify", detail: "ONNX ↔ PyTorch parity", passed: true },
    ],
  },
] as const;


export const notFoundContent = {
  error: "error:",
  message: "route not found",
  pathLabel: "path:",
  home: "cd ~",
} as const;
