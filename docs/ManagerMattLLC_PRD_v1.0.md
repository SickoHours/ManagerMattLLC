PRD:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<prd
  product="ManagerMattLLC"
  title="ManagerMattLLC — Product Requirements Document"
  version="v1.0 (Final)"
  date="2026-01-10"
  timezone="America/Los_Angeles"
  owner_org="Manager Matt LLC"
  owner_name="Anthony “Manager Matt”">

  <meta>
    <productLine>Portfolio + Estimator + Quote Generator + Control Room</productLine>
    <note>
      This is the final consolidated PRD for ManagerMattLLC. It includes the main PRD requirements and an appendix
      containing the Codex review verdict + rollout guidance. Raw URLs are not used in body content and appear only in
      &lt;references&gt;.
    </note>
  </meta>

  <section number="1" title="Product Summary">
    <paragraph>
      ManagerMattLLC is an AI-accelerated dev studio website designed to:
    </paragraph>
    <list>
      <item>Convert visitors into qualified leads via a fast, trustworthy Build Estimate → Quote funnel</item>
      <item>Explain estimates credibly (module breakdown, assumptions, confidence, P10/P50/P90 ranges)</item>
      <item>
        Run delivery + iteration like a modern product team via a client-friendly Control Room
        (change requests, approvals, budgets, preview links, releases) that maps to real engineering workflows
        (PRs/preview/deploy) without forcing clients to use GitHub
      </item>
    </list>

    <paragraph>Core positioning:</paragraph>
    <list>
      <item>“AI-driven dev, openly honest”</item>
      <item>“High-value, affordable builds”</item>
      <item>“Professional delivery standards, safety baseline, predictable iteration”</item>
    </list>
  </section>

  <section number="2" title="Goals, Non-Goals, and Guardrails">
    <subsection title="Goals">
      <list>
        <item>Build a high-conversion estimate funnel that users trust.</item>
        <item>
          Provide ranges, not fake precision:
          <list>
            <item>Tokens (input/output) as “materials”</item>
            <item>Hours as labor</item>
            <item>Calendar time as timeline</item>
          </list>
        </item>
        <item>Provide premium quote artifacts: share link + PDF + scope checklist.</item>
        <item>
          Make post-sale delivery simple:
          <list>
            <item>change requests with structured intake</item>
            <item>delta estimates</item>
            <item>budgets/credits</item>
            <item>approvals</item>
            <item>release notes</item>
          </list>
        </item>
        <item>Create a data quality loop so the estimator improves over time (outcomes vs estimates).</item>
      </list>
    </subsection>

    <subsection title="Non-Goals (V1)">
      <list>
        <item>Full Jira replacement</item>
        <item>Full billing/contracts automation (Stripe + e-sign can be V1.1+)</item>
        <item>Fully automated GitHub PR creation/merging (optional V1.5/V2)</item>
        <item>Fully automated “true token metering” across all providers (V1 starts with estimate + optional ledger)</item>
      </list>
    </subsection>

    <subsection title="Guardrails">
      <list>
        <item>“AI accelerates development; you own outcomes.”</item>
        <item>“Estimate is a forecast; approvals convert scope into commitments.”</item>
        <item>If inputs are insufficient, system must fall back to manual review and/or degraded mode.</item>
      </list>
    </subsection>
  </section>

  <section number="3" title="Target Users">
    <list>
      <item><label>A</label> Founder on a budget: needs MVP fast, hates agency pricing</item>
      <item><label>B</label> Small business ops owner: needs internal dashboards/automation + ongoing iteration</item>
      <item><label>C</label> Skeptic: needs safety baseline + explainability + approval gates</item>
      <item><label>D</label> Existing client: wants fast revisions, wants control without GitHub</item>
    </list>
  </section>

  <section number="4" title="Product Scope">
    <subsection title="Public site">
      <list>
        <item>Home</item>
        <item>Estimate (mini + full wizard)</item>
        <item>Results + Quote generator</item>
        <item>Work / case studies</item>
        <item>Process (safety baseline + how projects run)</item>
        <item>Pricing (packages + retainers + credits)</item>
        <item>Contact</item>
        <item>Legal (privacy/terms)</item>
      </list>
    </subsection>

    <subsection title="Control Room (authenticated)">
      <list>
        <item>Projects dashboard</item>
        <item>Change requests intake</item>
        <item>Delta estimates + approvals</item>
        <item>Status tracking + blockers + SLA timers</item>
        <item>Preview review + revision loop</item>
        <item>Releases / changelog</item>
        <item>Notification preferences</item>
      </list>
    </subsection>

    <subsection title="Admin">
      <list>
        <item>Leads + quotes + projects</item>
        <item>Module catalog + rate cards editor (draft vs published)</item>
        <item>Manual estimate overrides (with audit trail)</item>
        <item>Outcomes tracking + calibration dashboards</item>
        <item>Analytics dashboards</item>
      </list>
    </subsection>
  </section>

  <section number="5" title="Recommended Stack &amp; Architecture">
    <subsection title="Core stack">
      <list>
        <item>Next.js (App Router) + TypeScript</item>
        <item>Tailwind + shadcn/ui</item>
        <item>Convex (DB + functions + scheduled jobs)</item>
        <item>Clerk for Control Room authentication <citationRef refId="1"/></item>
        <item>Resend or SendGrid for email delivery (quotes, notifications)</item>
        <item>PostHog for funnels, event tracking, feature flags <citationRef refId="2"/></item>
        <item>Sentry for Next.js error + performance monitoring <citationRef refId="3"/></item>
        <item>Better Stack (Logtail) for structured logging in Next.js routes/handlers <citationRef refId="4"/></item>
      </list>
    </subsection>

    <subsection title="Bot protection + rate limiting">
      <list>
        <item>Cloudflare Turnstile for public forms (estimate/contact) <citationRef refId="5"/></item>
        <item>Cloudflare WAF Rate Limiting Rules for endpoint-level protection <citationRef refId="6"/></item>
      </list>
    </subsection>

    <subsection title="Background jobs / retries (choose one path)">
      <subsubsection title="V1 default: Convex Scheduling">
        <list>
          <item>Scheduled Functions + Cron Jobs <citationRef refId="7"/></item>
          <item>
            Optional durable components:
            <list>
              <item>Workflow <citationRef refId="8"/></item>
              <item>Workpool <citationRef refId="9"/></item>
              <item>Retrier <citationRef refId="10"/></item>
            </list>
          </item>
        </list>
      </subsubsection>

      <subsubsection title="Optional V1.5+: Dedicated background job platform">
        <list>
          <item>Inngest background jobs <citationRef refId="11"/></item>
          <item>Trigger.dev durable jobs &amp; schedules <citationRef refId="12"/></item>
        </list>
      </subsubsection>
    </subsection>

    <subsection title="Storage for attachments (bug screenshots, videos)">
      <paragraph>
        Use object storage (S3/R2) with presigned URLs:
      </paragraph>
      <list>
        <item>time-limited access to download/upload without sharing credentials <citationRef refId="13"/></item>
        <item>store object keys, regenerate presigned URLs as needed (implementation best practice)</item>
      </list>
    </subsection>

    <subsection title="PDF generation (quote PDFs)">
      <paragraph>Two supported implementations:</paragraph>
      <list>
        <item>V1 (simple): server-side HTML → PDF generation</item>
        <item>
          V1.5+ (pixel-perfect): Playwright-based PDF renderer (cache by quote version hash; consistent rendering)
          <citationRef refId="14"/>
        </item>
      </list>
    </subsection>
  </section>

  <!-- INSERTED: Section 5.5 Luxury UI System + Build Quality Gates -->
  <section number="5.5" title="Luxury UI System + Build Quality Gates (Claude Code Execution Standard)">
    <paragraph>
      The UI for ManagerMattLLC must feel Apple/Tesla-grade: premium, minimal, whitespace-heavy, and extremely consistent.
      This section defines non-negotiable design rules, required artifacts, and the workflow gates used to prevent “generic Tailwind output.”
      Claude Code (and any build agent) must follow this system.
    </paragraph>

    <subsection number="5.5.1" title="Core Principle: Do NOT ask for 'beautiful' — enforce artifacts + gates">
      <paragraph>
        Do not prompt the agent to “make it beautiful.” That produces generic results.
        Instead, enforce constraints + required artifacts + acceptance tests.
      </paragraph>
      <list>
        <item>Design System Spec (tokens + rules)</item>
        <item>Component Library (variants + usage rules)</item>
        <item>Page Blueprints (layout + behavior contracts)</item>
        <item>UI QA Audit with screenshots (before/after + fixes)</item>
        <item>Performance + Accessibility gates (measurable, required)</item>
      </list>
      <paragraph>
        The agent is not allowed to write production UI code until the design artifacts exist and are committed.
      </paragraph>
    </subsection>

    <subsection number="5.5.2" title="3-Layer Workflow (Design Director → Frontend Lead → QA/Polish)">
      <paragraph>
        All UI work must follow this layered execution model to ensure consistency and premium quality.
      </paragraph>

      <subsubsection title="Layer A — Design Director (words only; no code allowed)">
        <paragraph>Required outputs before any UI implementation:</paragraph>
        <list>
          <item>Visual principles (what “luxury” means for this product)</item>
          <item>Design tokens: spacing scale, type scale, radii, shadows, colors</item>
          <item>Component rules: what exists, what does not, and usage constraints</item>
          <item>Motion rules: durations, easing, when motion is allowed</item>
        </list>
      </subsubsection>

      <subsubsection title="Layer B — Frontend Lead (system-first build order)">
        <paragraph>Implementation must follow this order:</paragraph>
        <list>
          <item>Primitives (typography, spacing utilities, containers)</item>
          <item>Layout shell (nav/header/footer patterns)</item>
          <item>Shared components (cards, CTAs, stepper, summary panel)</item>
          <item>Only then: page-level UI (landing + estimate flow)</item>
        </list>
      </subsubsection>

      <subsubsection title="Layer C — QA + Polish Pass (the “T3 approved” pass)">
        <paragraph>Before any UI task is marked done, the agent must:</paragraph>
        <list>
          <item>Run a UI audit checklist</item>
          <item>Fix inconsistencies (spacing/type/hover/focus/motion)</item>
          <item>Generate before/after screenshots</item>
          <item>Write a short “what changed” log (no fluff, concrete diffs)</item>
        </list>
      </subsubsection>
    </subsection>

    <subsection number="5.5.3" title="Required UI Artifacts (must exist in repo)">
      <paragraph>
        These artifacts are required and must be produced before production UI work proceeds.
        They exist to lock consistency and prevent drift.
      </paragraph>

      <list>
        <item>
          <bold>docs/ui/STYLE_GUIDE.md</bold>
          <list>
            <item>Spacing scale (single system used everywhere)</item>
            <item>Type scale (display/title/body/label)</item>
            <item>Radii + shadows (limited set; consistent)</item>
            <item>Color tokens (neutral palette + single accent)</item>
            <item>Motion rules (duration/easing; what gets animation)</item>
            <item>Accessibility rules (focus styles, contrast, targets)</item>
          </list>
        </item>

        <item>
          <bold>docs/ui/COMPONENT_LIBRARY.md</bold>
          <list>
            <item>Component list + variants (buttons, cards, stepper, toggles, sliders, badges)</item>
            <item>Order summary panel (desktop sticky + mobile bottom pill)</item>
            <item>Skeleton/loading states and empty states</item>
            <item>Usage rules (“do/don’t” examples)</item>
          </list>
        </item>

        <item>
          <bold>docs/ui/PAGES.md</bold>
          <list>
            <item>Page blueprint for <code>/</code> (landing hero + one trust section + CTA)</item>
            <item>Page blueprint for <code>/estimate</code> (configurator + sticky summary)</item>
            <item>Layout contract (spacing rhythm, max-width, section cadence)</item>
            <item>State contract (loading, recalculating, errors, degraded mode)</item>
          </list>
        </item>

        <item>
          <bold>docs/ui/UI_AUDIT.md</bold>
          <list>
            <item>Checklist + findings</item>
            <item>What was fixed (explicit bullets)</item>
            <item>Screenshots in docs/ui/screenshots/ (before/after)</item>
          </list>
        </item>
      </list>
    </subsection>

    <subsection number="5.5.4" title="Definition of Done (Non-Negotiable Gates)">
      <paragraph>
        Before any UI work is considered complete, all gates below must be satisfied.
        If a gate fails, the task remains incomplete.
      </paragraph>

      <subsubsection title="UI Gates">
        <list>
          <item>Consistent spacing system (no one-off padding/margins)</item>
          <item>Consistent type scale (no random font sizes)</item>
          <item>Single primary CTA per screen</item>
          <item>Sticky summary panel works: desktop sticky right + mobile sticky bottom pill</item>
          <item>Keyboard navigation is complete and pleasant (focus is visible and consistent)</item>
          <item>Loading states are skeletons (no abrupt jumps)</item>
          <item>Animation is subtle, purposeful, and smooth (60fps target)</item>
        </list>
      </subsubsection>

      <subsubsection title="Product Gates">
        <list>
          <item>Flow is obvious without reading documentation</item>
          <item>Each step explains itself in ≤ 6 words (microcopy rule)</item>
          <item>“I don’t know” paths exist on complex inputs</item>
          <item>Degraded mode exists and is calm/clear (no scary error language)</item>
          <item>Persistent “Ask a human” escape hatch is available in estimate flow + results</item>
        </list>
      </subsubsection>

      <subsubsection title="Engineering Gates">
        <list>
          <item>Reusable components (no copy/paste page junk)</item>
          <item>No ad-hoc colors; only tokenized CSS variables</item>
          <item>No new UI libraries beyond approved stack (shadcn/ui + Tailwind)</item>
          <item>No layout shift when prices/recalculations update (stable containers)</item>
        </list>
      </subsubsection>

      <subsubsection title="Accessibility + Performance Gates">
        <list>
          <item>Minimum 44px tap targets for interactive elements</item>
          <item>Visible focus ring states (consistent styling)</item>
          <item>Avoid janky animations and heavy JS on critical flows</item>
          <item>Number transitions tween smoothly without reflow spikes</item>
        </list>
      </subsubsection>
    </subsection>

    <subsection number="5.5.5" title="Luxury UI Execution Checklist (QA Phase Requirements)">
      <paragraph>This checklist must be used during the QA/Polish pass.</paragraph>

      <subsubsection title="Layout">
        <list>
          <item>Max-width container feels cinematic (intentional whitespace)</item>
          <item>Spacing is generous and consistent across sections</item>
          <item>Order summary is always present and readable</item>
        </list>
      </subsubsection>

      <subsubsection title="Copy">
        <list>
          <item>No long paragraphs</item>
          <item>Labels are small and understated</item>
          <item>Headings are short, confident, and not salesy</item>
          <item>Each step has a one-line explanation</item>
        </list>
      </subsubsection>

      <subsubsection title="Interaction">
        <list>
          <item>Price updates do not “jump” (stable layout; smooth transitions)</item>
          <item>Recalculation states show skeletons and do not block the user</item>
          <item>Step transitions feel guided and calm</item>
        </list>
      </subsubsection>

      <subsubsection title="Visual">
        <list>
          <item>No harsh borders; separators are subtle</item>
          <item>Shadows are soft; corners are consistent</item>
          <item>Accent color is used sparingly (high-signal only)</item>
        </list>
      </subsubsection>

      <subsubsection title="Mobile">
        <list>
          <item>One-hand usable layout</item>
          <item>Bottom sticky summary pill feels iOS-native and non-intrusive</item>
          <item>Primary CTA is always reachable without scrolling gymnastics</item>
        </list>
      </subsubsection>
    </subsection>

    <subsection number="5.5.6" title="Hero Screen Strategy (Build Only What Matters First)">
      <paragraph>
        To achieve maximum polish fast, build and perfect only the “hero screens” first.
        Everything else should inherit the system.
      </paragraph>
      <list>
        <item>Landing Hero (perfect)</item>
        <item>Configurator / Estimate Flow (perfect)</item>
      </list>
      <paragraph>
        Secondary pages (work/process/pricing/contact) should be derived from the same system after hero screens pass all gates.
      </paragraph>
    </subsection>

    <subsection number="5.5.7" title="Overengineering Guardrail (Stop Phrase)">
      <paragraph>
        If the build agent starts adding extra features or complexity, use this hard stop instruction:
      </paragraph>
      <paragraph>
        <bold>“Stop. No new features. Only improve perceived quality and consistency.”</bold>
      </paragraph>
      <paragraph>
        Additionally: keep the UI on mocked pricing data until the visual system is locked.
      </paragraph>
    </subsection>

    <subsection number="5.5.8" title="Microinteractions Spec (Optional but Strongly Recommended)">
      <paragraph>
        A premium product feel requires consistent microinteractions.
        The agent should generate a mini spec doc for:
      </paragraph>
      <list>
        <item>Number tween behavior (duration/easing; no layout shift)</item>
        <item>Hover / pressed states</item>
        <item>Loading / recalculating states</item>
        <item>Success / error states (luxury tone, calm messaging)</item>
      </list>
    </subsection>

    <subsection number="5.5.9" title="Master Claude Code Prompt (Reusable Contract)">
      <paragraph>
        This is the canonical prompt for building the luxury UI system and the two hero screens.
        It must be used as-is (adjust paths only if repo structure differs).
      </paragraph>

      <codeblock>
