import "dotenv/config";

import jwt from "jsonwebtoken";

import { prisma } from "./lib/prisma.js";

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

  if (req.method !== "POST") {
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

  const id = String(req.body?.id ?? "").trim();

  const action = String(req.body?.action ?? "").trim();

  if (!id || !["delete", "toggle-read"].includes(action)) {
    return res.status(400).json({
      success: false,

      error: "INVALID_REQUEST",
    });
  }

  try {
    /*
      DELETE MESSAGE

      deleteMany avoids throwing
      if already deleted
    */

    if (action === "delete") {
      const deleted = await prisma.message.deleteMany({
        where: {
          id,
        },
      });

      return res.status(200).json({
        success: true,

        action: "DELETED",

        count: deleted.count,
      });
    }

    /*
      TOGGLE READ STATUS
    */

    const current = await prisma.message.findUnique({
      where: {
        id,
      },

      select: {
        read: true,
      },
    });

    if (!current) {
      return res.status(404).json({
        success: false,

        error: "MESSAGE_NOT_FOUND",
      });
    }

    const updated = await prisma.message.update({
      where: {
        id,
      },

      data: {
        read: !current.read,
      },

      select: {
        read: true,
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
