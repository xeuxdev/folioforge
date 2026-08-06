# PRD: Folio Forge

**AI-tailored CVs + auto-generated portfolio websites**
Version 0.1 — Draft for internal review

---

## 1. Problem Statement

Job seekers do two repetitive, high-friction tasks for every application:

1. Rewrite/tailor their CV to match a job description's keywords and priorities (usually via copy-pasting into ChatGPT and manually reassembling a doc).
2. Separately maintain a portfolio site, which most people never build or let go stale, because spinning one up (design, hosting, domain, content writing) is too much effort for the payoff.

Folio Forge merges both into one flow: upload a CV once, get (a) tailored, exportable CVs per job application, and (b) a live portfolio site kept in sync with that CV — with no design or writing work required.

**This is fundamentally a data-pipeline product, not an AI-novelty product.** The hard part is parsing messy human resume data reliably and reusing it cleanly across outputs. The AI is the easy 20%.

---

## 2. Goals

- Reduce time to produce a tailored, ATS-appropriate CV from ~45–60 min to under 5 min.
- Let a user go from "uploaded CV" to "live portfolio URL" in under 3 minutes, zero design skill required.
- Build a durable, structured "resume graph" per user (roles, bullets, skills, dates, links) that all outputs (PDF CV, portfolio, llm.txt) are generated *from*, not regenerated separately each time — this is the core IP, not the templates.

### Non-goals (v1)

- Not a job board, not an application tracker (no "apply to 50 jobs" automation — this is a legal/ToS and quality minefield; see Risks).
- Not a general website builder / drag-and-drop editor.
- Not an ATS itself.

---

## 3. Users

| Persona | Need |
|---|---|
| Active job seeker (mid-career, tech/design/marketing) | Fast, credible, tailored CV per role + a portfolio link to put in applications |
| Freelancer / consultant | Portfolio as a standing asset, updated occasionally, custom domain matters |
| New grad / career switcher | Needs help surfacing relevant experience they undersell; price-sensitive |

Primary wedge: **Persona 1**, because CV tailoring is the repeat-use, high-frequency action that drives retention; the portfolio is the durable asset that drives referrals and upsell.

---

## 4. Core Feature Set

### 4.1 CV Ingestion & Parsing (foundation — everything depends on this)

- Upload existing CV (PDF/DOCX).
- Parse into structured schema: contact info, roles (title, company, dates, bullets), education, skills, projects, links.
- **Human-in-the-loop review step is mandatory**, not optional. Resume parsing is never 100% reliable (tables, multi-column layouts, non-Latin scripts, inconsistent date formats all break parsers). Ship a review/edit UI where the user confirms parsed fields before anything downstream is generated. Treat this as a feature ("verify your data") not a bug workaround.
- Store as the canonical structured record — this is the single source of truth for both CV tailoring and portfolio generation.

### 4.2 Tailored CV Generation

- Input: job description (paste text or URL).
- Output: tailored PDF, using the user's own structured experience — reordering, re-emphasizing, and rephrasing bullets to mirror the JD's language and keywords, **without inventing experience, skills, or metrics the user didn't provide.**
- Show a diff view: original bullet vs. tailored bullet, so the user can see and approve every change before download. This is a trust and legal-liability feature, not nice-to-have — AI CV tools get reputational damage fast when they fabricate.
- Keyword-match score against the JD (transparency: "matched 14/20 key terms") — genuinely useful and differentiates from a black box.
- Export: PDF (primary), DOCX (secondary — recruiters/ATS sometimes require it).

### 4.3 Portfolio Website Generator

- Two predefined templates at launch (not more — see Risks on template debt).
- Site generated from the same structured CV record: hero, experience timeline, projects, skills, contact.
- AI's role here is narrow and correctly scoped in your framing: rewriting copy into portfolio tone (first-person, narrative bios, project blurbs) — **not generating new layout/markup per user.** Keep this boundary firm; it's what keeps this maintainable.
- Custom link on launch: `foliaforge.app/u/username`.
- Auto-updates when the user edits their structured CV data (single source of truth pays off here).

### 4.4 Custom Template Generation (paid tier)

- User describes style/vibe or picks references; AI generates a bespoke template (still constrained to a component library, not free-form code) at a materially higher price point.
- **Recommend this ships in Phase 2, not v1.** It's a different product (generative UI) with different failure modes (broken layouts, accessibility issues, inconsistent quality) than the two-template MVP. Bolting it on early risks support burden outweighing revenue from it.

### 4.5 Custom Domains

- Two paths:
  - **Bring your own domain** — user adds a domain they own, you provide DNS/CNAME instructions + auto SSL (standard, e.g. via Vercel/Netlify/Cloudflare for SaaS APIs).
  - **Buy a domain through the platform** — requires becoming or reselling through a registrar (e.g. reseller API via Namecheap, Porkbun, or a registrar-as-a-service like Vercel Domains / Dnsimple). This adds real overhead: domain purchase/renewal billing, WHOIS/ICANN compliance, refund/dispute handling, domain-transfer support requests.
  - **Recommend**: ship "bring your own domain" in v1 only. Domain reselling in Phase 2+ once there's proven demand — it's a support-heavy, low-margin business bolted onto a software margin business.