You are building the ManagerMattLLC landing page + token quote configurator UI.

Goal: Apple/Tesla-grade luxury product UI. Not “nice Tailwind.” It must feel expensive.

Rules:
- Minimal, whitespace-heavy, premium typography.
- One primary CTA per screen.
- Sticky right-side Order Summary on desktop. On mobile: sticky bottom summary pill.
- No random colors. Only a neutral palette + one accent.
- No visual clutter, no heavy borders. Use spacing, shadows, and subtle separators.
- Animations must be subtle and purposeful (60fps). Number transitions should tween smoothly.
- Accessibility is non-negotiable: keyboard nav, focus states, 44px targets.
- Performance: keep it fast (avoid heavy JS, avoid janky animations).

Hard requirement: you must produce these artifacts BEFORE writing UI code:
1) docs/ui/STYLE_GUIDE.md
   - tokens: spacing scale, type scale, radii, shadows, colors
   - motion rules: duration/easing list
2) docs/ui/COMPONENT_LIBRARY.md
   - components + variants (buttons, cards, stepper, toggles, sliders, badges, summary panel, skeletons)
   - usage rules (“do/don’t”)
3) docs/ui/PAGES.md
   - page layout blueprint for / (landing) and /estimate (configurator)

After docs are created, implement ONLY:
- / (hero + CTA + one trust section)
- /estimate (configurator + sticky summary)
Use shadcn/ui + Tailwind only.

