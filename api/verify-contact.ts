import type { VercelRequest, VercelResponse } from "@vercel/node";

import { prisma } from "./lib/prisma.js";

import { hashToken, secureCompare, isExpired } from "../src/lib/token.js";

import { sendContactNotification, sendVisitorConfirmation } from "../src/lib/mail.js";

import { logSecurityEvent, SECURITY_EVENTS } from "../src/lib/security.js";

export default async function handler(
  req: VercelRequest,

  res: VercelResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,

      error: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const token = req.query.token;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,

        error: "TOKEN_REQUIRED",
      });
    }

    const tokenHash = hashToken(token);

    const message = await prisma.message.findFirst({
      where: {
        verificationTokenHash: tokenHash,

        verified: false,
      },
    });

    if (!message) {
      await logSecurityEvent({
        event: SECURITY_EVENTS.INVALID_TOKEN,
      });

      return res.status(400).json({
        success: false,

        error: "INVALID_TOKEN",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Timing Safe Check
    |--------------------------------------------------------------------------
    */

    if (
      !message.verificationTokenHash ||
      !secureCompare(
        tokenHash,

        message.verificationTokenHash,
      )
    ) {
      return res.status(400).json({
        success: false,

        error: "TOKEN_MISMATCH",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Expiry Check
    |--------------------------------------------------------------------------
    */

    if (!message.verificationExpires || isExpired(message.verificationExpires)) {
      await logSecurityEvent({
        event: SECURITY_EVENTS.INVALID_TOKEN,

        email: message.email,
      });

      return res.status(410).json({
        success: false,

        error: "TOKEN_EXPIRED",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Database Verification
    |--------------------------------------------------------------------------
    */

    const verifiedMessage = await prisma.message.update({
      where: {
        id: message.id,
      },

      data: {
        verified: true,

        verifiedAt: new Date(),

        verificationTokenHash: null,

        verificationExpires: null,
      },
    });

    /*
    |--------------------------------------------------------------------------
    | Post Verification Emails
    |
    | IMPORTANT:
    | Email failure should NOT undo verification
    |--------------------------------------------------------------------------
    */

    try {
      await Promise.all([
        sendContactNotification({
          name: verifiedMessage.name,

          email: verifiedMessage.email,

          subject: verifiedMessage.subject,

          message: verifiedMessage.message,
        }),

        sendVisitorConfirmation({
          name: verifiedMessage.name,

          email: verifiedMessage.email,
        }),
      ]);
    } catch (emailError) {
      console.error(
        "POST VERIFY EMAIL FAILED:",

        emailError,
      );
    }

    await logSecurityEvent({
      event: SECURITY_EVENTS.EMAIL_VERIFIED,

      email: verifiedMessage.email,

      metadata: {
        messageId: verifiedMessage.id,
      },
    });

    return res.status(200).json({
      success: true,

      message: "EMAIL_VERIFIED",
    });
  } catch (error) {
    console.error(
      "VERIFY ERROR:",

      error,
    );

    return res.status(500).json({
      success: false,

      error: "SERVER_ERROR",
    });
  }
}
