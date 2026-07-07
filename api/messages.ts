import "dotenv/config";

import jwt from "jsonwebtoken";

import { prisma } from "./lib/prisma";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT ENV MISSING");
}

function verifyAdmin(req: any) {
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
      },
    );
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
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
    return res.status(401).json({
      success: false,

      error: "UNAUTHORIZED",
    });
  }

  try {
    /*
      Parallel execution

      faster than:
      query
       ↓
      count
       ↓
      unread
    */

    const [messages, total, unread] = await Promise.all([
      prisma.message.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 100,

        select: {
          id: true,

          name: true,

          email: true,

          subject: true,

          message: true,

          createdAt: true,

          read: true,
        },
      }),

      prisma.message.count(),

      prisma.message.count({
        where: {
          read: false,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,

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