Then do a “Polish &amp; QA Pass”:
- produce docs/ui/UI_AUDIT.md with a checklist and what you fixed
- add screenshots in docs/ui/screenshots/
- reduce noise (remove borders, tighten copy, unify spacing)

Do not build backend. Use mocked pricing data.
      </codeblock>
    </subsection>
  </section>

  <section number="6" title="Information Architecture (Routes)">
    <subsection title="Public">
      <routes>
        <route path="/">Home</route>
        <route path="/estimate">Mini-estimate + Full wizard</route>
        <route path="/estimate/results/:estimateId">Shareable results</route>
        <route path="/q/:quoteId">Public quote view, unlisted</route>
        <route path="/q/:quoteId/pdf">PDF download</route>
        <route path="/work">Work</route>
        <route path="/work/:slug">Case study</route>
        <route path="/process">Process</route>
        <route path="/pricing">Pricing</route>
        <route path="/contact">Contact</route>
        <route path="/legal/privacy">Privacy</route>
        <route path="/legal/terms">Terms</route>
      </routes>
    </subsection>

    <subsection title="Control Room (Clerk)">
      <routes>
        <route path="/control">Projects list + status</route>
        <route path="/control/projects/:projectId">Project detail</route>
        <route path="/control/projects/:projectId/changes">Changes list</route>
        <route path="/control/projects/:projectId/changes/:changeId">Change detail</route>
        <route path="/control/projects/:projectId/releases">Releases</route>
        <route path="/control/settings">Notification prefs</route>
      </routes>
    </subsection>

    <subsection title="Admin (protected)">
      <routes>
        <route path="/admin/leads">Leads</route>
        <route path="/admin/quotes">Quotes</route>
        <route path="/admin/projects">Projects</route>
        <route path="/admin/changes">Changes</route>
        <route path="/admin/catalog">Catalog (draft/published)</route>
        <route path="/admin/rates">Rates (draft/published)</route>
        <route path="/admin/outcomes">Outcomes (calibration loop)</route>
        <route path="/admin/analytics">Analytics</route>
      </routes>
    </subsection>
  </section>

  <section number="7" title="Core User Flows">
    <subsection number="7.1" title="Estimate → Quote (Public funnel)">
      <sequence>
        <step>Visitor enters Mini-estimate (3 questions) OR Full wizard</step>
        <step>
          Estimator returns:
          <list>
            <item>P10/P50/P90 tokens (input/output), hours, days</item>
            <item>confidence score + why</item>
            <item>modules + dependencies + cost drivers</item>
            <item>assumptions &amp; unknowns</item>
          </list>
        </step>
        <step>Visitor selects package (Prototype / MVP / Production)</step>
        <step>Assumptions Checklist must be confirmed before quote emailed</step>
        <step>Quote saved (versioned), share link + PDF generated, email sent</step>
      </sequence>
    </subsection>

    <subsection number="7.2" title="Quote acceptance → Project creation">
      <paragraph>Upon acceptance (manual in V1, automated later):</paragraph>
      <list>
        <item>project created</item>
        <item>retainer/budget plan selected</item>
        <item>kickoff checklist generated (access, keys, environments)</item>
      </list>
    </subsection>

    <subsection number="7.3" title="Control Room: Changes → Delta estimate → Approve → Ship">
      <sequence>
        <step>Client submits change request (bug/improvement/new idea)</step>
        <step>
          System generates:
          <list>
            <item>structured summary</item>
            <item>acceptance criteria</item>
            <item>clarifying questions (0–3)</item>
          </list>
        </step>
        <step>Delta estimate produced (P10/P50/P90 + drivers + confidence)</step>
        <step>
          Client chooses:
          <list>
            <item>Approve</item>
            <item>Clarify (answer questions)</item>
            <item>Defer</item>
          </list>
        </step>
        <step>You build; provide preview link; client reviews; approve; ship; release note posted</step>
      </sequence>
    </subsection>
  </section>

  <section number="8" title="Estimator &amp; Quote Engine (Core Requirements)">
    <subsection number="8.1" title="Inputs">
      <paragraph>BuildSpec from wizard:</paragraph>
      <list>
        <item>platform (web/mobile/both)</item>
        <item>audience (internal/public)</item>
        <item>auth complexity (none/basic/roles/multi-tenant)</item>
        <item>selected modules</item>
        <item>integrations</item>
        <item>AI features</item>
        <item>quality target (prototype/mvp/production)</item>
        <item>urgency</item>
        <item>unknown flags (“I don’t know” answers)</item>
      </list>

      <paragraph>Module Catalog (editable, versioned):</paragraph>
      <list>
        <item>base token anchors (input/output)</item>
        <item>base hours</item>
        <item>risk weight</item>
        <item>dependencies</item>
        <item>category</item>
        <item>“architect review trigger” boolean</item>
      </list>

      <paragraph>Rate Cards (editable, versioned):</paragraph>
      <list>
        <item>token material rates (input/output)</item>
        <item>markup</item>
        <item>labor pricing (hourly or points)</item>
        <item>buffers</item>
      </list>
    </subsection>

    <subsection number="8.2" title="Outputs (must be explainable)">
      <list>
        <item>
          P10/P50/P90 totals:
          <list>
            <item>tokens_in / tokens_out</item>
            <item>hours</item>
            <item>calendar days</item>
          </list>
        </item>
        <item>confidence score (0–100)</item>
        <item>
          evidence:
          <list>
            <item>source module IDs</item>
            <item>dependencies expanded</item>
            <item>multipliers applied</item>
            <item>manual adjustments + reason</item>
          </list>
        </item>
        <item>top 3–5 cost drivers</item>
        <item>assumptions list</item>
      </list>
    </subsection>

    <subsection number="8.3" title="Algorithm requirements">
      <list>
        <item>Dependency expansion (DAG) with dedupe</item>
        <item>
          Multipliers model:
          <list>
            <item>complexity</item>
            <item>integrations</item>
            <item>quality target</item>
            <item>iteration factor</item>
            <item>unknowns factor (“I don’t know” increases uncertainty)</item>
          </list>
        </item>
        <item>Monte Carlo simulation (recommended ~600 runs)</item>
        <item>Return percentiles + confidence (calibrated over time)</item>
      </list>
    </subsection>

    <subsection number="8.4" title="Guardrails for uncertain cases">
      <paragraph>If confidence below threshold OR architect triggers hit:</paragraph>
      <list>
        <item>Show ranges</item>
        <item>Mark estimate Needs Human Review</item>
        <item>Hide confidence in degraded mode when inputs are insufficient</item>
        <item>Persistent Ask a human escape hatch</item>
      </list>
    </subsection>

    <subsection number="8.5" title="Pricing composition (Materials + Build Fee + Risk Buffer)">
      <equations>
        <equation name="MaterialsCost">(tokens_in * rate_in + tokens_out * rate_out) * markup</equation>
        <equation name="BuildFee">labor points * pointRate (or blended hourly)</equation>
        <equation name="RiskBuffer">function(uncertaintyScore, integrationRisk, urgency)</equation>
        <equation name="Total">Materials + BuildFee + Buffer</equation>
      </equations>
    </subsection>

    <subsection number="8.6" title="Delta estimation (Control Room)">
      <list>
        <item>Support feature deltas and negative deltas (remove scope)</item>
        <item>Enforce floors for baseline overhead (QA, deploy, review time)</item>
        <item>Delta uses smaller simulation, still returns P10/P50/P90</item>
      </list>
    </subsection>
  </section>

  <section number="9" title="Wizard UX (Conversion + Accuracy)">
    <subsection number="9.1" title="Mini-estimate (Phase 1.5)">
      <paragraph>3-question flow:</paragraph>
      <sequence>
        <step>What are you building? (template/persona)</step>
        <step>Where will it live? (web/mobile/both)</step>
        <step>How complex? (simple/medium/complex + “I don’t know”)</step>
      </sequence>
      <paragraph>
        Outputs a rough range and prompts “refine estimate” in full wizard.
      </paragraph>
    </subsection>

    <subsection number="9.2" title="Full wizard requirements">
      <list>
        <item>
          Fast paths via templates:
          <list>
            <item>Internal dashboard</item>
            <item>SaaS with auth/roles</item>
            <item>Payments/subscription</item>
            <item>Automation tool</item>
          </list>
        </item>
        <item>“I don’t know” options + tooltip explanation</item>
        <item>Persistent Ask a human escape hatch</item>
      </list>
    </subsection>
  </section>

  <section number="10" title="Quote Trust Features (Close Rate)">
    <subsection number="10.1" title="Assumptions checklist (required before emailing quote)">
      <paragraph>Examples:</paragraph>
      <list>
        <item>I confirm my feature list is complete for this estimate</item>
        <item>I understand ranges may change with new requirements</item>
        <item>I understand third-party services may cost extra</item>
      </list>
    </subsection>

    <subsection number="10.2" title="Comparable past builds (anonymized)">
      <paragraph>Show 2–5 examples:</paragraph>
      <list>
        <item>module set</item>
        <item>final range</item>
        <item>approximate timeline tier</item>
      </list>
      <paragraph>Goal: credibility without revealing client details.</paragraph>
    </subsection>

    <subsection number="10.3" title="What happens if we’re wrong?">
      <paragraph>Remedies:</paragraph>
      <list>
        <item>Minor overrun: absorbed (within defined threshold)</item>
        <item>Material variance: re-estimate + approval gate</item>
        <item>Option to defer or descale scope</item>
      </list>
    </subsection>
  </section>

  <section number="11" title="Control Room (Client PM Layer)">
    <subsection number="11.1" title="Core UX">
      <list>
        <item>Columns: Inbox → Building → Review → Shipped</item>
        <item>
          Every card shows:
          <list>
            <item>budget burn / credits impact</item>
            <item>next checkpoint</item>
            <item>blockers</item>
            <item>SLA timer state</item>
          </list>
        </item>
      </list>
    </subsection>

    <subsection number="11.2" title="Change intake (structured)">
      <paragraph>Bug template requires:</paragraph>
      <list>
        <item>environment (device, browser)</item>
        <item>repro steps</item>
        <item>expected vs actual</item>
        <item>attachments required unless user explicitly cannot</item>
      </list>

      <paragraph>Feature template requires:</paragraph>
      <list>
        <item>user story</item>
        <item>acceptance criteria</item>
        <item>priority + why it matters</item>
      </list>
    </subsection>

    <subsection number="11.3" title="Approvals &amp; stakeholders">
      <list>
        <item>
          Multi-approver projects:
          <list>
            <item>required approvers list (optional)</item>
            <item>final approver role</item>
          </list>
        </item>
        <item>
          Prevent endless tweak cycles:
          <list>
            <item>soft revision cap per change request</item>
            <item>after cap: prompt to create a new change</item>
          </list>
        </item>
      </list>
    </subsection>

    <subsection number="11.4" title="Budgets &amp; credits">
      <list>
        <item>Plan defines monthly included credits (points)</item>
        <item>Each approval writes to a budget ledger</item>
        <item>
          Overages show options:
          <list>
            <item>add-on sprint</item>
            <item>one-time purchase</item>
            <item>defer</item>
          </list>
        </item>
      </list>
    </subsection>

    <subsection number="11.5" title="Release notes">
      <paragraph>Every shipped change adds:</paragraph>
      <list>
        <item>what changed</item>
        <item>how to verify</item>
        <item>preview/deploy links</item>
      </list>
    </subsection>
  </section>

  <section number="12" title="Operational Readiness">
    <subsection number="12.1" title="SLAs (Success Targets)">
      <paragraph>Define explicit targets:</paragraph>
      <list>
        <item>quote delivery latency (email)</item>
        <item>estimator response time</item>
        <item>PDF generation time</item>
        <item>TTR for change requests by tier</item>
        <item>approval → shipped median targets</item>
      </list>
    </subsection>

    <subsection number="12.2" title="Degraded mode rules">
      <paragraph>If inputs insufficient:</paragraph>
      <list>
        <item>show wider ranges</item>
        <item>hide confidence</item>
        <item>prompt for missing fields or human review</item>
      </list>
    </subsection>

    <subsection number="12.3" title="Retries, idempotency, durable execution">
      <list>
        <item>Email + PDF jobs must be idempotent</item>
        <item>
          Use Convex scheduled functions and/or durable components for retries/backoff
          <citationRef refId="15"/>
        </item>
      </list>
    </subsection>

    <subsection number="12.4" title="Runbooks (required)">
      <list>
        <item>Estimator failure runbook</item>
        <item>PDF generation failure + retry runbook</item>
        <item>Email delivery failure + retry runbook</item>
        <item>Degraded-mode UI messaging rules</item>
      </list>
    </subsection>
  </section>

  <section number="13" title="Security, Privacy, Compliance">
    <subsection number="13.1" title="Bot protection + rate limiting">
      <list>
        <item>Turnstile on public submits <citationRef refId="5"/></item>
        <item>Rate limiting rules on key endpoints <citationRef refId="6"/></item>
        <item>
          Deny-of-wallet controls:
          <list>
            <item>cap Monte Carlo runs per request</item>
            <item>cap anonymous requests per IP/email/day</item>
            <item>throttle attachment uploads</item>
          </list>
        </item>
      </list>
    </subsection>

    <subsection number="13.2" title="PII &amp; secrets handling">
      <list>
        <item>Minimal PII (email + optional name)</item>
        <item>“Never paste secrets into tickets”</item>
        <item>Provide secure method for keys (policy + tooling plan)</item>
        <item>Logging redaction rules</item>
      </list>
    </subsection>

    <subsection number="13.3" title="Data retention + export/delete">
      <list>
        <item>Retention policy for logs, attachments, quote history</item>
        <item>Export/delete flows (admin-driven in V1)</item>
      </list>
    </subsection>

    <subsection number="13.4" title="Public quote links">
      <list>
        <item>Unlisted by ID, not indexed</item>
        <item>Optional expiration + regenerate-by-email</item>
        <item>PDF download links should be signed/short-lived (presigned URLs) <citationRef refId="13"/></item>
      </list>
    </subsection>
  </section>

  <section number="14" title="Observability &amp; Analytics">
    <subsection number="14.1" title="Monitoring">
      <list>
        <item>Sentry errors + performance for Next.js <citationRef refId="3"/></item>
        <item>Better Stack structured logging <citationRef refId="4"/></item>
      </list>
    </subsection>

    <subsection number="14.2" title="Analytics event map">
      <paragraph>Track:</paragraph>
      <list>
        <item>estimate_start / mini_estimate_complete / wizard_complete</item>
        <item>estimate_view_results / refine_clicked</item>
        <item>quote_created / quote_emailed / quote_viewed / quote_pdf_downloaded / quote_accepted</item>
        <item>control_change_created / change_estimated / change_approved / change_ready_review / change_shipped</item>
        <item>budget_overage_prompted / budget_overage_accepted</item>
      </list>
    </subsection>

    <subsection number="14.3" title="Funnels + feature flags">
      <list>
        <item>Funnels to measure drop-off/conversion <citationRef refId="2"/></item>
        <item>Feature flags for safe rollout of estimator tweaks <citationRef refId="16"/></item>
      </list>
    </subsection>
  </section>

  <section number="15" title="Commercial / Legal Product Policies (Required)">
    <list>
      <item>IP ownership (who owns deliverables and when)</item>
      <item>Third-party cost disclosure (hosting, email, AI usage, payment fees)</item>
      <item>Estimate vs fixed bid language</item>
      <item>Cancellation &amp; refund policy (retainership, unused credits)</item>
      <item>“Who this is not for” block near CTA</item>
    </list>
  </section>

  <section number="16" title="Data Model (Convex)">
    <subsection title="Quotes and estimates">
      <list>
        <item>estimates (draft)</item>
        <item>quotes (draft/published)</item>
        <item>
          quoteVersions (immutable snapshots)
          <list>
            <item>includes rateCardVersion + catalogVersion + evidence payload</item>
          </list>
        </item>
        <item>quoteEvents</item>
      </list>
    </subsection>

    <subsection title="Catalog + pricing safety">
      <list>
        <item>moduleCatalogDraft, moduleCatalogPublished</item>
        <item>rateCardsDraft, rateCardsPublished</item>
        <item>publishEvents</item>
      </list>
    </subsection>

    <subsection title="Control Room">
      <list>
        <item>projects</item>
        <item>projectMembers</item>
        <item>changeRequests</item>
        <item>changeEvents (audit trail)</item>
        <item>budgetLedger (credits burn)</item>
        <item>releases</item>
        <item>notificationPreferences</item>
      </list>
    </subsection>

    <subsection title="Data quality loop">
      <list>
        <item>
          outcomes
          <list>
            <item>actual hours, actual credits, iteration count</item>
            <item>estimateId/quoteVersionId linkage</item>
          </list>
        </item>
        <item>calibrationRuns (optional)</item>
      </list>
    </subsection>
  </section>

  <section number="17" title="Phasing Plan (Final)">
    <phases>
      <phase number="0" title="Foundation">
        <list>
          <item>Luxury UI system (Section 5.5) + routes + skeleton pages</item>
        </list>
      </phase>

      <phase number="1" title="Quote-by-email MVP">
        <list>
          <item>Full wizard (or partial) + estimator v1 + quote artifacts</item>
          <item>Email delivery + PDF generation</item>
        </list>
      </phase>

      <phase number="1.5" title="Mini-estimate fast path">
        <list>
          <item>3-question estimate + refine into full wizard</item>
        </list>
      </phase>

      <phase number="2" title="Trust layer">
        <list>
          <item>assumptions checklist</item>
          <item>anonymized comparables</item>
          <item>“what happens if we’re wrong?”</item>
        </list>
      </phase>

      <phase number="3" title="Control Room v1">
        <list>
          <item>structured change intake</item>
          <item>delta estimates</item>
          <item>approve/clarify/defer</item>
          <item>budgets/ledger visible everywhere</item>
          <item>releases + notifications</item>
        </list>
      </phase>

      <phase number="4" title="Calibration loop + admin guardrails">
        <list>
          <item>outcomes capture</item>
          <item>draft/published catalog + rates + preview</item>
          <item>manual overrides with audit</item>
        </list>
      </phase>

      <phase number="5" title="Optional durable workflow expansion">
        <list>
          <item>Convex Workflow/Workpool or Inngest/Trigger.dev as volume grows <citationRef refId="8"/></item>
        </list>
      </phase>

      <phase number="6" title="Optional GitHub integration">
        <list>
          <item>PR status sync, issue creation, deeper automation</item>
        </list>
      </phase>
    </phases>
  </section>

  <section number="18" title="V1 Launch Acceptance Criteria">
    <subsection title="Public">
      <list>
        <item>Mini/full estimate works</item>
        <item>Results show explainable ranges + assumptions</item>
        <item>Quote generates + emails + share link + PDF download</item>
      </list>
    </subsection>

    <subsection title="System">
      <list>
        <item>Bot protection + rate limiting in place <citationRef refId="5"/></item>
        <item>Degraded-mode rules for low-confidence inputs</item>
        <item>Retry/idempotency for email/PDF flows with scheduling durability <citationRef refId="15"/></item>
      </list>
    </subsection>

    <subsection title="Control Room">
      <list>
        <item>Structured change requests</item>
        <item>Delta estimate + approval</item>
        <item>Budgets/credits + ledger entries</item>
        <item>Review stage + preview links</item>
        <item>Releases feed</item>
      </list>
    </subsection>

    <subsection title="Admin">
      <list>
        <item>draft vs published catalog/rates</item>
        <item>manual override with audit trail</item>
        <item>outcomes capture for calibration</item>
      </list>
    </subsection>
  </section>

  <appendix id="A" title="Codex Review Verdict + Implementation Notes (Addendum)">
    <subsection id="A1" title="High-level verdict (keep this framing)">
      <paragraph>This feedback is “turn your PRD into a real studio SaaS” level. It adds:</paragraph>
      <list>
        <item>Success SLAs + degraded-mode rules</item>
        <item>Data quality loop (moat)</item>
        <item>Wizard fast paths + “I don’t know”</item>
        <item>Quote trust mechanics (assumptions + comparables)</item>
        <item>Control Room transparency (budgets/checkpoints/blockers)</item>
        <item>Draft vs published guardrails for catalog/rates</item>
      </list>
    </subsection>

    <subsection id="A2" title="Good but choose carefully (keep optional)">
      <list>
        <item>TanStack Query: optional if Convex covers most data flows</item>
        <item>
          Inngest/Trigger.dev: great once retries/digests/recalcs grow; Convex scheduling can carry V1
          <citationRef refId="15"/>
        </item>
        <item>Playwright PDFs: justified if “premium quote artifacts” matter; otherwise keep V1 simple <citationRef refId="14"/></item>
      </list>
    </subsection>

    <subsection id="A3" title="One tweak to the advice (security vs UX)">
      <paragraph>
        Signed/expiring quote links are good—but don’t make quotes expire too aggressively:
      </paragraph>
      <list>
        <item>Default: unlisted</item>
        <item>Optional: long expiry (30–90 days) for sensitive quotes</item>
        <item>Provide “regenerate link via email”</item>
      </list>
    </subsection>

    <subsection id="A4" title="Patch guidance (where the PRD got strengthened)">
      <paragraph>
        This PRD already includes the Codex patch list as first-class requirements, specifically:
      </paragraph>
      <list>
        <item>Success SLAs (Section 12.1)</item>
        <item>Degraded mode + runbooks (Sections 12.2–12.4)</item>
        <item>Data quality loop + audit overrides (Sections 2 + 16)</item>
        <item>Mini-estimate fast path + templates + “I don’t know” (Section 9)</item>
        <item>Quote trust: assumptions + comparables + remedies (Section 10)</item>
        <item>Control Room clarity: budget burn + checkpoint + blockers + structured intake (Section 11)</item>
        <item>Risk/compliance: PII + secrets + retention + export/delete + rate limits (Section 13)</item>
        <item>Observability + feature flags (Section 14) <citationRef refId="16"/></item>
        <item>Luxury UI system &amp; quality gates (Section 5.5)</item>
      </list>
    </subsection>

    <subsection id="A5" title="Recommended adoption timing">
      <subsubsection title="Adopt now (V1 / immediate)">
        <list>
          <item>SLAs + degraded mode</item>
          <item>data quality loop (even manual outcome logging)</item>
          <item>mini-estimate fast path</item>
          <item>assumptions checklist</item>
          <item>structured change intake + budgets visible</item>
          <item>draft vs published catalog/rates</item>
          <item>retries/runbooks for email/PDF</item>
          <item>Luxury UI system artifacts + gates (Section 5.5)</item>
        </list>
      </subsubsection>

      <subsubsection title="Adopt soon (V1.5)">
        <list>
          <item>queue platform if retries/digests/recalcs grow (Inngest/Trigger.dev)</item>
          <item>optional expiring quote links + regenerate</item>
          <item>deeper observability hardening</item>
          <item>feature flags for estimator tuning <citationRef refId="16"/></item>
        </list>
      </subsubsection>

      <subsubsection title="Adopt later (V2)">
        <list>
          <item>deep GitHub PR sync automation</item>
          <item>approval gates tied to deploy</item>
          <item>automated estimator evaluation harness / confidence calibration</item>
        </list>
      </subsubsection>
    </subsection>
  </appendix>

  <references>
    <ref id="1" title="Clerk Next.js Quickstart">
      <href>https://clerk.com/docs/nextjs/getting-started/quickstart?utm_source=chatgpt.com</href>
    </ref>
    <ref id="2" title="PostHog Funnels Documentation">
      <href>https://posthog.com/docs/product-analytics/funnels?utm_source=chatgpt.com</href>
    </ref>
    <ref id="3" title="Sentry for Next.js Documentation">
      <href>https://docs.sentry.io/platforms/javascript/guides/nextjs/?utm_source=chatgpt.com</href>
    </ref>
    <ref id="4" title="Better Stack Next.js Logging Documentation">
      <href>https://betterstack.com/docs/logs/javascript/nextjs/?utm_source=chatgpt.com</href>
    </ref>
    <ref id="5" title="Cloudflare Turnstile Documentation">
      <href>https://developers.cloudflare.com/turnstile/?utm_source=chatgpt.com</href>
    </ref>
    <ref id="6" title="Cloudflare Rate Limiting Rules Documentation">
      <href>https://developers.cloudflare.com/waf/rate-limiting-rules/?utm_source=chatgpt.com</href>
    </ref>
    <ref id="7" title="Convex Scheduling Documentation">
      <href>https://docs.convex.dev/scheduling?utm_source=chatgpt.com</href>
    </ref>
    <ref id="8" title="Convex Workflow Component">
      <href>https://www.convex.dev/components/workflow?utm_source=chatgpt.com</href>
    </ref>
    <ref id="9" title="Convex Workpool Component">
      <href>https://www.convex.dev/components/workpool?utm_source=chatgpt.com</href>
    </ref>
    <ref id="10" title="Convex Retrier Component">
      <href>https://www.convex.dev/components/retrier?utm_source=chatgpt.com</href>
    </ref>
    <ref id="11" title="Inngest Background Jobs Documentation">
      <href>https://www.inngest.com/docs/guides/background-jobs?utm_source=chatgpt.com</href>
    </ref>
    <ref id="12" title="Trigger.dev Documentation">
      <href>https://trigger.dev/docs/introduction?utm_source=chatgpt.com</href>
    </ref>
    <ref id="13" title="AWS S3 Presigned URLs Documentation">
      <href>https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html?utm_source=chatgpt.com</href>
    </ref>
    <ref id="14" title="Playwright PDF Generation Guide">
      <href>https://checklyhq.com/docs/learn/playwright/generating-pdfs?utm_source=chatgpt.com</href>
    </ref>
    <ref id="15" title="Convex Scheduled Functions Documentation">
      <href>https://docs.convex.dev/scheduling/scheduled-functions?utm_source=chatgpt.com</href>
    </ref>
    <ref id="16" title="PostHog Feature Flags Documentation">
      <href>https://posthog.com/docs/feature-flags?utm_source=chatgpt.com</href>
    </ref>
  </references>

</prd>
```