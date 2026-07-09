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
| Visitor Email Verification
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
  const verifyUrl = `${process.env.SITE_URL}/verify-contact?token=${token}`;

  await transporter.sendMail({
    from: `"SHREYANSH.SYS Security" <${process.env.SMTP_EMAIL}>`,

    to: email,

    subject: "Verify your email — SHREYANSH.SYS",

    html: `

      <div style="
        font-family:Arial,sans-serif;
        background:#05070a;
        color:white;
        padding:32px;
      ">

        <h1>
          SHREYANSH.SYS
        </h1>


        <p>
          Hello ${name},
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
          text-decoration:none;
          border-radius:8px;
          font-weight:bold;
          "
        >

          Verify Email

        </a>


        <p style="color:#aaa">

          This verification link expires soon.

        </p>

      </div>

    `,

    headers: {
      "X-Entity-Type": "Portfolio Contact Verification",
    },
  });
}

/*
|--------------------------------------------------------------------------
| Send Verified Message To Owner
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
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.SMTP_EMAIL}>`,

    to: process.env.OWNER_EMAIL,

    replyTo: email,

    subject: subject ? `Portfolio Contact: ${subject}` : `New verified message from ${name}`,

    html: `

    <div style="
      font-family:Arial,sans-serif;
      padding:24px;
    ">


      <h2>
        New Verified Contact Message
      </h2>



      <p>
        <b>Name:</b> ${name}
      </p>



      <p>
        <b>Email:</b> ${email}
      </p>



      <hr />



      <p>

      ${message}

      </p>


    </div>

    `,
  });
}
