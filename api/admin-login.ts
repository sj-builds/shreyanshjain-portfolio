import "dotenv/config";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { authenticator } from "@otplib/preset-default";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { logSecurityEvent, SECURITY_EVENTS } from "../src/lib/security";

/*
|--------------------------------------------------------------------------
| Environment Check
|--------------------------------------------------------------------------
*/

if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_TOTP_SECRET || !process.env.JWT_SECRET) {
  throw new Error("ADMIN SECURITY CONFIG MISSING");
}

/*
|--------------------------------------------------------------------------
| Brute Force Protection Config
|--------------------------------------------------------------------------
*/

const MAX_ATTEMPTS = 5;

const LOCK_DURATION_MS = 15 * 60 * 1000;

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;

type AttemptRecord = {
  count: number;

  firstAttempt: number;

  lockedUntil: number | null;
};

/*
|--------------------------------------------------------------------------
| In-memory protection
|
| Single admin portfolio system.
|--------------------------------------------------------------------------
*/

const attempts = new Map<string, AttemptRecord>();

/*
|--------------------------------------------------------------------------
| Get Client IP
|--------------------------------------------------------------------------
*/

function getClientIp(req: VercelRequest) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress ?? "unknown";
}

/*
|--------------------------------------------------------------------------
| Attempts Store
|--------------------------------------------------------------------------
*/

function getRecord(ip: string): AttemptRecord {
  const now = Date.now();

  const existing = attempts.get(ip);

  if (!existing || now - existing.firstAttempt > ATTEMPT_WINDOW_MS) {
    const fresh = {
      count: 0,

      firstAttempt: now,

      lockedUntil: null,
    };

    attempts.set(ip, fresh);

    return fresh;
  }

  return existing;
}

function registerFailure(ip: string) {
  if (attempts.size > 1000) {
    attempts.clear();
  }

  const record = getRecord(ip);

  record.count += 1;

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS;
  }

  attempts.set(
    ip,

    record,
  );
}

function clearAttempts(ip: string) {
  attempts.delete(ip);
}

async function verifyPassword(password: string) {
  return bcrypt.compare(
    password,

    process.env.ADMIN_PASSWORD_HASH!,
  );
}

/*
|--------------------------------------------------------------------------
| Admin Login Handler
|--------------------------------------------------------------------------
*/

export default async function handler(
  req: VercelRequest,

  res: VercelResponse,
) {
  res.setHeader(
    "Cache-Control",

    "no-store",
  );

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,

      error: "METHOD_NOT_ALLOWED",
    });
  }

  const ip = getClientIp(req);

  const record = getRecord(ip);

  /*
  |--------------------------------------------------------------------------
  | Lock Check
  |--------------------------------------------------------------------------
  */

  if (record.lockedUntil && Date.now() < record.lockedUntil) {
    const retryAfter = Math.ceil((record.lockedUntil - Date.now()) / 1000);

    res.setHeader(
      "Retry-After",

      String(retryAfter),
    );

    return res.status(429).json({
      success: false,

      error: "TOO_MANY_ATTEMPTS",

      retryAfter,
    });
  }

  try {
    const password = String(req.body?.password ?? "").trim();

    const code = String(req.body?.code ?? "").trim();

    /*
    |--------------------------------------------------------------------------
    | Basic Input Protection
    |--------------------------------------------------------------------------
    */

    if (password.length > 200 || !/^\d{6}$/.test(code)) {
      registerFailure(ip);

      await logSecurityEvent({
        event: SECURITY_EVENTS.ADMIN_ACTION,

        ipAddress: ip,

        metadata: {
          action: "INVALID_ADMIN_INPUT",
        },
      });

      return res.status(401).json({
        success: false,

        error: "ACCESS_DENIED",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verify Credentials
    |--------------------------------------------------------------------------
    */

    const passwordValid = await verifyPassword(password);

    const totpValid = authenticator.verify({
      token: code,

      secret: process.env.ADMIN_TOTP_SECRET!,
    });

    if (!passwordValid || !totpValid) {
      registerFailure(ip);

      await logSecurityEvent({
        event: SECURITY_EVENTS.ADMIN_ACTION,

        ipAddress: ip,

        metadata: {
          action: "FAILED_ADMIN_LOGIN",
        },
      });

      return res.status(401).json({
        success: false,

        error: "ACCESS_DENIED",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Successful Login
    |--------------------------------------------------------------------------
    */

    clearAttempts(ip);

    const token = jwt.sign(
      {
        sub: "admin",

        role: "admin",

        system: "SHREYANSH.SYS",

        jti: crypto.randomUUID(),
      },

      process.env.JWT_SECRET!,

      {
        expiresIn: "30m",

        issuer: "portfolio-admin",

        audience: "admin-console",
      },
    );

    await logSecurityEvent({
      event: SECURITY_EVENTS.ADMIN_ACTION,

      ipAddress: ip,

      metadata: {
        action: "SUCCESSFUL_ADMIN_LOGIN",
      },
    });

    return res.status(200).json({
      success: true,

      token,

      expiresIn: 1800,
    });
  } catch (error) {
    console.error(
      "ADMIN LOGIN ERROR:",

      error,
    );

    return res.status(500).json({
      success: false,

      error: "LOGIN_FAILED",
    });
  }
}
