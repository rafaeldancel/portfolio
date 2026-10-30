import { profile } from "@/content";

export type MessageProvider = "mailto" | "web3forms";

export type MessageInput = Readonly<{
  name: string;
  email: string;
  message: string;
  botcheck: boolean;
}>;

export type SendResult =
  | Readonly<{ ok: true; provider: MessageProvider; skipped?: true }>
  | Readonly<{ ok: false; provider: MessageProvider; error: string }>;

type Web3FormsPayload = Readonly<{
  access_key: string;
  name: string;
  email: string;
  message: string;
  subject: string;
  botcheck: boolean;
}>;

type Web3FormsResponse = Readonly<{
  success: boolean;
  message?: string;
}>;

// To enable Web3Forms: create a free access key at web3forms.com, then set
// NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (never committed) and in the Vercel
// project env, and rebuild. Without the key, the form falls back to mailto.
const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const web3formsEndpoint = "https://api.web3forms.com/submit";

export const messageProvider: MessageProvider = web3formsKey ? "web3forms" : "mailto";

function subjectFor(name: string) {
  return `Portfolio message from ${name}`;
}

export function mailtoHref(input?: Pick<MessageInput, "name" | "email" | "message">) {
  if (!input) return `mailto:${profile.email}`;
  const body = `${input.message}\n\n— ${input.name} (${input.email})`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subjectFor(input.name))}&body=${encodeURIComponent(body)}`;
}

function sendWithMailto(input: MessageInput): SendResult {
  try {
    window.location.href = mailtoHref(input);
    return { ok: true, provider: "mailto" };
  } catch (error) {
    return { ok: false, provider: "mailto", error: error instanceof Error ? error.message : String(error) };
  }
}

async function sendWithWeb3Forms(input: MessageInput, accessKey: string): Promise<SendResult> {
  const payload: Web3FormsPayload = {
    access_key: accessKey,
    name: input.name,
    email: input.email,
    message: input.message,
    subject: subjectFor(input.name),
    botcheck: input.botcheck,
  };
  try {
    const response = await fetch(web3formsEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as Web3FormsResponse;
    if (response.ok && result.success) return { ok: true, provider: "web3forms" };
    return { ok: false, provider: "web3forms", error: result.message ?? `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, provider: "web3forms", error: error instanceof Error ? error.message : String(error) };
  }
}

export async function sendMessage(input: MessageInput): Promise<SendResult> {
  // A filled honeypot means a bot: report success without sending anything.
  if (input.botcheck) return { ok: true, provider: messageProvider, skipped: true };
  if (web3formsKey) return sendWithWeb3Forms(input, web3formsKey);
  return sendWithMailto(input);
}
