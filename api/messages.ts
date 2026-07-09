import "dotenv/config";

import type { VercelRequest, VercelResponse } from "@vercel/node";

import jwt from "jsonwebtoken";

import { prisma } from "./lib/prisma.js";

import { logSecurityEvent, SECURITY_EVENTS } from "../src/lib/security.js";

/*
|--------------------------------------------------------------------------
| Environment Check
|--------------------------------------------------------------------------
*/

if (!process.env.JWT_SECRET) {
  throw new Error("JWT ENV MISSING");
}

/*
|--------------------------------------------------------------------------
| Admin Verification
|--------------------------------------------------------------------------
*/

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
| Messages API
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

  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,

      error: "METHOD_NOT_ALLOWED",
    });
  }

  const admin = verifyAdmin(req);

  if (!admin) {
    await logSecurityEvent({
      event: SECURITY_EVENTS.ADMIN_ACTION,

      metadata: {
        action: "FAILED_MESSAGES_ACCESS",

        endpoint: "/api/messages",
      },
    });

    return res.status(401).json({
      success: false,

      error: "UNAUTHORIZED",
    });
  }

  try {
    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const page = Math.max(
      Number(req.query.page ?? 1),

      1,
    );

    const limit = Math.min(
      Number(req.query.limit ?? 50),

      100,
    );

    const skip = (page - 1) * limit;

    /*
    |--------------------------------------------------------------------------
    | Query Filter
    |--------------------------------------------------------------------------
    */

    const filter = {
      verified: true,

      archived: false,
    };

    const [messages, total, unread] = await Promise.all([
      prisma.message.findMany({
        where: filter,

        orderBy: {
          createdAt: "desc",
        },

        skip,

        take: limit,

        select: {
          id: true,

          name: true,

          email: true,

          subject: true,

          message: true,

          createdAt: true,

          verifiedAt: true,

          read: true,
        },
      }),

      prisma.message.count({
        where: filter,
      }),

      prisma.message.count({
        where: {
          ...filter,

          read: false,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,

      pagination: {
        page,

        limit,

        pages: Math.ceil(total / limit),
      },

      stats: {
        total,

        unread,
      },

      count: messages.length,

      messages,
    });
  } catch (error) {
    console.error(
      "MESSAGES ERROR:",

      error,
    );

    return res.status(500).json({
      success: false,

      error: "FETCH_FAILED",
    });
  }
}
