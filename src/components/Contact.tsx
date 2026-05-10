import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import socials from "@/data/socials.json";
import profile from "@/data/profile.json";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = msg.trim();

    if (trimmedName.length < 2) {
      setStatus("error");
      setError("Identity must be at least 2 characters.");
      return;
    }
    if (trimmedName.length > 60) {
      setStatus("error");
      setError("Identity is too long.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    if (trimmedMsg.length < 10) {
      setStatus("error");
      setError("Message must be at least 10 characters.");
      return;
    }
    if (trimmedMsg.length > 2000) {
      setStatus("error");
      setError("Message is too long (max 2000 characters).");
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("https://formspree.io/f/mlgzopqr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMsg,
          to: profile.email,
        }),
      });

      if (!response.ok) {
        let details = "";
        try {
          const data = (await response.json()) as { errors?: Array<{ message?: string }> };
          const msg0 = data?.errors?.[0]?.message;
          if (typeof msg0 === "string" && msg0.trim()) details = msg0.trim();
        } catch {
          // ignore JSON parsing failures; use generic message
        }
        throw new Error(details || `Submission failed (${response.status}).`);
      }

      setName("");
      setEmail("");
      setMsg("");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Network error. Please try again in a moment.";
      setError(message);
    }
  };

  return (
    <section id="contact" className="relative py-28">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeader
          index="08"
          kicker="CONTACT"
          title={
            <>
              Open a <span className="text-gradient">secure channel.</span>
            </>
          }
          subtitle="Drop a message via the terminal — I usually respond within 24 hours."
        />

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative glass-strong rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 font-mono text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.65_0.25_20)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.85_0.18_85)]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[oklch(0.75_0.18_150)]" />
              <span className="ml-3 text-muted-foreground">~/contact — bash</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-5">
              <Field
                label="$ identity"
                value={name}
                setValue={(v) => {
                  setName(v);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="your name"
              />
              <Field
                label="$ email_addr"
                value={email}
                setValue={(v) => {
                  setEmail(v);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="you@domain.com"
                type="email"
              />
              <div>
                <label className="text-[oklch(0.85_0.18_195)] block mb-1">$ message</label>
                <textarea
                  required
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  rows={5}
                  className="w-full bg-transparent border-b border-border focus:border-[oklch(0.85_0.18_195)] outline-none py-2 text-foreground resize-none transition"
                  placeholder="// type your transmission..."
                />
              </div>
              {(status === "error" || status === "success") && (
                <div
                  role={status === "error" ? "alert" : "status"}
                  aria-live="polite"
                  className={
                    status === "error"
                      ? "text-xs text-[oklch(0.75_0.18_20)]"
                      : "text-xs text-[oklch(0.75_0.18_150)]"
                  }
                >
                  {status === "error"
                    ? error
                    : "Secure transmission received. Response window: <24h."}
                </div>
              )}
              <button
                type="submit"
                data-cursor="hover"
                disabled={status === "loading"}
                aria-busy={status === "loading"}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-background bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)] tracking-[0.2em] text-xs glow-cyan hover:scale-[1.03] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading"
                  ? "TRANSMITTING…"
                  : status === "success"
                    ? "RE_TRANSMIT"
                    : "TRANSMIT →"}
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="glass-strong rounded-2xl p-6 space-y-3"
          >
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground">
              CONNECTED_NODES
            </div>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="group flex items-center justify-between p-4 rounded-xl border border-border hover:border-[oklch(0.85_0.18_195/0.6)] hover:bg-white/[0.03] transition"
              >
                <div>
                  <div className="font-display text-lg">{s.label}</div>
                  <div className="font-mono text-xs text-muted-foreground">{s.handle}</div>
                </div>
                <span className="font-mono text-xs text-[oklch(0.85_0.18_195)] opacity-0 group-hover:opacity-100 transition">
                  CONNECT →
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  setValue,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[oklch(0.85_0.18_195)] block mb-1">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border focus:border-[oklch(0.85_0.18_195)] outline-none py-2 text-foreground transition"
      />
    </div>
  );
}
