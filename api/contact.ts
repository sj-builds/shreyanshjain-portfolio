import "dotenv/config";

import nodemailer from "nodemailer";
import { z } from "zod";
import { waitUntil } from "@vercel/functions";

import { prisma } from "./lib/prisma.js";

if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD || !process.env.OWNER_EMAIL) {
  throw new Error("EMAIL ENV VARIABLES MISSING");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",

  port: 465,

  secure: true,

  auth: {
    user: process.env.SMTP_EMAIL,

    pass: process.env.SMTP_PASSWORD,
  },

  pool: true,

  maxConnections: 5,

  maxMessages: 100,
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(50),

  email: z.string().trim().toLowerCase().email(),

  subject: z.string().trim().max(100).optional(),

  message: z.string().trim().min(10).max(1000),
});

function escapeHtml(text: string) {
  return text

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}

async function sendEmails(data: { name: string; email: string; message: string }) {
  const safeName = escapeHtml(data.name);

  const safeEmail = escapeHtml(data.email);

  const safeMessage = escapeHtml(data.message);

  await Promise.all([
    /*
      MAIL TO YOU
    */

    transporter.sendMail({
      from: `"SHREYANSH.SYS Contact" <${process.env.SMTP_EMAIL}>`,

      to: process.env.OWNER_EMAIL,

      replyTo: data.email,

      subject: `New Portfolio Message - ${data.name}`,

      html: `

<div style="
background:#05070a;
color:white;
padding:32px;
font-family:Arial;
">


<h2 style="
color:#00e5ff;
">

New Secure Transmission

</h2>


<p>
<b>Name:</b> ${safeName}
</p>


<p>
<b>Email:</b> ${safeEmail}
</p>


<hr>


<p style="
white-space:pre-line;
line-height:1.7;
">

${safeMessage}

</p>


<br>


<small>

Saved securely inside SHREYANSH.SYS database.

</small>


</div>

`,
    }),

    /*
      CONFIRMATION TO VISITOR
    */

    transporter.sendMail({
      from: `"SHREYANSH.SYS" <${process.env.SMTP_EMAIL}>`,

      to: data.email,

      subject: "Transmission Received - SHREYANSH.SYS",

      html: `

<div style="
background:#05070a;
color:white;
padding:32px;
font-family:Arial;
">


<h2 style="
color:#00e5ff;
">

Transmission Confirmed

</h2>


<p>

Hello <b>${safeName}</b>,

</p>


<p>

Your message reached my secure contact system.

</p>



<div style="
background:#101722;
padding:20px;
border-radius:12px;
">

${safeMessage}

</div>



<br>


<small>

Response window: usually within 24 hours.

</small>


</div>

`,
    }),
  ]);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,

      error: "METHOD_NOT_ALLOWED",
    });
  }

  try {
    const data = contactSchema.parse(req.body);

    /*
      REQUIRED OPERATION

      Visitor waits only for this
    */

    const savedMessage = await prisma.message.create({
      data: {
        name: data.name,

        email: data.email,

        subject: data.subject ?? "Portfolio Contact",

        message: data.message,
      },
    });

    /*
      BACKGROUND EMAIL

      Vercel keeps function alive
      after response
    */

    waitUntil(
      sendEmails(data)
        .then(() => {
          console.log("EMAILS SENT");
        })

        .catch((error) => {
          console.error("EMAIL ERROR:", error);
        }),
    );

    /*
      INSTANT VISITOR SUCCESS
    */

    return res.status(200).json({
      success: true,

      id: savedMessage.id,

      message: "MESSAGE_TRANSMITTED",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,

        error: "INVALID_INPUT",
      });
    }

    console.error("CONTACT ERROR:", error);

    return res.status(500).json({
      success: false,

      error: "TRANSMISSION_FAILED",
    });
  }
}
