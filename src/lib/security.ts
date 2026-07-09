import { prisma } from "../../api/lib/prisma";

/*
|--------------------------------------------------------------------------
| Security Events
|--------------------------------------------------------------------------
*/

export const SECURITY_EVENTS = {
  CONTACT_CREATED: "CONTACT_CREATED",

  EMAIL_VERIFIED: "EMAIL_VERIFIED",

  INVALID_TOKEN: "INVALID_TOKEN",

  RATE_LIMIT_BLOCKED: "RATE_LIMIT_BLOCKED",

  BOT_BLOCKED: "BOT_BLOCKED",

  ADMIN_ACTION: "ADMIN_ACTION",
} as const;

/*
|--------------------------------------------------------------------------
| Security Logger
|--------------------------------------------------------------------------
*/

export async function logSecurityEvent({
  event,

  email,

  ipAddress,

  metadata,
}: {
  event: string;

  email?: string;

  ipAddress?: string;

  metadata?: object;
}) {
  await prisma.securityLog.create({
    data: {
      event,

      email,

      ipAddress,

      metadata,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Rate Limit Checker
|--------------------------------------------------------------------------
*/

export async function checkRateLimit({
  identifier,

  limit = 5,

  windowMinutes = 15,
}: {
  identifier: string;

  limit?: number;

  windowMinutes?: number;
}) {
  const existing = await prisma.rateLimit.findUnique({
    where: {
      identifier,
    },
  });

  const now = new Date();

  if (existing && existing.expiresAt > now) {
    if (existing.attempts >= limit) {
      return false;
    }

    await prisma.rateLimit.update({
      where: {
        identifier,
      },

      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    return true;
  }

  await prisma.rateLimit.upsert({
    where: {
      identifier,
    },

    update: {
      attempts: 1,

      expiresAt: new Date(Date.now() + windowMinutes * 60 * 1000),
    },

    create: {
      identifier,

      attempts: 1,

      expiresAt: new Date(Date.now() + windowMinutes * 60 * 1000),
    },
  });

  return true;
}

/*
|--------------------------------------------------------------------------
| Email Format Validation
|--------------------------------------------------------------------------
*/

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/*
|--------------------------------------------------------------------------
| Basic Input Sanitizer
|--------------------------------------------------------------------------
*/

export function sanitizeInput(value: string) {
  return value

    .trim()

    .replace(/[<>]/g, "");
}

/*
|--------------------------------------------------------------------------
| Honeypot Bot Detection
|--------------------------------------------------------------------------
*/

export function detectBot(honeypot?: string) {
  return Boolean(honeypot && honeypot.length > 0);
}
