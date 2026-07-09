<div align="center">

# SHREYANSH.SYS

### Software Engineering × Cybersecurity Portfolio System

A production-grade personal engineering platform combining a cinematic developer experience, secure backend architecture, verified communication workflows, and cloud-native deployment.

<br />

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

<br />

<a href="https://shreyanshjain.vercel.app">
Live System
</a>

</div>


---

# Overview

**SHREYANSH.SYS** is not a traditional static portfolio website.

It is designed as a full-stack personal engineering system demonstrating modern frontend development, backend architecture, security principles, database design, authentication workflows, and production deployment practices.

The project focuses on:

- secure software design
- clean system architecture
- performance-focused interfaces
- production reliability
- maintainable engineering practices


---

# Core Objectives

The goal of this project is to demonstrate the ability to build:

- visually refined user experiences
- secure backend services
- real-world authentication flows
- database-driven applications
- production-ready cloud systems


---

# User Experience

The interface follows a futuristic cybersecurity-inspired design language.

Implemented:

- cinematic landing experience
- terminal-inspired interactions
- glassmorphism interface system
- responsive layouts
- smooth motion architecture
- micro-interactions
- dark premium visual identity


---

# Secure Contact Gateway

The contact system is custom-built instead of relying on third-party form services.

Flow:

```text
Visitor
   |
   |
Submit Message
   |
   |
Input Validation
   |
   |
Secure Database Storage
   |
   |
Email Verification Token
   |
   |
Visitor Verification
   |
   |
Message Delivery
```

Features:

- verified email ownership
- secure token generation
- hashed verification tokens
- expiring verification links
- database persistence
- automated email workflows
- visitor confirmation system


---

# Admin Security System

A private administrative layer manages verified communication.

Implemented security:

- password authentication
- multi-factor authentication
- JWT-based sessions
- protected API endpoints
- authorization middleware
- message management controls


---

# Security Engineering

Security considerations implemented:

| Area | Implementation |
|-|-|
| Input Security | Schema validation |
| Token Security | Cryptographic hashing |
| Authentication | JWT + MFA |
| Database Access | ORM-controlled queries |
| Secrets | Environment isolation |
| Email Safety | Verification workflow |
| Monitoring | Security event logging |
| Headers | Hardened HTTP policies |


---

# System Architecture


```text
                 USER

                  |
                  |

           React Frontend

                  |
                  |

        Vercel Serverless API

                  |

       +----------+----------+
       |                     |

    Prisma ORM          SMTP Service

       |                     |

 PostgreSQL Database     Email Delivery

```


---

# Technology Stack


## Frontend

| Technology | Purpose |
|-|-|
| React | Interface development |
| TypeScript | Type safety |
| Vite | Build system |
| TailwindCSS | Styling architecture |
| Framer Motion | Animation system |
| React Router | Client navigation |


---

## Backend

| Technology | Purpose |
|-|-|
| Vercel Functions | Serverless APIs |
| Prisma | Database ORM |
| PostgreSQL | Persistent storage |
| Nodemailer | Email delivery |
| Zod | Runtime validation |
| JWT | Authentication |


---

# Database Architecture


Main models:

```text
Message

- visitor identity
- message content
- verification state
- admin state
- security metadata
- timestamps


SecurityLog

- security events
- audit records
- metadata tracking


RateLimit

- abuse prevention
- request control


OTP

- verification workflow support
```


---

# API Architecture


```text
/api/contact

Creates secure contact request


/api/verify-contact

Handles email ownership verification


/api/admin-login

Authenticates admin access


/api/messages

Retrieves verified messages


/api/message-action

Handles admin operations
```


---

# Production Infrastructure


| Service | Role |
|-|-|
| Vercel | Hosting & Serverless Runtime |
| Neon PostgreSQL | Cloud Database |
| Gmail SMTP | Email Infrastructure |
| GitHub | Version Control |


---

# Repository Availability

This repository is publicly available for:

- technical evaluation
- portfolio review
- architecture demonstration
- engineering discussion

It is not distributed as:

- a starter template
- reusable UI kit
- open-source package


Internal configuration, credentials, and deployment secrets are intentionally excluded.


---

# Engineering Status


```text
Frontend Interface              COMPLETE

Responsive Design               COMPLETE

Secure Contact Gateway          COMPLETE

Email Verification              COMPLETE

Database Integration            COMPLETE

Admin Authentication            COMPLETE

Security Logging                COMPLETE

Production Deployment           COMPLETE
```


---

# Author


**Shreyansh Jain**

Software Engineering • AI Development • Cybersecurity


GitHub  
https://github.com/sj-builds


LinkedIn  
https://linkedin.com/in/shreyanshjain-tech


X  
https://x.com/jshreyansh962


Email  
jshreyansh962@gmail.com


---

# License


Copyright © 2026 Shreyansh Jain.

All Rights Reserved.

This repository is provided publicly for portfolio demonstration and evaluation purposes only.

No permission is granted to copy, modify, distribute, sublicense, or reuse any source code, design system, assets, or implementation details without explicit written permission.

The availability of this repository does not constitute an open-source license.


---

<div align="center">

### Designed with precision. Built with security. Engineered to ship.

</div>
