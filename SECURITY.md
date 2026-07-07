# Security Policy

## Overview

Security is an important part of SHREYANSH.SYS.

This project includes a React frontend, serverless backend APIs, database integration, and protected administrative functionality.

I appreciate responsible security research and reports that help improve this project.

---

## Supported Versions

This repository follows continuous deployment.

| Branch | Status |
| ------ | ------ |
| main | ✅ Supported |
| older commits/forks | ❌ Not actively maintained |

Only the latest production version receives security fixes.

---

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

Please include:

- Description of the vulnerability
- Steps to reproduce
- Potential security impact
- Suggested fix (if available)

Please avoid:

- Publicly disclosing the issue before review
- Accessing or modifying data that does not belong to you
- Automated attacks that may impact availability

---

## Security Scope

Areas considered in scope:

- Authentication issues
- Authorization bypass
- API security problems
- Data exposure
- Injection vulnerabilities
- Cross-site scripting (XSS)
- Sensitive information disclosure

---

## Out of Scope

The following are generally not considered security vulnerabilities:

- Social engineering attempts
- Physical attacks
- Spam reports
- Issues requiring access to a user's device
- Browser extensions modifying site behavior

---

## Response Process

Reports will be reviewed and investigated.

Valid security issues will be fixed based on severity and impact.

---

## Security Measures

This project implements:

- Environment-based secret management
- Server-side authentication checks
- Time-based one-time password (TOTP) verification
- JWT-based admin sessions
- Input validation
- Database access controls
- Dependency monitoring
- Secret scanning

---

Thank you for helping keep this project secure.
