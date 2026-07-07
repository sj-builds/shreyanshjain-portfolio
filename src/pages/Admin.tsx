import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, EyeOff, LogOut, Search, LockKeyhole } from "lucide-react";
import { CustomCursor } from "@/components/CustomCursor";

const SESSION_DURATION_MS = 30 * 60 * 1000;
const EXPIRY_KEY = "admin-expiry";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  createdAt: string;
  read: boolean;
};

export function Admin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const sessionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearSessionTimer() {
    if (sessionTimer.current) {
      clearTimeout(sessionTimer.current);
      sessionTimer.current = null;
    }
  }

  function armSessionTimer(durationMs = SESSION_DURATION_MS) {
    clearSessionTimer();
    sessionStorage.setItem(EXPIRY_KEY, String(Date.now() + durationMs));
    sessionTimer.current = setTimeout(logout, durationMs);
  }

  function logout() {
    clearSessionTimer();
    sessionStorage.removeItem("admin-token");
    sessionStorage.removeItem(EXPIRY_KEY);
    setAuthenticated(false);
    setMessages([]);
    setError("");
    setPassword("");
    setShowPassword(false);
    setOtp("");
  }

  function checkExpiry() {
    const expiry = Number(sessionStorage.getItem(EXPIRY_KEY));
    if (!expiry) return;
    if (Date.now() >= expiry) logout();
  }

  async function loadMessages(): Promise<boolean> {
    setLoading(true);

    try {
      const token = sessionStorage.getItem("admin-token");

      if (!token) {
        logout();
        return false;
      }

      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        logout();
        return false;
      }

      const data = await res.json();

      if (!data.success) {
        logout();
        return false;
      }

      setMessages(data.messages ?? []);
      return true;
    } catch {
      logout();
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function verifySession() {
      const token = sessionStorage.getItem("admin-token");

      if (!token) {
        setChecking(false);
        return;
      }

      const expiry = Number(sessionStorage.getItem(EXPIRY_KEY));
      const remaining = expiry - Date.now();

      if (expiry && remaining <= 0) {
        logout();
        setChecking(false);
        return;
      }

      const valid = await loadMessages();
      setAuthenticated(valid);
      if (valid) armSessionTimer(expiry ? remaining : SESSION_DURATION_MS);
      setChecking(false);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") checkExpiry();
    }

    verifySession();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearSessionTimer();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  async function login() {
    if (processing) return;

    setError("");

    if (password.length === 0 || otp.length !== 6) {
      setError("INVALID_SECURITY_INPUT");
      return;
    }

    try {
      setProcessing(true);

      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, code: otp }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("ACCESS_DENIED");
      }

      sessionStorage.setItem("admin-token", data.token);

      // clear secrets from memory
      setPassword("");
      setOtp("");

      const loaded = await loadMessages();

      if (loaded) {
        setAuthenticated(true);
        armSessionTimer();
      } else {
        setError("ACCESS_DENIED");
      }
    } catch {
      setError("ACCESS_DENIED");
    } finally {
      setProcessing(false);
    }
  }

  async function messageAction(id: string, action: "delete" | "toggle-read") {
    try {
      const token = sessionStorage.getItem("admin-token");

      if (!token) {
        logout();
        return;
      }

      const res = await fetch("/api/message-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, action }),
      });

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      if (!data.success) return;

      if (action === "delete") {
        setMessages((prev) => prev.filter((item) => item.id !== id));
      }

      if (action === "toggle-read") {
        setMessages((prev) =>
          prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return messages;

    return messages.filter(
      (msg) =>
        (msg.name ?? "").toLowerCase().includes(query) ||
        (msg.email ?? "").toLowerCase().includes(query) ||
        (msg.message ?? "").toLowerCase().includes(query),
    );
  }, [search, messages]);

  if (checking) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center font-mono text-[oklch(0.85_0.18_195)]">
        VERIFYING_SESSION...
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
        <CustomCursor />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-strong border border-border rounded-3xl p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center gap-3 text-[oklch(0.85_0.18_195)]">
            <LockKeyhole size={22} />
            <span className="font-mono text-xs tracking-[0.4em]">ADMIN_GATEWAY</span>
          </div>

          <h1 className="mt-6 text-4xl font-display font-bold">Secure Access</h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Password + Google Authenticator required
          </p>

          <div className="mt-8 space-y-5">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="admin password"
                aria-label="Admin password"
                className="w-full bg-transparent border-b border-border py-3 pr-8 outline-none focus:border-[oklch(0.85_0.18_195)] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <input
              value={otp}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="Google Authenticator code"
              aria-label="Authenticator code"
              className="w-full bg-transparent border-b border-border py-3 outline-none tracking-[0.3em] focus:border-[oklch(0.85_0.18_195)] transition-colors"
            />

            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              disabled={processing}
              onClick={login}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[oklch(0.85_0.18_195)] to-[oklch(0.72_0.22_295)] text-background tracking-[0.25em] text-xs glow-cyan disabled:opacity-50 transition"
            >
              {processing ? "VERIFYING..." : "UNLOCK SYSTEM"}
            </button>
          </div>
        </motion.div>
      </main>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <CustomCursor />

      <div className="mx-auto max-w-6xl">
        <header className="flex justify-between gap-6 flex-wrap">
          <div>
            <p className="font-mono text-xs tracking-[0.4em] text-[oklch(0.85_0.18_195)]">
              MESSAGE_CENTER
            </p>

            <h1 className="mt-3 text-5xl font-display font-bold">Admin Console</h1>

            <p className="mt-3 text-muted-foreground">
              {messages.length} transmissions · {unreadCount} unread
            </p>

            <div className="mt-2 flex flex-wrap gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              <span className="border border-border rounded-full px-3 py-1">
                SECURE_SESSION_ACTIVE
              </span>
              <span className="border border-border rounded-full px-3 py-1">TOTP_PROTECTED</span>
              <span className="border border-border rounded-full px-3 py-1">JWT_30M</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 border border-border px-5 py-2 rounded-xl hover:bg-white/5 h-fit transition-colors"
          >
            <LogOut size={16} />
            LOGOUT
          </button>
        </header>

        <div className="mt-10 flex items-center gap-3 border-b border-border">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transmissions..."
            aria-label="Search transmissions"
            className="flex-1 bg-transparent py-3 outline-none"
          />
        </div>

        <section className="mt-10 space-y-5">
          {loading && <p>Loading transmissions...</p>}

          {!loading && filtered.length === 0 && (
            <p className="text-muted-foreground">No transmissions found.</p>
          )}

          {filtered.map((msg) => (
            <motion.article
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-strong border border-border rounded-2xl p-6"
            >
              <div className="flex justify-between gap-5 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-semibold">{msg.name}</h2>
                    <span
                      className={`text-[10px] font-mono px-3 py-1 rounded-full border ${
                        msg.read
                          ? "border-border text-muted-foreground"
                          : "border-[oklch(0.85_0.18_195/0.5)] text-[oklch(0.85_0.18_195)]"
                      }`}
                    >
                      {msg.read ? "READ" : "NEW"}
                    </span>
                  </div>

                  <a href={`mailto:${msg.email}`} className="text-[oklch(0.85_0.18_195)]">
                    {msg.email}
                  </a>
                </div>

                <span className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </span>
              </div>

              <p className="mt-6 leading-7 text-muted-foreground">{msg.message}</p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => messageAction(msg.id, "toggle-read")}
                  className="border border-border rounded-lg px-4 py-2 flex gap-2 items-center hover:bg-white/5 transition-colors"
                >
                  <Eye size={15} />
                  {msg.read ? "MARK UNREAD" : "MARK READ"}
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete transmission?")) {
                      messageAction(msg.id, "delete");
                    }
                  }}
                  className="border border-red-500/40 text-red-400 rounded-lg px-4 py-2 flex gap-2 items-center hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                  DELETE
                </button>
              </div>
            </motion.article>
          ))}
        </section>
      </div>
    </main>
  );
}
