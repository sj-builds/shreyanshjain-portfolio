import type { VercelRequest, VercelResponse } from "@vercel/node";

import { prisma } from "./lib/prisma.js";

import { hashToken, secureCompare, isExpired } from "../src/lib/token";

import { sendContactNotification } from "../src/lib/mail";

import { logSecurityEvent, SECURITY_EVENTS } from "../src/lib/security";

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
    | Timing Safe Verification
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
    | Verify Message
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
    | Send Message To Owner
    |--------------------------------------------------------------------------
    */

    await sendContactNotification({
      name: verifiedMessage.name,

      email: verifiedMessage.email,

      subject: verifiedMessage.subject,

      message: verifiedMessage.message,
    });

    await logSecurityEvent({
      event: SECURITY_EVENTS.EMAIL_VERIFIED,

      email: verifiedMessage.email,

      metadata: {
        messageId: verifiedMessage.id,
      },
    });

    return res.status(200).send(`

      <html>

      <body style="
      background:#05070a;
      color:white;
      font-family:Arial;
      display:flex;
      height:100vh;
      align-items:center;
      justify-content:center;
      ">


      <div>


      <h1>

      Email Verified ✓

      </h1>


      <p>

      Your message has been securely delivered.

      </p>


      </div>


      </body>


      </html>

    `);
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
