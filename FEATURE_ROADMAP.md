# FolioForge Feature Roadmap

This document outlines the sequential feature development roadmap for **FolioForge**, from core authentication to deployment, along with completion checklists for each milestone.

---

## Milestone 1: Authentication & User Management (Google Auth Only)

### Features

* **Google OAuth 2.0 Authentication**: Exclusively Google Sign-In (OAuth2 / OIDC authentication flow) paired with HTTP-only session cookies backed by PostgreSQL (`sessions` table).
* **Automatic User Provisioning**: Auto-creates candidate profile records (`google_id`, `email`, `name`, `avatar_url`) upon first successful Google OAuth login.
* **Session Guard Middleware**: Protected route access control for frontend dashboards and REST API routes.
* **User Settings & Account Deletion**: GDPR and CCPA compliant data deletion endpoint that purges user records, Google profile metadata, resume graphs, and portfolio assets.

### Completion Checklist

* [x] Candidate can authenticate exclusively using "Sign in with Google".
* [x] Google OAuth 2.0 authorization code exchange / ID token validation verifies user identity securely.
* [x] First-time Google OAuth login automatically provisions user record in PostgreSQL with `google_id`, `email`, `name`, and `avatar_url`.
* [x] Active session token is stored in PostgreSQL and delivered to the client via `HttpOnly`, `Secure`, and `SameSite=Lax` cookies.
* [x] Unauthenticated API and dashboard requests are blocked and redirected to Google login.
* [x] Logging out invalidates the session record in PostgreSQL and clears client session cookies.
* [ ] Account deletion completely purges all associated user data, resumes, tailored CVs, and portfolios.

---

## Milestone 2: CV Ingestion, Parsing & Canonical Resume Graph

### Features

* **Multi-Format Document Upload**: Support for PDF and DOCX resume uploads (up to 10MB limit).
* **Parsing Pipeline**: BullMQ background job that extracts raw resume content and maps it to a normalized JSON schema (contact info, work history, roles, bullets, education, skills, projects, links).
* **Human-in-the-Loop Review Editor**: Mandatory verification UI allowing users to review, edit, reorder, add, or delete parsed experience entries before downstream processing.
* **Single Source of Truth Persistence**: Saving normalized data into canonical PostgreSQL tables (`resumes` graph).

### Completion Checklist

* [x] User can upload PDF or DOCX resume files via drag-and-drop or file picker.
* [x] Background worker processes file uploads asynchronously via Redis and BullMQ.
* [x] Parser extracts work experience, dates, role titles, bullet points, skills, and education into structured fields.
* [x] Verification editor displays parsed fields with inline edit controls and error validation.
* [x] User can add missing entries, modify text, and reorder bullet points.
* [x] Saving updates the single source of truth resume record in PostgreSQL.

---

## Milestone 3: AI-Powered CV Tailoring & Export Engine

### Features

* **Job Description Ingestion**: Input interface for pasting job descriptions or job URLs.
* **Constrained LLM Tailoring**: Prompts that reorder, re-emphasize, and rephrase existing bullets to mirror JD keywords without fabricating unprovided claims, metrics, or roles.
* **Side-by-Side Diff Viewer**: Visual comparison component contrasting original bullets against tailored suggestions with inline approve/reject toggles.
* **Transparent Keyword Match Score**: Match score component showing keyword coverage (e.g., 15 out of 20 terms matched).
* **PDF & DOCX Export Engine**: Direct server-side rendering of ATS-friendly vector PDFs via `@react-pdf/renderer` and Word documents via `docx`.

### Completion Checklist

* [ ] User can paste a target job description to initiate tailoring.
* [ ] LLM tailoring process adapts bullets while strictly preserving factual accuracy without inventing data.
* [ ] Diff viewer highlights added, removed, and modified wording side-by-side with accept/reject controls per bullet.
* [ ] Keyword match score displays extracted JD requirements vs. matched candidate skills.
* [ ] PDF export outputs clean, single or multi-page ATS-parseable vector PDFs via `@react-pdf/renderer`.
* [ ] DOCX export outputs valid, structured Microsoft Word files readable by ATS software.

---

## Milestone 4: Auto-Generated Portfolio Generator & Hosting

### Features

* **Accessible Base Templates**: Two built-in responsive portfolio themes constructed with Radix UI primitives and Tailwind CSS v4.
* **Automated Copy Transformation**: Generates portfolio copy (first-person bio, narrative project summaries) from the canonical resume graph.
* **Live Synchronization**: Portfolio content automatically updates whenever underlying CV data is modified in the resume editor.
* **Subdomain Routing**: Portfolio publication accessible via public URL (`foliaforge.app/u/username` or wildcard subdomains).

### Completion Checklist

* [ ] User can choose between Template 1 and Template 2 with live preview capabilities.
* [ ] Portfolio renders Hero section, Work Experience timeline, Featured Projects, Skills grid, and Contact info directly from the canonical resume graph.
* [ ] Updates made to the user's master CV graph instantly sync to their published portfolio site.
* [ ] Portfolio page loads at `/u/username` with full responsive support across desktop, tablet, and mobile views.
* [ ] All portfolio elements pass WCAG AA color contrast standards and keyboard focus accessibility directives.

---

## Milestone 5: llm.txt Machine-Readable Profile Generator

### Features

* **Structured Plain-Text / Markdown Profile Endpoint**: Automatically generated `/llm.txt` route on the user's portfolio domain.
* **AI-Readable Summary**: Formats professional achievements, skills, contact links, and employment history following the `llms.txt` convention for LLM crawlers and recruiting agents.

### Completion Checklist

* [ ] Visiting `/u/username/llm.txt` returns clean, unformatted `text/plain` markdown content.
* [ ] Content accurately summarizes candidate work history, skills matrix, and verified portfolio links.
* [ ] Endpoint responds with low latency and appropriate HTTP caching headers.

---

## Milestone 6: Custom Domain Management (Bring Your Own Domain)

### Features

* **Custom Domain Binding Interface**: Settings panel allowing Pro users to add custom domain names (e.g., `alexsmith.com`).
* **DNS CNAME & A Record Guidance**: Step-by-step verification instructions for user DNS configuration.
* **Domain Reverse Proxy Routing**: Express / Reverse proxy routing mapping custom domain requests to the appropriate user portfolio.

### Completion Checklist

* [ ] User can enter and save a custom domain name in their account settings.
* [ ] System checks CNAME and A record alignment against domain DNS servers.
* [ ] Incoming HTTP traffic on the custom domain serves the user's published portfolio seamlessly.

---

## Milestone 7: Usage Limits & Rate-Limiting Tier Enforcement

### Features

* **Free vs. Pro Tier Rules Engine**: Enforces usage boundaries (Free tier: 1 portfolio, 2 tailored exports per month; Pro tier: unlimited exports, DOCX downloads, custom domain binding).
* **API Rate-Limiting**: Express rate-limiting and Redis counters on high-cost endpoints (LLM tailoring, document generation).

### Completion Checklist

* [ ] Free tier users are restricted after reaching 2 tailored CV exports in a 30-day window.
* [ ] Pro tier lock overlays prevent non-paying users from accessing DOCX exports or custom domain settings.
* [ ] Rate limiter returns `429 Too Many Requests` when API rate bounds are exceeded.
