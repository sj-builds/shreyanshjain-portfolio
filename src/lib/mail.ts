import nodemailer from "nodemailer";

/*
|--------------------------------------------------------------------------
| Environment Validation
|--------------------------------------------------------------------------
*/

const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_EMAIL",
  "SMTP_PASSWORD",
  "OWNER_EMAIL",
  "SITE_URL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing mail environment variable: ${key}`);
  }
}

/*
|--------------------------------------------------------------------------
| HTML Sanitization
|--------------------------------------------------------------------------
*/

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/*
|--------------------------------------------------------------------------
| Gmail SMTP Transport
|--------------------------------------------------------------------------
*/

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,

  port: Number(process.env.SMTP_PORT),

  secure: true,

  auth: {
    user: process.env.SMTP_EMAIL,

    pass: process.env.SMTP_PASSWORD,
  },

  pool: true,

  maxConnections: 5,

  maxMessages: 100,
});

/*
|--------------------------------------------------------------------------
| Verify SMTP Connection
|--------------------------------------------------------------------------
*/

export async function verifyMailConnection() {
  try {
    await transporter.verify();

    return true;
  } catch (error) {
    console.error("SMTP Connection Failed:", error);

    return false;
  }
}

/*
|--------------------------------------------------------------------------
| Send Visitor Verification Link
|--------------------------------------------------------------------------
*/

export async function sendVerificationEmail({
  email,
  name,
  token,
}: {
  email: string;
  name: string;
  token: string;
}) {
  const safeName = escapeHtml(name);

  const verifyUrl = `${process.env.SITE_URL}/verify-contact?token=${token}`;

  await transporter.sendMail({
    from: `"SHREYANSH.SYS Security" <${process.env.SMTP_EMAIL}>`,

    to: email,

    subject: "Verify your email — SHREYANSH.SYS",

    html: `

<div style="
background:#05070a;
color:white;
padding:32px;
font-family:Arial,sans-serif;
">

<h1 style="color:#00e5ff">
SHREYANSH.SYS
</h1>


<p>
Hello <b>${safeName}</b>,
</p>


<p>
Confirm your email address to securely deliver your message.
</p>


<a href="${verifyUrl}"
style="
display:inline-block;
background:#00e5ff;
color:#000;
padding:12px 20px;
border-radius:8px;
font-weight:bold;
text-decoration:none;
">

Verify Email

</a>


<p style="color:#aaa">
This verification link expires automatically.
</p>


</div>

`,

    headers: {
      "X-Entity-Type": "Portfolio Verification",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Send Message To Owner
|--------------------------------------------------------------------------
*/

export async function sendContactNotification({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  const safeName = escapeHtml(name);

  const safeEmail = escapeHtml(email);

  const safeMessage = escapeHtml(message);

  await transporter.sendMail({
    from: `"SHREYANSH.SYS Contact" <${process.env.SMTP_EMAIL}>`,

    to: process.env.OWNER_EMAIL,

    replyTo: email,

    subject: subject
      ? `Portfolio Contact: ${subject}`
      : `New verified message from ${name}`,

    html: `

<div style="
background:#05070a;
color:white;
padding:32px;
font-family:Arial;
">


<h2 style="color:#00e5ff">

New Verified Transmission

</h2>


<p>
<b>Name:</b> ${safeName}
</p>


<p>
<b>Email:</b> ${safeEmail}
</p>


<hr/>


<p style="
white-space:pre-line;
line-height:1.7;
">

${safeMessage}

</p>


<br/>


<small style="color:#aaa">

Stored securely inside SHREYANSH.SYS

</small>


</div>

`,
  });
}

/*
|--------------------------------------------------------------------------
| Visitor Confirmation After Verification
|--------------------------------------------------------------------------
*/

export async function sendVisitorConfirmation({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const safeName = escapeHtml(name);

  await transporter.sendMail({
    from: `"SHREYANSH.SYS" <${process.env.SMTP_EMAIL}>`,

    to: email,

    subject: "Transmission Verified — SHREYANSH.SYS",

    html: `

<div style="
background:#05070a;
color:white;
padding:32px;
font-family:Arial;
">


<h2 style="color:#00e5ff">

Transmission Verified

</h2>


<p>

Hello <b>${safeName}</b>,

</p>


<p>

Your message successfully reached my secure contact channel.

</p>


<p>

Response window: usually within 24 hours.

</p>


<br/>


<small style="color:#aaa">

SHREYANSH.SYS Secure Gateway

</small>


</div>

`,
  });
}