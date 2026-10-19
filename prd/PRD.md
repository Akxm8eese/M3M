# The Body Zodiac | Beta 1 PRD
KORE TRUTHS • Owner: Mr.Reese • Version 0.1 • 18 October 2026, 22:45 America/New_York

## 1. Product decision
Build an educational, mobile-friendly anatomy explorer connecting twelve zodiac chapters, body regions, nature symbolism, and reviewed food information. Support Mr.Reese’s wellness teaching with a clear distinction between traditional interpretation and evidence-backed education. Beta 1 tests comprehension and usability; it does not test health outcomes.

Status: implementation specification, not a completed or deployed application. Cohort, timeline, hosting, and staffing below are proposed planning defaults. Mr.Reese approves commercial and brand decisions; engineering owns technical readiness; named content reviewers must approve factual claims before release.

## 2. Source baseline and findings
Source A: supplied “The Body Zodiac_ Signs, Structures & Nature’s Signatures.html”. Source B: supplied “FF AGENTS.pages”, whose Agent Instructions define Directive → Orchestration → Execution, directives/, execution/, intermediate separation, annotated code, and deployment/maintenance README with dated revisions.

Source A contains twelve sign records, element/realm/animal filtering, food detail panels, symbolic tissue-salt mappings, anatomy labels, front/back/side controls, skin/muscle/bone/fascia layers, anterior/posterior plates, and a rotating spindle presentation. Embedded images are present. Inspection was static; no runtime or clinical validation has been performed.

Engineering findings: multiple later assignments redefine interaction behavior; views use separate coordinate maps; setInterval and requestAnimationFrame coexist; innerHTML builds content; side transitions use a delayed callback; document/window handlers handle dragging; some SVG hotspots rely on pointer interaction. These are review risks, not confirmed runtime failures. The spindle uses layered 2D artwork: do not describe it as anatomically accurate volumetric 3D.

Content findings: tooltips contain quantitative and qualitative nutrition claims without structured claim-level sources; embedded artwork has no demonstrated licensing record. Existing disclaimers are useful but do not replace evidence and asset review. Do not carry claims into production as verified merely because they appear in the prototype.

## 3. Users and primary jobs
- Adult learner: explore a body region, understand its name/function, then inspect related symbolic and food information.
- Wellness facilitator: demonstrate a region during a KORE TRUTHS session and explain the boundary between tradition and science.
- Beta maintainer: reproduce feedback, inspect a versioned release, and roll back safely.

Happy path: open invitation → read educational framing → select a body region or accessible sign list → inspect region → choose a food → see nutrients, preparation notes, evidence, and allergens → submit feedback. No birth date, medical history, or personal injury details are needed.

## 4. Beta scope
Must ship: all 12 reviewed sign chapters; front/back and spindle view; static orientation alternative; skin/bone/muscle/fascia modes with reviewed descriptions; synchronized accessible region list; element/realm/animal filters; food detail disclosure; evidence labels; source links; anonymous usability feedback; reproducible build and rollback.

Side view is conditional: retain only if artwork and hotspot alignment pass review. Otherwise disable it visibly before inviting testers. No fabricated interpolated anatomy.

Deferred: true 3D mesh, account/profile storage, personalized diets or workouts, supplement dosing, treatment advice, medical scans, injury reconstruction, vagus nerve mapping, subscriptions, wearable integration, AI chat, social features, and language-wide localization. English/Latin/French anatomical labels already present may remain only after review; interface localization is deferred.

