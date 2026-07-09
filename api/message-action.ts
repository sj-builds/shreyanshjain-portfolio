import "dotenv/config";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import jwt from "jsonwebtoken";

import { z } from "zod";

import { prisma } from "./lib/prisma.js";

import { logSecurityEvent, SECURITY_EVENTS } from "../src/lib/security";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT ENV MISSING");
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function getClientIp(req: VercelRequest) {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.socket.remoteAddress ?? "unknown";
}

function verifyAdmin(req: VercelRequest) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7);

  try {
    return jwt.verify(
      token,

      process.env.JWT_SECRET!,

      {
        issuer: "portfolio-admin",

        audience: "admin-console",
      },
    );
  } catch {
    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const actionSchema = z.object({
  id: z.string().cuid(),

  action: z.enum(["archive", "toggle-read"]),
});

/*
|--------------------------------------------------------------------------
| Handler
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

  const admin = verifyAdmin(req);

  if (!admin) {
    await logSecurityEvent({
      event: SECURITY_EVENTS.ADMIN_ACTION,

      ipAddress: ip,

      metadata: {
        action: "FAILED_MESSAGE_ACTION",
      },
    });

    return res.status(401).json({
      success: false,

      error: "UNAUTHORIZED",
    });
  }

  const parsed = actionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,

      error: "INVALID_REQUEST",
    });
  }

  const {
    id,

    action,
  } = parsed.data;

  try {
    const message = await prisma.message.findFirst({
      where: {
        id,

        verified: true,

        archived: false,
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,

        error: "MESSAGE_NOT_FOUND",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Archive Message
    |--------------------------------------------------------------------------
    */

    if (action === "archive") {
      await prisma.message.update({
        where: { id },

        data: {
          archived: true,
        },
      });

      await logSecurityEvent({
        event: SECURITY_EVENTS.ADMIN_ACTION,

        email: message.email,

        ipAddress: ip,

        metadata: {
          action: "ARCHIVED_MESSAGE",

          messageId: id,
        },
      });

      return res.status(200).json({
        success: true,

        action: "ARCHIVED",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Toggle Read
    |--------------------------------------------------------------------------
    */

    const updated = await prisma.message.update({
      where: { id },

      data: {
        read: !message.read,
      },

      select: {
        read: true,
      },
    });

    await logSecurityEvent({
      event: SECURITY_EVENTS.ADMIN_ACTION,

      ipAddress: ip,

      metadata: {
        action: "TOGGLE_READ",

        messageId: id,
      },
    });

    return res.status(200).json({
      success: true,

      action: "UPDATED",

      read: updated.read,
    });
  } catch (error) {
    console.error(
      "MESSAGE ACTION ERROR:",

      error,
    );

    return res.status(500).json({
      success: false,

      error: "ACTION_FAILED",
    });
  }
}
