import type { ComponentType, SVGProps } from "react";
import {
  SiClaude, SiClaudeHex, SiClaudecode, SiClaudecodeHex, SiCursor, SiCursorHex,
  SiDocker, SiDockerHex, SiFigma, SiFigmaHex, SiGithub, SiGithubHex,
  SiGitlab, SiGitlabHex, SiGooglecloud, SiGooglecloudHex, SiGooglegemini, SiGooglegeminiHex,
  SiNextdotjs, SiNextdotjsHex, SiPostgresql, SiPostgresqlHex, SiPrisma, SiPrismaHex,
  SiJavascript, SiJavascriptHex, SiPython, SiPythonHex,
  SiQdrant, SiQdrantHex, SiReact, SiReactHex, SiSupabase, SiSupabaseHex,
  SiTailwindcss, SiTailwindcssHex, SiTrpc, SiTrpcHex, SiTypescript, SiTypescriptHex,
  SiVitest, SiVitestHex, SiYolo, SiYoloHex, SiZod, SiZodHex,
} from "@icons-pack/react-simple-icons";
import { AwsIcon } from "@/components/icons/AwsIcon";
import { AntigravityIcon } from "@/components/icons/AntigravityIcon";
import { CodexIcon } from "@/components/icons/CodexIcon";
import { OpenAIIcon } from "@/components/icons/OpenAIIcon";
import { AmazonBedrockIcon } from "@/components/icons/AmazonBedrockIcon";
import { PgAdminIcon } from "@/components/icons/PgAdminIcon";

type StackIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
type IconDefinition = Readonly<{ Icon: StackIcon; color: string; source: "simple-icons" | "devicon" | "official" }>;

const simple = (Icon: StackIcon, color: string): IconDefinition => ({ Icon, color, source: "simple-icons" });

export const stackIcons: Readonly<Record<string, IconDefinition>> = {
  "Amazon Bedrock": { Icon: AmazonBedrockIcon, color: "#01A88D", source: "official" },
  Claude: simple(SiClaude, SiClaudeHex),
  OpenAI: { Icon: OpenAIIcon, color: "#FFFFFF", source: "official" },
  Gemini: simple(SiGooglegemini, SiGooglegeminiHex),
  Qdrant: simple(SiQdrant, SiQdrantHex),
  YOLO: simple(SiYolo, SiYoloHex),
  "Next.js": simple(SiNextdotjs, SiNextdotjsHex),
  JavaScript: simple(SiJavascript, SiJavascriptHex),
  Python: simple(SiPython, SiPythonHex),
  React: simple(SiReact, SiReactHex),
  TypeScript: simple(SiTypescript, SiTypescriptHex),
  Tailwind: simple(SiTailwindcss, SiTailwindcssHex),
  tRPC: simple(SiTrpc, SiTrpcHex),
  Prisma: simple(SiPrisma, SiPrismaHex),
  PostgreSQL: simple(SiPostgresql, SiPostgresqlHex),
  Supabase: simple(SiSupabase, SiSupabaseHex),
  Zod: simple(SiZod, SiZodHex),
  Docker: simple(SiDocker, SiDockerHex),
  AWS: { Icon: AwsIcon, color: "#FF9900", source: "devicon" },
  "Google Cloud Platform": simple(SiGooglecloud, SiGooglecloudHex),
  "Claude Code": simple(SiClaudecode, SiClaudecodeHex),
  Codex: { Icon: CodexIcon, color: "#5061F7", source: "devicon" },
  Cursor: simple(SiCursor, SiCursorHex),
  Antigravity: { Icon: AntigravityIcon, color: "#3581E5", source: "devicon" },
  Vitest: simple(SiVitest, SiVitestHex),
  GitLab: simple(SiGitlab, SiGitlabHex),
  GitHub: simple(SiGithub, SiGithubHex),
  pgAdmin: { Icon: PgAdminIcon, color: "#336791", source: "official" },
  Figma: simple(SiFigma, SiFigmaHex),
};

// Text-only on purpose: concepts (RAG, LLM evaluation) get no substitute mark;
// Bedrock Knowledge Bases and Auth.js have no official brand SVG. See components/icons/SOURCES.md.

function luminance(hex: string) {
  const expanded = hex.replace(/^#/, "");
  const full = expanded.length === 3 ? expanded.split("").map((part) => part + part).join("") : expanded;
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(full.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function iconHoverColor(brandColor: string) {
  // Matches the prescribed --bg token. Graphical marks need at least 3:1.
  const background = luminance("#0D0D0B");
  const brand = luminance(brandColor);
  const contrast = (Math.max(brand, background) + 0.05) / (Math.min(brand, background) + 0.05);
  return contrast >= 3 ? brandColor : "var(--fg)";
}
