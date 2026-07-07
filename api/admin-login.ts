import "dotenv/config";

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { authenticator } from "@otplib/preset-default";

if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_TOTP_SECRET || !process.env.JWT_SECRET) {
  throw new Error("ADMIN SECURITY CONFIG MISSING");
}

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

type AttemptRecord = {
  count: number;
  firstAttempt: number;
  lockedUntil: number | null;
};

// In-memory, per-instance. Resets on cold start/redeploy — acceptable for a
// single-admin portfolio; move to Neon/Redis if this ever needs multi-instance
// consistency or attempt history.
const attempts = new Map<string, AttemptRecord>();

function getClientIp(req: any): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket?.remoteAddress ?? "unknown";
}

function getRecord(ip: string): AttemptRecord {
  const now = Date.now();
  const existing = attempts.get(ip);

  if (!existing || now - existing.firstAttempt > ATTEMPT_WINDOW_MS) {
    const fresh: AttemptRecord = { count: 0, firstAttempt: now, lockedUntil: null };
    attempts.set(ip, fresh);
    return fresh;
  }

  return existing;
}

function registerFailure(ip: string) {
  if (attempts.size > 1000) attempts.clear();

  const record = getRecord(ip);
  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }

  attempts.set(ip, record);
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

function secureCompare(input: string, secret: string) {
  const inputHash = crypto.createHash("sha256").update(input).digest();
  const secretHash = crypto.createHash("sha256").update(secret).digest();
  return crypto.timingSafeEqual(inputHash, secretHash);
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "METHOD_NOT_ALLOWED" });
  }

  const ip = getClientIp(req);
  const record = getRecord(ip);

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const retryAfter = Math.ceil((record.lockedUntil - Date.now()) / 1000);
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({
      success: false,
      error: "TOO_MANY_ATTEMPTS",
      retryAfter,
    });
  }

  try {
    const password = String(req.body?.password ?? "").trim();
    const code = String(req.body?.code ?? "").trim();

    if (password.length > 200 || !/^\d{6}$/.test(code)) {
      registerFailure(ip);
      return res.status(401).json({ success: false, error: "ACCESS_DENIED" });
    }

    const passwordValid = secureCompare(password, process.env.ADMIN_PASSWORD!);

    const totpValid = authenticator.verify({
      token: code,
      secret: process.env.ADMIN_TOTP_SECRET!,
    });

    if (!passwordValid || !totpValid) {
      registerFailure(ip);
      return res.status(401).json({ success: false, error: "ACCESS_DENIED" });
    }

    clearAttempts(ip);

    const token = jwt.sign({ role: "admin", system: "SHREYANSH.SYS" }, process.env.JWT_SECRET!, {
      expiresIn: "30m",
      issuer: "portfolio-admin",
      audience: "admin-console",
    });

    return res.status(200).json({ success: true, token, expiresIn: 1800 });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ success: false, error: "LOGIN_FAILED" });
  }
}