## 5. Functional requirements and acceptance criteria
| ID | Priority | Requirement | Pass condition |
|---|---|---|---|
| R01 | P0 | Educational framing | First session shows anatomy/nutrition vs tradition explanation; remains reachable from every detail view. |
| R02 | P0 | Twelve chapters | Exactly 12 unique signs; each opens from list and map; same selected ID appears in all views. |
| R03 | P0 | Filters | OR within a group, AND between groups; count equals visible chapters; All 12 clears all groups; zero results offers reset. |
| R04 | P0 | Selection/filter synchronization | Selecting a region outside the filter clears conflicting filters with visible notice, selects chapter, and reveals it. Hidden chapters never become invisible destinations. |
| R05 | P0 | Orientation | Front/back and spindle share state; front/back button pauses rotation and lands within 1 degree; selection never unexpectedly rotates a user-controlled view. |
| R06 | P0 | Motion and gestures | Spin is off by default; explicit start/pause, speed 0–120 degrees/sec; drag pauses spin; pointercancel/up outside viewer ends drag; vertical mobile scrolling remains usable. |
| R07 | P0 | Layers | One active layer; only visible hotspots respond; changing layer closes stale details; unsupported view/layer combinations show an explanation, never stale art. |
| R08 | P0 | Food details | Click, touch, Enter, Space open; Escape closes; expanded control exposes state; focus returns after closure; no hover-only information. |
| R09 | P0 | Claims and sources | Every published factual claim references reviewed source records; symbolic statements labeled Traditional/Symbolic; unreviewed claims withheld. |
| R10 | P0 | Tissue salts | Historical association only; exclude dosing, deficiency diagnosis, and implied health efficacy; clearly separate elemental symbols from nutrient amounts. |
| R11 | P0 | Anatomy hotspots | At 320, 768, and 1440 CSS px, anterior/posterior overlays match reviewer-approved landmark fixtures; list alternative accesses every hotspot. |
| R12 | P0 | Feedback | Category, optional requirement ID, release version, and max 1,000-character comment; pending/success/failure states; duplicate-submit prevention; retry preserves text. |
| R13 | P0 | Accessibility | Keyboard completes core task; named buttons, visible focus, logical order, announced filter count; 44px target aim; WCAG 2.2 AA audit target, not a claim of certification. |
| R14 | P0 | Failure states | Invalid data blocks deployment; missing artwork gives readable list fallback; offline feedback explains failure; no content disappears silently. |
| R15 | P1 | Side view | Only enabled following independent coordinate and layer QA; no claim that rotating a flat plate exposes internal depth. |

P0 items are required for first invitations; P1 is optional. No P0 may be waived silently.

## 6. Content and visual design contract
Retain the title and region-led learning concept. Proposed brand tokens from Mr.Reese’s KORE TRUTHS palette: ink #16181C, bone #EFEAE0, ember #BF4E2C, verdigris #5E7C6C. Validate contrast for actual combinations; do not use color alone to distinguish element or evidence status.

Mobile order: title/framing → view/layer controls → explorer → selected-region details → filter controls → chapter cards → feedback. Desktop can place explorer and details side by side. Long nutrition notes use expandable sections. Tooltips must stay inside the viewport or become inline disclosures. No automatic spin or forced smooth scrolling under reduced-motion preference.

Each region separates: anatomical name/function; traditional zodiac association; nature metaphor; reviewed food information. Label exercise examples as general education and do not prescribe exercises based on zodiac sign. Fascia-chain descriptions must identify the teaching model and uncertainty. Do not use “cleansing”, “protects”, or other implied treatment claims without an approved specific evidence statement.

## 7. Proposed technical architecture
Use a static TypeScript web application with declarative components and validated versioned JSON content. A lightweight component framework and bundler are an implementation choice, not a dependency already present. Keep rendering local and deterministic. No runtime LLM is required. Split embedded artwork into versioned assets after licensing review, optimize without altering anatomical alignment, and use one coordinate manifest per view with explicit viewBox/transforms.

Directive layer: human-readable SOPs in directives/. Orchestration layer: CI and maintainers sequence validation, build, tests, content review, and release. Execution layer: scripts in execution/ perform deterministic validation and packaging. App modules separately implement rendering, state, and gestures. Secrets belong in the hosting secret store; a local .env is ignored by git. Never put secrets in client bundles.

Recommended repository: app/components, app/state, app/viewer, content/, assets/, specs/, directives/, execution/, tests/, and .tmp/. This kit supplies planning documents, a contract schema, one deterministic validator, and QA templates. It does not supply the production app or an operational feedback endpoint.

## 8. Canonical interaction state
State: selectedSignId, layer, orientation, angleDegrees, spinning, speedDegreesPerSecond, filterSets, openFoodId, activeView. All screens derive from this state; no independent selected-sign flags. Transitions: SET_FILTER recalculates count; SELECT_SIGN reconciles filters and opens details; SET_LAYER closes stale overlays; SET_ORIENTATION stops spin; DRAG_START cancels animation targets and pauses spin; DRAG_END releases capture; RESET clears filters and detail state. Use pointer capture plus pointercancel cleanup. Avoid timeout-driven view switches. One animation loop runs only for active visible animation; suspend in background tabs and respect reduced motion.

## 9. Feedback, privacy, and access
Beta proposal: 10–20 invited adults for 14 days, including mobile learners and facilitators. Invitations are not sent by this kit. Gate beta through host-supported access control; a hidden URL is not access control. Public launch is a separate decision.

