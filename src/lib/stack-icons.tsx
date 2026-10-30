import type { ComponentType, SVGProps } from "react";
import {
  SiClaudecode, SiClaudecodeHex, SiCursor, SiCursorHex,
  SiDocker, SiDockerHex, SiFigma, SiFigmaHex, SiGithub, SiGithubHex,
  SiGitlab, SiGitlabHex, SiGooglecloud, SiGooglecloudHex, SiGooglegemini, SiGooglegeminiHex,
  SiNextdotjs, SiNextdotjsHex, SiPostgresql, SiPostgresqlHex, SiPrisma, SiPrismaHex,
  SiQdrant, SiQdrantHex, SiReact, SiReactHex, SiSupabase, SiSupabaseHex,
  SiTailwindcss, SiTailwindcssHex, SiTrpc, SiTrpcHex, SiTypescript, SiTypescriptHex,
  SiVitest, SiVitestHex, SiYolo, SiYoloHex, SiZod, SiZodHex,
} from "@icons-pack/react-simple-icons";
import { AwsIcon } from "@/components/icons/AwsIcon";
import { AntigravityIcon } from "@/components/icons/AntigravityIcon";
import { CodexIcon } from "@/components/icons/CodexIcon";

type StackIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
type IconDefinition = Readonly<{ Icon: StackIcon; color: string; source: "simple-icons" | "devicon" }>;

const simple = (Icon: StackIcon, color: string): IconDefinition => ({ Icon, color, source: "simple-icons" });

export const stackIcons: Readonly<Record<string, IconDefinition>> = {
  Gemini: simple(SiGooglegemini, SiGooglegeminiHex),
  Qdrant: simple(SiQdrant, SiQdrantHex),
  YOLO: simple(SiYolo, SiYoloHex),
  "Next.js": simple(SiNextdotjs, SiNextdotjsHex),
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
  Figma: simple(SiFigma, SiFigmaHex),
};

// Intentionally text-only concepts; no unrelated brand marks are substituted.
export const conceptsWithoutIcons = ["RAG", "Embeddings", "Structured output", "LLM evaluation", "OCR"] as const;
// Checked against the installed Simple Icons exports and Devicon catalogue.
export const brandsWithoutIcons = ["AWS Bedrock (Claude)", "Bedrock KB", "OpenAI", "Auth.js", "pgAdmin"] as const;

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
