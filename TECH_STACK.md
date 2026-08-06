# Tech Stack Specification: FolioForge

This document outlines the self-hosted tech stack for **FolioForge**, an AI-tailored CV builder and portfolio generator. The stack is designed for full data ownership, high performance, and zero dependency on third-party SaaS or serverless vendor lock-in.

---

## 1. Core Principles

- **100% Self-Hosted & Vendor-Free**: No reliance on third-party BaaS/SaaS platforms (No Supabase, Clerk, Inngest, or Next.js serverless primitives).
- **Type Safety**: End-to-end TypeScript with strict schema validation via Zod. The use of `any` type annotations is strictly prohibited.
- **Package Management**: Managed exclusively with `pnpm`.
- **Accessibility & Contrast**: Built using accessible primitives and WCAG AA compliant color contrast.
- **No Inline Styles or Gradients**: Styled using pure Tailwind CSS v4 tokens without inline styling or background gradients.

---

## 2. Technology Stack Matrix

| Layer | Technology | Purpose & Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **React Router v8 (Framework mode: latest)** | Full-stack React 19 web application framework providing client-side and server-side routing, data loaders, and actions. |
| **Styling & UI** | **Tailwind CSS v4 + Radix UI** | Modern utility-first styling with accessible, unstyled UI primitives. |
| **Backend API** | **Express.js (TypeScript)** | Node.js REST API server handling request routing, middleware, authentication, and job dispatches. |
| **Database** | **PostgreSQL (Self-Hosted)** | Relational database storing user records, resume graph schemas, sessions, and portfolio configurations. |
| **ORM & Migrations** | **Drizzle ORM** | Lightweight, type-safe SQL query builder and schema manager. |
| **Authentication** | **Google OAuth 2.0 (Google Auth Only)** | Single Sign-On via Google OAuth 2.0 with HTTP-only cookie sessions backed by PostgreSQL. |
| **Background Queue** | **Redis + BullMQ** | Asynchronous job processing for CV parsing, LLM calls, and document generation. |
| **PDF Rendering** | **`@react-pdf/renderer`** | Programmatic PDF generation directly from React components in Node.js. No Chromium browser overhead. |
| **DOCX Generation** | **`docx` npm package** | Programmatic generation of ATS-friendly Microsoft Word documents. |
| **Reverse Proxy & SSL** | **Caddy / Nginx** | Reverse proxy managing wildcard SSL (Let's Encrypt) and subdomain routing (`username.domain.com`). |

---

## 3. Layer Architecture Details

### 3.1 Frontend Layer (React Router v8 + Tailwind CSS v4)

- **Framework**: **React Router v8** running React 19. Provides routing, server-rendered views for public portfolios, and SPA navigation for the user dashboard.
- **Styling**: **Tailwind CSS v4** configured with CSS variables and design tokens. Inline styles and color gradients are prohibited.
- **UI Components**: Headless components built with **Radix UI** primitives and Lucide icons to guarantee full accessibility (a11y), proper ARIA labeling, and keyboard focus control.
- **Form Handling & Validation**: `react-hook-form` integrated with **Zod**. Enforces strict typing for user resume graphs (roles, bullets, skills, education) with zero usage of `any`.
- **Diff Viewer**: Custom side-by-side diff component comparing original resume bullet points against AI-tailored suggestions.

### 3.2 Backend Layer (Express.js + Node.js)

- **API Server**: **Express.js** written in strict TypeScript.
- **Middleware Pipeline**:
  - `helmet`: Security header enforcement.
  - `cors`: Restricted cross-origin resource sharing.
  - `cookie-parser`: Secure HTTP-only cookie extraction.
  - `express-rate-limit`: Rate limiting on public and AI endpoints.
- **Validation**: All incoming request bodies and route parameters are validated at runtime using Zod schemas.

### 3.3 Authentication & Session Management

- **Provider**: **Google OAuth 2.0** exclusively (Google Sign-In).
- **User Provisioning**: Automatic user creation and profile synchronization on first Google OAuth login (`google_id`, `email`, `name`, `avatar_url`).
- **Session Storage**: Stateful session tokens stored in a dedicated `sessions` table in PostgreSQL.
- **Cookie Security**: Sessions are sent to the client via secure `SameSite=Lax` or `SameSite=Strict`, `HttpOnly`, and `Secure` cookies. Zero third-party authentication BaaS dependencies.

### 3.4 Database & Schema Management (PostgreSQL + Drizzle ORM)

- **Database Engine**: PostgreSQL running locally or in Docker.
- **Data Models**:
  - `users`: ID, email, password hash, created timestamp.
  - `sessions`: Session ID, user ID, expiration timestamp.
  - `resumes`: Structured canonical resume graph (roles, bullets, education, skills, contact info).
  - `tailored_cvs`: Tailored variations per job description, keyword match scores, and diff data.
  - `portfolios`: Portfolio slug (`/u/username`), active template, custom domain settings, and published state.
- **Type Safety**: Drizzle ORM exports TypeScript types directly derived from PostgreSQL schema definitions.

### 3.5 Asynchronous Task Queue (Redis + BullMQ)

- **Queue Server**: Self-hosted Redis container.
- **Workers**: Dedicated BullMQ worker processes isolated from the main Express HTTP thread.
- **Task Types**:
  - `parse-resume`: Parses PDF/DOCX uploads into normalized Zod resume graph schemas.
  - `tailor-cv`: Calls the LLM to adapt bullet points to job descriptions without inventing claims.
  - `generate-pdf`: Renders downloadable PDF documents via `@react-pdf/renderer`.

### 3.6 PDF & DOCX Document Engine

- **PDF Generation**: Powered by **`@react-pdf/renderer`**.
  - Renders React components directly into PDF binary streams on the Node.js server.
  - Replaces heavy, memory-intensive headless Chromium browsers (Puppeteer/Playwright).
  - Ensures crisp vector rendering, low memory footprint, fast execution, and strict ATS text layer parsing.
- **DOCX Generation**: Built using the `docx` library in TypeScript, rendering structured Microsoft Word files directly from the canonical resume graph.

### 3.7 Reverse Proxy & Subdomain Infrastructure (Caddy / Nginx)

- **Domain Routing**:
  - `app.domain.com`: Routes traffic to the React Router dashboard application.
  - `api.domain.com`: Routes traffic to the Express API server.
  - `*.domain.com` / `domain.com/u/*`: Routes public portfolio traffic and serves `/llm.txt`.
- **SSL Certificates**: Automated TLS certificate provisioning and renewal via Caddy (Let's Encrypt).

---

## 4. Package Management

All dependencies are installed and managed using **pnpm**:

```bash
pnpm install
```

`npm` and `yarn` usage is disallowed.
