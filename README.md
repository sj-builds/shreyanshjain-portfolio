<div align="center">

# Shreyansh Jain — AI Engineering & Cybersecurity Portfolio

A production-grade developer portfolio engineered as a secure full-stack system with cinematic UI, encrypted contact workflow, admin console, and modern cloud architecture.

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<br />

<p align="center">
  <a href="https://shreyanshjain.vercel.app">
    <img
      src="./preview.gif"
      alt="Portfolio Preview"
      width="100%"
    />
  </a>
</p>

</div>


## Live Website

```text
https://shreyanshjain.vercel.app
```

---

# Overview

**SHREYANSH.SYS** is a futuristic software engineering portfolio built beyond a traditional static website.

It combines a cinematic cybersecurity-inspired interface with real production backend systems including:

- custom secure contact gateway
- email ownership verification
- protected admin dashboard
- database persistence
- audit logging
- authentication security

The project focuses on:

- clean architecture
- security-first engineering
- performance
- maintainability
- premium developer experience


---

# Core Features


## Interface

- Cinematic cyber-inspired experience
- Glassmorphism surfaces
- Terminal-style interactions
- Responsive layouts
- Smooth Framer Motion animations
- Custom cursor system
- Optimized SPA navigation


## Secure Contact Gateway

Custom-built replacement for third-party forms.

Features:

- Visitor message storage
- Email verification before delivery
- Secure verification tokens
- SHA-256 token hashing
- Expiring verification links
- Gmail SMTP delivery
- Visitor confirmation emails
- Owner notification emails


## Admin Console

Private dashboard system:

- Password authentication
- TOTP multi-factor authentication
- JWT protected sessions
- Secure API authorization
- Message management
- Read/archive workflow


## Security Engineering

Implemented:

- Input validation with Zod
- Environment isolation
- HTML escaping
- Token hashing
- Audit logs
- Rate limit database model
- Secure HTTP headers
- Protected API routes


---

# Tech Stack


| Layer | Technology |
|-|-|
| Frontend | React |
| Language | TypeScript |
| Build | Vite |
| Styling | TailwindCSS |
| Animation | Framer Motion |
| Routing | React Router |
| Validation | Zod |
| Backend | Vercel Serverless Functions |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Email | Nodemailer + Gmail SMTP |
| Authentication | JWT + TOTP |
| Deployment | Vercel |


---

# Architecture


```text
Visitor
   |
   |
React Frontend
   |
   |
Vercel Serverless API
   |
   +------------+
   |            |
 Prisma      SMTP
   |            |
 Neon DB     Gmail
```


Main flows:


```text
Contact Submit

User
 ↓
/api/contact
 ↓
Validate Input
 ↓
Store Message
 ↓
Generate Token
 ↓
Send Verification Email


Verification

Email Link
 ↓
/api/verify-contact
 ↓
Hash Token Check
 ↓
Mark Verified
 ↓
Notify Owner
 ↓
Confirm Visitor
```


---

# Folder Structure


```text
.
├── api/
│   ├── contact.ts
│   ├── verify-contact.ts
│   ├── admin-login.ts
│   ├── messages.ts
│   ├── message-action.ts
│   │
│   └── lib/
│       └── prisma.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── lib/
│   │   ├── mail.ts
│   │   ├── security.ts
│   │   ├── token.ts
│   │   └── validation.ts
│   │
│   ├── pages/
│   │   ├── Admin.tsx
│   │   └── VerifyContact.tsx
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
│
├── vercel.json
├── vite.config.ts
└── package.json
```


---

# Local Setup


Clone:

```bash
git clone https://github.com/sj-builds/YOUR_REPO.git
```


Install:

```bash
npm install
```


Setup database:

```bash
npx prisma generate

npx prisma migrate dev
```


Start development:

```bash
npm run dev
```


---

# Environment Variables


Create `.env`:


```env
DATABASE_URL=

SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

OWNER_EMAIL=

SITE_URL=

JWT_SECRET=

ADMIN_PASSWORD_HASH=
ADMIN_TOTP_SECRET=
```


---

# Build


```bash
npm run build
```


Preview:


```bash
npm run preview
```


---

# Deployment


Production deployment:

- Platform: Vercel
- Database: Neon PostgreSQL
- Runtime: Serverless Functions


Vercel settings:


```text
Build Command:
npm run build

Output:
dist
```


---

# Status


```text
Frontend UI                  COMPLETE
Secure Contact Gateway       COMPLETE
Email Verification System    COMPLETE
Admin Console                COMPLETE
Database Integration         COMPLETE
Production Deployment        COMPLETE
```


---

# License


UNLICENSED — All rights reserved.

This project is publicly available only for portfolio demonstration and evaluation.

Copying, redistributing, modifying, or using any source code, assets, design systems, or implementation details without written permission is prohibited.


---

# Contact


**Shreyansh Jain**

GitHub:
https://github.com/sj-builds

LinkedIn:
https://www.linkedin.com/in/shreyanshjain-tech

X:
https://x.com/jshreyansh962

Email:
jshreyansh962@gmail.com


---

<div align="center">

**Designed with precision. Built with security. Engineered to ship.**

</div>
