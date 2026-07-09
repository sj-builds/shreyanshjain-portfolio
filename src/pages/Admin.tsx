import { useEffect, useMemo, useRef, useState } from "react";

import { motion } from "framer-motion";

import { Archive, Eye, EyeOff, LogOut, Search, RefreshCcw, ShieldCheck } from "lucide-react";

import { CustomCursor } from "@/components/CustomCursor";

const TOKEN_KEY = "admin-token";

const EXPIRY_KEY = "admin-expiry";

const DEFAULT_SESSION_MS = 30 * 60 * 1000;

type Message = {
  id: string;

  name: string;

  email: string;

  subject: string | null;

  message: string;

  createdAt: string;

  verifiedAt: string | null;

  read: boolean;
};

type Stats = {
  total: number;

  unread: number;
};

export function Admin() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [stats, setStats] = useState<Stats>({
    total: 0,
    unread: 0,
  });

  const [authenticated, setAuthenticated] = useState(false);

  const [checking, setChecking] = useState(true);

  const [loading, setLoading] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timer.current) {
      clearTimeout(timer.current);

      timer.current = null;
    }
  }

  function logout() {
    clearTimer();

    sessionStorage.removeItem(TOKEN_KEY);

    sessionStorage.removeItem(EXPIRY_KEY);

    setAuthenticated(false);

    setMessages([]);

    setStats({
      total: 0,
      unread: 0,
    });

    setPassword("");

    setOtp("");
  }

  function startSession(duration = DEFAULT_SESSION_MS) {
    clearTimer();

    sessionStorage.setItem(
      EXPIRY_KEY,

      String(Date.now() + duration),
    );

    timer.current = setTimeout(
      logout,

      duration,
    );
  }

  async function loadMessages() {
    setLoading(true);

    try {
      const token = sessionStorage.getItem(TOKEN_KEY);

      if (!token) {
        logout();

        return false;
      }

      const res = await fetch(
        "/api/messages",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

      setStats(
        data.stats ?? {
          total: 0,

          unread: 0,
        },
      );

      return true;
    } catch {
      logout();

      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function restore() {
      const token = sessionStorage.getItem(TOKEN_KEY);

      const expiry = Number(sessionStorage.getItem(EXPIRY_KEY));

      if (!token || !expiry) {
        setChecking(false);

        return;
      }

      const remaining = expiry - Date.now();

      if (remaining <= 0) {
        logout();

        setChecking(false);

        return;
      }

      const ok = await loadMessages();

      if (ok) {
        setAuthenticated(true);

        startSession(remaining);
      }

      setChecking(false);
    }

    restore();

    return () => clearTimer();
  }, []);

  async function login() {
    if (processing) return;

    setError("");

    if (!password || otp.length !== 6) {
      setError("INVALID_SECURITY_INPUT");

      return;
    }

    try {
      setProcessing(true);

      const res = await fetch(
        "/api/admin-login",

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            password,

            code: otp,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error();
      }

      sessionStorage.setItem(
        TOKEN_KEY,

        data.token,
      );

      setPassword("");

      setOtp("");

      const ok = await loadMessages();

      if (ok) {
        setAuthenticated(true);

        startSession((data.expiresIn ?? 1800) * 1000);
      }
    } catch {
      setError("ACCESS_DENIED");
    } finally {
      setProcessing(false);
    }
  }

  async function messageAction(
    id: string,

    action: "archive" | "toggle-read",
  ) {
    const token = sessionStorage.getItem(TOKEN_KEY);

    if (!token) {
      logout();

      return;
    }

    const res = await fetch(
      "/api/message-action",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          id,

          action,
        }),
      },
    );

    if (res.status === 401) {
      logout();

      return;
    }

    const data = await res.json();

    if (!data.success) return;

    if (action === "archive") {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }

    if (action === "toggle-read") {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,

                read: !m.read,
              }
            : m,
        ),
      );
    }

    loadMessages();
  }

  const filtered = useMemo(() => {
    const q = search

      .trim()

      .toLowerCase();

    if (!q) return messages;

    return messages.filter(
      (m) =>
        m.name

          .toLowerCase()

          .includes(q) ||
        m.email

          .toLowerCase()

          .includes(q) ||
        m.message

          .toLowerCase()

          .includes(q),
    );
  }, [messages, search]);
  if (checking) {
    return (
      <div
        className="
min-h-screen
grid
place-items-center
bg-background
text-foreground
font-mono
"
      >
        INITIALIZING SECURE CONSOLE...
      </div>
    );
  }

  /*
|--------------------------------------------------------------------------
| LOGIN UI
|--------------------------------------------------------------------------
*/

  if (!authenticated) {
    return (
      <>
        <CustomCursor />

        <main
          className="
min-h-screen
grid
place-items-center
bg-background
px-6
"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
            }}

            animate={{
              opacity: 1,
              scale: 1,
            }}

            className="
