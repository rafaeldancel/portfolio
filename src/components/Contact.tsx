"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { profile, siteContent } from "@/content";
import { ExternalArrow } from "@/components/ExternalArrow";
import { usePrintInRow } from "@/lib/usePrintIn";
import { mailtoHref, sendMessage, type MessageProvider } from "@/lib/send-message";
import styles from "@/components/Contact.module.css";

type Field = "name" | "email" | "message";
type FormState =
  | { status: "idle" | "sending" }
  | { status: "sent"; provider: MessageProvider }
  | { status: "error" };

const copiedDuration = 2000;

function PrintRow({ index, className, children }: { index: number; className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const row = usePrintInRow(ref, index);
  return (
    <div
      ref={ref}
      className={className}
      onFocusCapture={row.finish}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) row.resume(); }}
    >
      {/* Unclipped once settled by focus, so focus rings at the edges stay visible. */}
      <motion.div style={{ opacity: row.opacity, y: row.y, clipPath: row.showFinal ? "none" : row.clipPath, willChange: row.willChange }}>
        {children}
      </motion.div>
    </div>
  );
}

function EmailButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), copiedDuration);
    return () => clearTimeout(timer);
  }, [copied]);

  function copy() {
    // The link still opens mailto; copying is a bonus where the clipboard is available.
    void navigator.clipboard?.writeText(profile.email).then(() => setCopied(true), () => {});
  }

  return (
    <>
      <a className="action-link action-primary" href={mailtoHref()} aria-label={siteContent.emailLabel} onClick={copy}>
        {/* Both labels share one cell so the swap never resizes the button. */}
        <span className={styles.emailLabel} aria-hidden="true">
          <span className={copied ? styles.hiddenLabel : undefined}>{siteContent.emailLabel}</span>
          <span className={copied ? undefined : styles.hiddenLabel}>{siteContent.copiedLabel}</span>
        </span>
        <ExternalArrow />
      </a>
      <span className="sr-only" role="status">{copied ? siteContent.emailCopied : ""}</span>
    </>
  );
}

function MessageForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  function validate(form: HTMLFormElement) {
    const next: Partial<Record<Field, string>> = {};
    for (const field of ["name", "email", "message"] as const) {
      const input = form.elements.namedItem(field) as HTMLInputElement | HTMLTextAreaElement;
      if (!input.value.trim()) next[field] = siteContent.requiredError;
      else if (!input.validity.valid) next[field] = siteContent.emailError;
    }
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.status === "sending") return;
    const form = event.currentTarget;
    const nextErrors = validate(form);
    setErrors(nextErrors);
    const firstInvalid = (["name", "email", "message"] as const).find((field) => nextErrors[field]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement).focus();
      return;
    }

    const data = new FormData(form);
    const input = {
      name: String(data.get("name")).trim(),
      email: String(data.get("email")).trim(),
      message: String(data.get("message")).trim(),
      botcheck: data.get("botcheck") !== null,
    };
    if (input.botcheck) return;

    setState({ status: "sending" });
    const result = await sendMessage(input);
    if (!result.ok) {
      setState({ status: "error" });
      return;
    }
    if (result.provider === "web3forms") form.reset();
    setState({ status: "sent", provider: result.provider });
  }

  function clearError(field: Field) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    if (state.status !== "idle" && state.status !== "sending") setState({ status: "idle" });
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    required: true,
    className: styles.input,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    onChange: () => clearError(field),
  });

  const fieldError = (field: Field) => errors[field] && (
    <span id={`contact-${field}-error`} className={styles.error}>{errors[field]}</span>
  );

  return (
    <form className={styles.form} aria-label={siteContent.formLabel} noValidate onSubmit={onSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="contact-name" className={styles.label}>{siteContent.nameLabel}</label>
          <input {...fieldProps("name")} type="text" autoComplete="name" />
          {fieldError("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="contact-email" className={styles.label}>{siteContent.formEmailLabel}</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" spellCheck={false} />
          {fieldError("email")}
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>{siteContent.messageLabel}</label>
        <textarea {...fieldProps("message")} rows={6} />
        {fieldError("message")}
      </div>
      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <input type="checkbox" name="botcheck" className={styles.honeypot} tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className={styles.footer}>
        <button type="submit" className={`action-link action-primary ${styles.submit}`} disabled={state.status === "sending"}>
          {state.status === "sending" ? siteContent.sendingLabel : siteContent.sendLabel}
        </button>
        <p className={styles.status} role="status" aria-live="polite">
          {state.status === "sent" && (state.provider === "web3forms"
            ? <span className={styles.ok}>{siteContent.sentWeb3forms}</span>
            : siteContent.sentMailto)}
          {state.status === "error" && (
            <>{siteContent.sendError} <a href={mailtoHref()}>{siteContent.sendFallback}</a></>
          )}
        </p>
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <div className={styles.contact}>
      <PrintRow index={0} className={styles.intro}>
        <p className={styles.location}>{siteContent.contactLocation}</p>
        <div className={styles.actions}>
          <EmailButton />
          <a className="action-link" href={profile.linkedin}>{siteContent.linkedinLabel}<ExternalArrow /></a>
          <a className="action-link" href={profile.github}>{siteContent.githubLabel}<ExternalArrow /></a>
        </div>
      </PrintRow>
      <PrintRow index={1} className={styles.formRow}>
        <MessageForm />
      </PrintRow>
    </div>
  );
}
