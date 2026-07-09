import "dotenv/config";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { prisma } from "./lib/prisma.js";

import { sendVerificationEmail } from "../src/lib/mail.js";

import { generateSecureToken, hashToken, createExpiry } from "../src/lib/token.js";

import {
  checkRateLimit,
  detectBot,
  logSecurityEvent,
  sanitizeInput,
  SECURITY_EVENTS,
} from "../src/lib/security.js";

import { contactSchema } from "../src/lib/validation.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,

      error: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const parsed = contactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,

        error: "INVALID_INPUT",
      });
    }

    const data = parsed.data;

    /*
    |--------------------------------------------------------------------------
    | Bot Detection
    |--------------------------------------------------------------------------
    */

    if (detectBot(data.honeypot)) {
      await logSecurityEvent({
        event: SECURITY_EVENTS.BOT_BLOCKED,
      });

      return res.status(403).json({
        success: false,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Client Metadata
    |--------------------------------------------------------------------------
    */

    const ip =
      req.headers["x-forwarded-for"]

        ?.toString()

        .split(",")[0] ?? "unknown";

    const userAgent = req.headers["user-agent"];

    /*
    |--------------------------------------------------------------------------
    | Rate Limit
    |--------------------------------------------------------------------------
    */

    const allowed = await checkRateLimit({
      identifier: ip,
    });

    if (!allowed) {
      await logSecurityEvent({
        event: SECURITY_EVENTS.RATE_LIMIT_BLOCKED,

        ipAddress: ip,
      });

      return res.status(429).json({
        success: false,

        error: "TOO_MANY_REQUESTS",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Verification Token
    |--------------------------------------------------------------------------
    */

    const token = generateSecureToken();

    const tokenHash = hashToken(token);

    /*
    |--------------------------------------------------------------------------
    | Save Pending Message
    |--------------------------------------------------------------------------
    */

    const message = await prisma.message.create({
      data: {
        name: sanitizeInput(data.name),

        email: data.email,

        subject: data.subject ? sanitizeInput(data.subject) : null,

        message: sanitizeInput(data.message),

        verified: false,

        verificationTokenHash: tokenHash,

        verificationExpires: createExpiry(30),

        ipAddress: ip,

        userAgent,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Send Verification
    |--------------------------------------------------------------------------
    */

    await sendVerificationEmail({
      email: data.email,

      name: data.name,

      token,
    });

    await logSecurityEvent({
      event: SECURITY_EVENTS.CONTACT_CREATED,

      email: data.email,

      ipAddress: ip,

      metadata: {
        messageId: message.id,
      },
    });

    return res.status(200).json({
      success: true,

      message: "VERIFY_EMAIL_SENT",
    });
  } catch (error) {
    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,

      error: "SERVER_ERROR",
    });
  }
}