Feedback contract: POST /api/feedback, application/json, category [bug, confusing_content, suggestion], releaseVersion, optional requirementId, comment max 1,000 chars; optional random session token, no name/email. Return 201 with opaque receipt ID, 400 invalid payload, 429 throttled with retry delay, 503 unavailable. Server validates lengths/enums, rejects unknown fields, escapes display, caps body at 8KB, throttles abuse, and never trusts client release identifiers for authorization. Restrict review interface to maintainers. No credentials in frontend.

Proposed retention: feedback deleted after 90 days; operational logs after 30 days; no raw comments in analytics/error telemetry. Warn against entering private health details. Mr.Reese confirms retention and feedback operator before invitation. Analytics are optional and require explicit opt-in; app works without them. If external services are chosen, document their access and deletion procedure first. No assertion of legal compliance is made by this specification.

## 10. Nonfunctional release targets
- On representative midrange mobile hardware and a defined throttled 4G profile, p75 LCP ≤2.5 seconds and CLS ≤0.1 over at least 20 scripted cold loads. Record device/profile/build and raw results; targets are not measured outcomes.
- Core navigation and food selection respond within 200ms under that profile after load. During rotation, ≥30fps over a 30-second trace; reduce detail or keep static mode if missed.
- Zero uncaught errors during scripted critical paths; no unresolved critical/high security findings in reviewed dependency and application checks.
- Current and previous major Safari/iOS Safari, Chrome/Android Chrome, Firefox, and Edge at execution time; record actual versions instead of claiming untested compatibility.
- HTTPS, restrictive asset/connect policy, no third-party scripts by default; dependency lockfile; source text rendered without unsafe HTML injection.

## 11. Measurement and decision rules
Instrument opt-in events only: region_selected, layer_changed, filters_applied (count only), food_opened, feedback_submitted, task_completed. Envelope: event, releaseVersion, UTC timestamp, random session token; no DOB, zodiac birth data, raw comments, medical data, or fingerprinting. Facilitated observations can replace analytics for all testers.

Activation = testers who select a region and open a food / testers who begin task. Target ≥80%. Comprehension = testers correctly identify symbolism as tradition and nutrients as evidence-based content / testers answering debrief; target ≥90%. Critical-task success = unassisted completion / attempts; target ≥85%. Report numerators and denominators, missing responses, devices, and failure notes. A small beta provides directional findings, not statistical proof.

Proceed to expanded beta only if all P0 gates pass, ≥10 testers finish, ≥90% comprehension, ≥85% task success, zero open severity 1/2 issues, and Mr.Reese plus engineering/content leads approve. Otherwise fix and retest affected paths. Do not call success from engagement alone.

## 12. Delivery plan and responsibilities
Proposed effort: 4–6 weeks with one experienced frontend engineer, part-time QA/design, and independent anatomy/nutrition reviewers; estimate only, pending asset/content volume and hosting decisions.

Week 1: inventory, rights, schema, content audit, state model. Week 2: viewer and accessible list. Week 3: filters, foods, evidence rendering, feedback integration. Week 4: accessibility, browser/device, performance and release rehearsals. Weeks 5–6 if needed: review corrections and beta observation. Calendar dates start after staffing and platform are confirmed.

Mr.Reese: product/brand owner and cohort decision. Engineer: implementation, security checks, release, rollback. Content reviewers: anatomy and nutrition evidence approvals; historical reviewer for attributed traditions. QA lead: recorded acceptance evidence and triage. One person may hold multiple engineering roles; content approvals require relevant expertise.

## 13. Risk register and decisions
| Risk | Impact | Mitigation / owner |
|---|---|---|
| Symbolic association interpreted as treatment | Misunderstanding | Separate evidence labels, comprehension test; content lead |
| Inaccurate or unlicensed anatomy art | Misleading display / rights issue | Rights ledger and landmark signoff; product/content |
| Flat rotation implies true 3D | False expectations | Label as rotating illustration; engineer/design |
| Gesture/keyboard conflict | Excludes mobile/keyboard users | Pointercancel, capture and list fallback tests; QA |
| Unreviewed food claims | Incorrect education | Claim-level reviewed sources; nutrition reviewer |
| Feedback receives sensitive information | Privacy exposure | Minimize fields, restricted access, deletion schedule; operator |

Decisions before invitations: confirm educational product scope; select host/access gate and feedback operator; name reviewers; resolve image rights; accept cohort and retention; approve final beta build. These decisions do not block preparation of this kit. Runtime functionality, evidence accuracy, accessibility compliance, performance, and deployment remain unverified until implementation and recorded checks.