glass-strong
w-full
max-w-md
rounded-2xl
p-8
space-y-6
"
          >
            <div>
              <div
                className="
flex
items-center
gap-2
font-mono
text-xs
tracking-widest
text-muted-foreground
"
              >
                <ShieldCheck size={14} />
                ADMIN_GATEWAY
              </div>

              <h1
                className="
mt-3
font-display
text-3xl
"
              >
                Secure Console
              </h1>
            </div>

            <div className="space-y-4">
              <input
                type={showPassword ? "text" : "password"}

                value={password}

                onChange={(e) => setPassword(e.target.value)}

                placeholder="master password"

                className="
w-full
bg-transparent
border-b
border-border
py-3
outline-none
"
              />

              <div
                className="
flex
gap-3
"
              >
                <input
                  value={otp}

                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}

                  maxLength={6}

                  placeholder="2FA CODE"

                  className="
flex-1
bg-transparent
border-b
border-border
py-3
outline-none
"
                />

                <button
                  type="button"

                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="
text-sm
text-red-400
"
              >
                {error}
              </p>
            )}

            <button
              onClick={login}

              disabled={processing}

              className="
w-full
rounded-xl
py-3
bg-white
text-black
font-mono
disabled:opacity-50
"
            >
              {processing ? "VERIFYING..." : "AUTHENTICATE"}
            </button>
          </motion.div>
        </main>
      </>
    );
  }

  /*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

  return (
    <>
      <CustomCursor />

      <main
        className="
min-h-screen
bg-background
text-foreground
p-8
"
      >
        <div
          className="
max-w-7xl
mx-auto
space-y-8
"
        >
          <header
            className="
flex
justify-between
items-center
"
          >
            <div>
              <p
                className="
font-mono
text-xs
text-muted-foreground
"
              >
                SHREYANSH.SYS
              </p>

              <h1
                className="
font-display
text-4xl
"
              >
                Message Console
              </h1>
            </div>

            <div
              className="
flex
gap-3
"
            >
              <button
                onClick={loadMessages}

                className="
glass
p-3
rounded-xl
"
              >
                <RefreshCcw size={18} />
              </button>

              <button
                onClick={logout}

                className="
glass
p-3
rounded-xl
"
              >
                <LogOut size={18} />
              </button>
            </div>
          </header>

          <div
            className="
grid
sm:grid-cols-2
gap-4
"
          >
            <div className="glass rounded-xl p-5">
              <div className="text-sm text-muted-foreground">TOTAL</div>

              <div className="text-3xl">{stats.total}</div>
            </div>

            <div className="glass rounded-xl p-5">
              <div className="text-sm text-muted-foreground">UNREAD</div>

              <div className="text-3xl">{stats.unread}</div>
            </div>
          </div>

          <div
            className="
glass
rounded-xl
p-4
flex
gap-3
items-center
"
          >
            <Search size={18} />

            <input
              value={search}

              onChange={(e) => setSearch(e.target.value)}

              placeholder="Search transmissions..."

              className="
bg-transparent
outline-none
flex-1
"
            />
          </div>

          <section
            className="
space-y-4
"
          >
            {loading && <p className="font-mono">SYNCING...</p>}

            {filtered.map((msg) => (
              <div
                key={msg.id}

                className="
glass-strong
rounded-xl
p-6
space-y-4
"
              >
                <div
                  className="
flex
justify-between
gap-5
"
                >
                  <div>
                    <h2
                      className="
font-display
text-xl
"
                    >
                      {msg.name}
                    </h2>

                    <p
                      className="
text-sm
text-muted-foreground
"
                    >
                      {msg.email}
                    </p>
                  </div>

                  <div
                    className="
flex
gap-3
"
                  >
                    <button
                      onClick={() =>
                        messageAction(
                          msg.id,

                          "toggle-read",
                        )
                      }
                    >
                      {msg.read ? <EyeOff /> : <Eye />}
                    </button>

                    <button
                      onClick={() =>
                        messageAction(
                          msg.id,

                          "archive",
                        )
                      }
                    >
                      <Archive />
                    </button>
                  </div>
                </div>

                <div
                  className="
font-mono
text-xs
text-muted-foreground
"
                >
                  Verified: {msg.verifiedAt ? new Date(msg.verifiedAt).toLocaleString() : "YES"}
                </div>

                <p
                  className="
leading-relaxed
"
                >
                  {msg.message}
                </p>

                <div
                  className="
text-xs
text-muted-foreground
"
                >
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p
                className="
font-mono
text-muted-foreground
"
              >
                NO TRANSMISSIONS FOUND
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
