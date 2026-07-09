import { useState } from "react";

import { motion } from "framer-motion";

import { SectionHeader } from "./SectionHeader";

import socials from "@/data/socials.json";

export function Contact() {
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [msg, setMsg] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "verify" | "error">("idle");

  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status === "loading") {
      return;
    }

    setError(null);

    const payload = {
      name: name.trim(),

      email: email.trim().toLowerCase(),

      subject: "Portfolio Contact",

      message: msg.trim(),
    };

    if (payload.name.length < 2) {
      setStatus("error");

      setError("Identity must contain at least 2 characters.");

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setStatus("error");

      setError("Enter a valid email address.");

      return;
    }

    if (payload.message.length < 10) {
      setStatus("error");

      setError("Transmission requires minimum 10 characters.");

      return;
    }

    try {
      setStatus("loading");

      const res = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error ?? "Transmission rejected.");
      }

      setName("");

      setEmail("");

      setMsg("");

      setStatus("verify");
    } catch (err) {
      setStatus("error");

      const message = err instanceof Error ? err.message : "Transmission failed.";

      const friendlyErrors: Record<string, string> = {
        INVALID_INPUT: "Transmission format rejected.",

        RATE_LIMITED: "Too many attempts. Try again later.",

        BOT_DETECTED: "Security system rejected this request.",

        TRANSMISSION_FAILED: "Secure channel temporarily unavailable.",
      };

      setError(friendlyErrors[message] ?? message);
    }
  }

  return (
    <section
      id="contact"

      className="
relative
py-28
"
    >
      <div
        className="
absolute
inset-0
bg-grid
mask-fade-b
opacity-50
"
      />

      <div
        className="
relative
mx-auto
max-w-7xl
px-6
"
      >
        <SectionHeader
          index="08"

          kicker="CONTACT"

          title={
            <>
              Open a <span className="text-gradient">secure channel.</span>
            </>
          }

          subtitle="
Verified email delivery with secure private response channel.
"
        />

        <div
          className="
grid
lg:grid-cols-[1.2fr_1fr]
gap-6
"
        >
          <motion.form
            onSubmit={onSubmit}

            initial={{
              opacity: 0,
              y: 24,
            }}

            whileInView={{
              opacity: 1,
              y: 0,
            }}

            viewport={{
              once: true,
            }}

            className="
glass-strong
rounded-2xl
overflow-hidden
"
          >
            <div
              className="
flex
items-center
gap-2
px-4
py-3
border-b
border-border/60
font-mono
text-xs
"
            >
              <span
                className="
w-2.5
h-2.5
rounded-full
bg-[oklch(0.65_0.25_20)]
"
              />

              <span
                className="
w-2.5
h-2.5
rounded-full
bg-[oklch(0.85_0.18_85)]
"
              />

              <span
                className="
w-2.5
h-2.5
rounded-full
bg-[oklch(0.75_0.18_150)]
"
              />

              <span
                className="
ml-3
text-muted-foreground
"
              >
                ~/contact — secured
              </span>
            </div>

            <div
              className="
p-6
font-mono
text-sm
space-y-6
"
            >
              <Field
                label="$ identity"

                value={name}

                setValue={setName}

                placeholder="your name"
              />

              <Field
                label="$ email_addr"

                value={email}

                setValue={setEmail}

                placeholder="you@domain.com"

                type="email"
              />

              <div>
                <label
                  className="
text-[oklch(0.85_0.18_195)]
block
mb-1
"
                >
                  $message
                </label>

                <textarea
                  required

                  rows={5}

                  value={msg}

                  onChange={(e) => setMsg(e.target.value)}

                  placeholder="// type your transmission..."

                  className="
w-full
bg-transparent
border-b
border-border
focus:border-[oklch(0.85_0.18_195)]
outline-none
resize-none
py-2
transition
"
                />
              </div>

              <div
                className="
rounded-xl
border
border-border
bg-white/2
p-5
grid
grid-cols-2
gap-4
"
              >
                <SystemItem name="EMAIL_VERIFY" value="ACTIVE" />

                <SystemItem name="SECURE_STORE" value="ONLINE" />

                <SystemItem name="SPAM_FILTER" value="ARMED" />

                <SystemItem name="RESPONSE" value="<24H" />
              </div>

              {status === "error" && (
                <p
                  className="
text-xs
text-red-400
"
                >
                  {error}
                </p>
              )}

              {status === "verify" && (
                <p
                  className="
text-xs
text-[oklch(0.75_0.18_150)]
"
                >
                  Verification link sent. Check your email to complete secure transmission.
                </p>
              )}

              <button
                disabled={status === "loading"}

                className="
px-5
py-2.5
rounded-lg
bg-linear-to-r
from-[oklch(0.85_0.18_195)]
to-[oklch(0.72_0.22_295)]
text-background
tracking-[0.2em]
text-xs
glow-cyan
disabled:opacity-50
"
              >
                {status === "loading" ? "VERIFYING CHANNEL..." : "OPEN CHANNEL →"}
              </button>
            </div>
          </motion.form>

          <motion.div
            className="
glass-strong
rounded-2xl
p-6
space-y-3
"
          >
            <div
              className="
font-mono
text-[10px]
tracking-widest
text-muted-foreground
"
            >
              CONNECTED_NODES
            </div>

            {socials.map((s) => (
              <a
                key={s.label}

                href={s.url}

                target="_blank"

                rel="noreferrer"

                className="
block
p-5
rounded-xl
border
border-border
hover:bg-white/3
transition
"
              >
                <div
                  className="
font-display
text-lg
"
                >
                  {s.label}
                </div>

                <div
                  className="
text-xs
text-muted-foreground
"
                >
                  {s.handle}
                </div>
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SystemItem({
  name,

  value,
}: {
  name: string;

  value: string;
}) {
  return (
    <div>
      <div
        className="
text-[10px]
text-muted-foreground
"
      >
        {name}
      </div>

      <div
        className="
text-[oklch(0.85_0.18_195)]
"
      >
        {value}
      </div>
    </div>
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
      <label
        className="
text-[oklch(0.85_0.18_195)]
block
mb-1
"
      >
        {label}
      </label>

      <input
        required

        type={type}

        value={value}

        onChange={(e) => setValue(e.target.value)}

        placeholder={placeholder}

        className="
w-full
bg-transparent
border-b
border-border
outline-none
py-2
"
      />
    </div>
  );
}