### 4.6 llm.txt Export ("AI-Readable Profile")

- Generates a structured, plain-text/markdown summary of the user's professional profile at `/llm.txt` on their portfolio domain, following the emerging `llms.txt` convention (a machine-readable summary site for LLM crawlers/agents, analogous to `robots.txt` for AI tools).
- Positioning: "so AI tools (assistants, agent-based recruiting tools) can accurately read and cite your background."
- **Realism check**: this is a genuinely nice, cheap-to-build differentiator, but it's a nascent, unstandardized convention with unclear adoption and no verified reach today — market it as a forward-looking bonus feature, not a headline value proposition or the reason someone pays.

---

## 5. User Flow (v1 happy path)

1. Sign up → upload CV.
2. Review/correct parsed data (structured editor).
3. Choose: (a) tailor a CV for a specific job, or (b) generate portfolio.
a. Paste JD → get tailored CV with diff view → approve → download PDF.
b. Pick template 1 or 2 → preview → publish → get shareable link (+ optional custom domain).
4. Return later, re-paste a new JD → get a new tailored CV in under a minute (this repeat loop is the retention engine).

---

## 6. Monetization (draft)

| Tier | Price idea | Includes |
|---|---|---|
| Free | $0 | 1 portfolio (subdomain), 2 tailored CV exports/month |
| Pro | ~$9–15/mo | Unlimited tailored CVs, both templates, llm.txt, DOCX export |
| Custom domain add-on | ~$5–10/mo or annual | BYO domain hosting |
| Bespoke template | One-time ~$49–99 | AI-generated custom template (Phase 2) |

Keep pricing modest at launch — this category (resume tools) is price-sensitive and has many free competitors (Teal, Rezi, Kickresume, Enhancv). Differentiation is the CV-tailoring transparency + linked portfolio combo, not price.

---

## 7. Key Risks & Realistic Challenges

**Product risk**

- Resume parsing accuracy is the #1 churn driver if wrong — budget real engineering time here, not just an LLM call. Consider a hybrid: layout-aware parser (e.g. document AI) + LLM cleanup, not LLM-only extraction from raw PDF text.
- "Tailoring" can tip into fabrication if not constrained — must be architecturally prevented (only reorder/reword/re-select from user's real data, never generate new claims), both for user trust and to avoid enabling resume fraud.

**Legal/compliance**

- You'll be storing sensitive PII (full work history, contact info, sometimes salary/references) — needs a real privacy policy, data deletion flow, and likely GDPR/CCPA compliance from day one given a global audience.
- Domain reselling brings ICANN/registrar compliance obligations — don't underestimate this if you go there.
- If you ever add "auto-apply to jobs," you hit ToS violations with major job boards and reputational risk — recommend staying out of that entirely.

**Competitive**

- CV tailoring tools are crowded (Teal, Kickresume, Rezi, Enhancv, plain ChatGPT). Portfolio builders are crowded (Framer, Super.so, Notion-based tools, Webflow). Your wedge is the *combination* plus the shared-data model — lead marketing with that, not with "AI resume builder" alone, which is an oversaturated search term.

**Ops/cost**

- LLM cost per tailored CV is small individually but scales with usage; plan a rate-limited free tier from day one.
- Custom AI-generated templates (Phase 2) are the most expensive and highest-support-burden feature — sequence it late.

---

## 8. Phased Roadmap

**Phase 1 (MVP, ~8–12 weeks with a small team)**
CV upload/parse/review → tailored CV export (PDF) → 2 fixed portfolio templates → subdomain hosting → llm.txt generation.

**Phase 2**
DOCX export, BYO custom domain, keyword-match scoring polish, usage analytics on portfolio (views), account/team plans.

**Phase 3**
AI-generated bespoke templates, domain purchase/resale, richer portfolio blocks (case studies, testimonials, embedded media).

---

## 9. Open Questions to Resolve Before Building

1. Resume parsing: build in-house or use a document-parsing API (e.g. Affinda, Textkernel, or a layout-aware OCR + LLM pipeline)? This is the single biggest build-vs-buy decision.
2. How do you prevent/detect users tailoring a CV into misrepresentation, and what's your liability posture if a tailored CV contains an error the user didn't catch?
3. What's the actual acquisition channel? (Resume tools live or die on SEO/content and career-community distribution, not paid ads — worth deciding early since it affects which features you should build first for shareability, e.g. public portfolio links driving referral traffic.)
4. Do you need multi-language / non-Latin script support at launch, given your likely user base?

---

*This PRD intentionally keeps custom-template generation and domain reselling out of v1 — both are real product lines with their own failure modes, and bundling them into the MVP is the most common way a project like this stalls before shipping.*
