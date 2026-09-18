# JazGot Tours: Iteration 2 QA report

## Upstream verification added 18 September 2026

The official repository is https://github.com/APC-SoCIT/APC_2026_2027_T1_SS231_G02-Jazgottours. Its default branch `main` pointed to `fffd30832c301c8bf9858f07615598977b456f1a` when checked live. That commit is dated 2 September 2026 and titled "fixed admin dashboard home page".

All 46 application files in `app`, `components`, `hooks`, `lib`, and `public` match the tested `Quality` copy after normalizing Windows text line endings. Every shared locked dependency definition matches. The copy adds only the Playwright test packages, an `.sf/` ignore rule, QA documents, and a Windows-compatible name for the diagrams folder. The renamed diagrams readme has matching content.

The recorded execution still belongs to the `Quality` checkout at `90f5c44`; it was not a fresh run in an upstream clone. The file comparison establishes that the application source and shared dependency definitions tested match upstream `main` at the checked commit. No changed application behavior required another test run. See [the comparison receipt](../../test/iteration-2/evidence/upstream-comparison.json).

Upstream contains a folder whose name ends in a space, `1. Diagrams and Artifacts `. Windows could download the Git repository but could not complete a normal checkout of that path. Comparison used Git's stored file contents directly. This is a separate repository portability issue, not an additional case in the existing 18-case result count.

Verified 18 September 2026. Source commit: `90f5c44aa7eb1fe36d6820a36da27d9110740694`. Execution owner: Codex using Playwright; no claim of personal execution by the presenter.

## Outcome

18 planned cases: **8 passed, 9 failed, 1 blocked**. 17 executed cases give a pass rate of **47.06%** (8/17). Passed/planned is **44.44%** (8/18). Execution completion is **94.44%** (17/18). All 18 have an outcome or blocker recorded. The 95% target is not met, PDF export fails, and High defects remain open. **Exit criteria are unmet.**

The original deck counted 19 cases, but its 11 listed cases plus seven regression cases total 18. One test case can include several checks; TC-014 contains three invalid-input variants and TC-016 contains five admin routes.

## Environment and provenance

- Windows x64, Node v22.19.0, npm 10.9.3, Next.js 16.2.6, React 19.2.4.
- Playwright with headless Microsoft Edge 153.0.4234.32 (Chromium), viewport 1440 by 1050.
- Production build served at http://localhost:3000.
- Clean npm ci failed with EBADPLATFORM for the Linux Tailwind dependency. Forced npm ci completed; this workaround does not turn TC-018 into a pass.
- Initial sandbox build could not fetch Google Fonts. A network-enabled build passed, without changing source.
- TypeScript check passed. Lint failed: 5 errors and 1 warning in existing application code. These quality gates are reported separately and are not extra cases in the 18-case denominator.
- App source, package manifest and lockfile were not edited. Testing scripts and documentation are separate.
- Main execution UTC: 2026-09-17T23:36:43.238Z. Admin completion UTC: 2026-09-17T23:37:43.328Z.

## Test basis and limits

Requirements are inferred from the original deck and current implementation where completed requirements were not available. TC-017 expects a submitted quotation record, but the page offers a preview without a record-submission action. It fails the written case; BUG-009 remains a scope clarification rather than a confirmed agreed-requirement defect. Proposed severities require team triage. Development assignees are pending.

Authentication and payment are simulated. No real payment, backend persistence, security, accessibility, performance or browser-matrix assurance is claimed. Supabase is an unused scaffold (BUG-005 observation); absence of tracked environment files does not prove deployed configuration is absent.

Historical Iteration 1: the written record reports 7 passes and 1 PDF failure; raw JSON labeled that failure Manual / Blocked. Both recorded no download and the lab error. This report does not rewrite historical records or claim 8 was the entire original backlog.

The original IDs TC-009 onward and UC-003 were used differently in earlier documents. IDs in this report follow the Iteration 2 deck: UC-001 booking, UC-002 payment/invoice, UC-003 data continuity, UC-004 admin. Interpret IDs together with iteration and title.

## Test data

Guest: QA Iteration Two Guest; contact: +639123456789; future date: 2026-09-27; Tour A, two guests, ETDF and lagoon add-ons. Expected total: (1350 + 400 + 200) * 2 = PHP 3900. Normal-format test card: 4242 4242 4242 4242, expiry 12/30, CVC 123. Invalid variants separately tested card abc, expiry 99/99, CVC abc. Past-date test used ten days before execution. Test credentials are synthetic. Historical positive-test dates were refreshed deliberately.

## Case results

| Case | Result | Actual result |
|---|---|---|
| TC-001 | Pass | Home page displayed three tour cards. |
| TC-002 | Pass | Clicking Tour A opened the sign-in modal. |
| TC-003 | Pass | Simulated signup opened the booking form. |
| TC-004 | Pass | Booking for 2026-09-27 redirected to checkout. |
| TC-005 | Pass | Two guests plus ETDF and lagoon add-ons displayed PHP 3,900. |
| TC-006 | Pass | Simulated processing redirected to dashboard. No real payment was attempted. |
| TC-007 | Pass | Dashboard displays confirmed status, reference and sample invoice details; this legacy case checks presence only. |
| TC-008R | Fail | No PDF downloaded. PDF Generation Error: Error: Attempting to parse an unsupported color function "lab" |
| TC-009 | Blocked | TC-008R produced no PDF, so content comparison could not execute. |
| TC-010 | Fail | Checkout shows 1 Pax and Pending Confirmation; entered 2 guests, 2026-09-27, +639123456789. Contact is absent. |
| TC-011 | Fail | Checkout and Pay button show PHP 1,350, while booked total was PHP 3,900. |
| TC-012 | Fail | Dashboard shows Juan Dela Cruz, 1 Guest, Pending Confirmation and PHP 1,350 instead of the QA booking. |
| TC-013 | Pass | Browser rejected submission: four required fields invalid; stayed on checkout. |
| TC-014 | Fail | Simulated payment accepted malformed card number, expiry, CVC and navigated to dashboard. |
| TC-015 | Fail | Booking accepted past date 2026-09-07 and navigated to checkout. |
| TC-016 | Fail | All five admin routes returned HTTP 200 and rendered content. /admin/quotation raised React #418 hydration error. Other four routes produced no page runtime error. |
| TC-017 | Fail | No quotation submit/save control exists. Page provides a live preview, simulated PDF and send actions, but no record creation. Requirement inferred from original deck; confirm agreed scope. |
| TC-018 | Fail | npm ci exited 1 with EBADPLATFORM for @tailwindcss/oxide-linux-x64-gnu@4.3.3. npm ci --force was required to continue QA. |

## Findings

### BUG-001: Invoice PDF export fails

Proposed severity: Medium. Disposition: Open. Related cases: TC-008R; TC-009. Owner: development team, assignee pending.

**Steps:** Open dashboard and click Download PDF Invoice.

**Expected:** A readable invoice PDF downloads.

**Actual:** No file downloaded. Console reports unsupported color function "lab".

**Evidence:** TC-008R.png; console.json

**Recommended action:** Make capture styles compatible or generate from data; retest file and contents.

### BUG-002: Checkout loses booking details and total

Proposed severity: High. Disposition: Open. Related cases: TC-010; TC-011. Owner: development team, assignee pending.

**Steps:** Book Tour A for two guests with both add-ons, then continue.

**Expected:** Checkout preserves two guests, date/contact and PHP 3,900.

**Actual:** Checkout shows one guest, pending date and PHP 1,350. Contact absent.

**Evidence:** TC-005.png; TC-010.png; TC-011.png

**Recommended action:** Pass actual booking state into checkout.

### BUG-003: Dashboard displays sample booking

Proposed severity: High. Disposition: Open. Related cases: TC-012. Owner: development team, assignee pending.

**Steps:** Complete the same booking and simulated payment.

**Expected:** Dashboard reflects the customer and PHP 3,900 booking.

**Actual:** Dashboard shows Juan Dela Cruz, one guest, pending date and PHP 1,350.

**Evidence:** TC-012.png

**Recommended action:** Render the actual booking and consistent status.

### BUG-004: Malformed card values produce simulated success

Proposed severity: High. Disposition: Open. Related cases: TC-014. Owner: development team, assignee pending.

**Steps:** Separately use card abc, expiry 99/99 and CVC abc with other fields valid.

**Expected:** Reject each invalid format.

**Actual:** All three variants navigate to the confirmed dashboard. Empty fields ARE rejected.

**Evidence:** TC-014.png; TC-014-card-number-input.png; TC-014-expiry-input.png; TC-014-CVC-input.png

**Recommended action:** Validate format and expiry; real gateway integration remains out of scope.

### BUG-005: Unused Supabase integration

Proposed severity: Low. Disposition: Observation. Related cases: Static review. Owner: development team, assignee pending.

**Steps:** Inspect lib/supabase.ts and imports.

**Expected:** Configuration and integration requirements need agreement.

**Actual:** Client exists but app does not import it. No active user-facing failure proven.

**Evidence:** lib/supabase.ts

**Recommended action:** Confirm backend scope and validate configuration before integration.

### BUG-006: Past tour date accepted

Proposed severity: Medium. Disposition: Open. Related cases: TC-015. Owner: development team, assignee pending.

**Steps:** Enter 2026-09-27 as a valid-date control; for negative test use date ten days before execution.

**Expected:** Reject past dates before checkout.

**Actual:** A date ten days before execution proceeds to checkout.

**Evidence:** TC-015-input.png; TC-015.png

**Recommended action:** Apply agreed date/lead-time rules.

### BUG-007: Clean Windows install fails

Proposed severity: Medium. Disposition: Open. Related cases: TC-018. Owner: development team, assignee pending.

**Steps:** Run npm ci from no node_modules on Windows x64.

**Expected:** Install succeeds without force.

**Actual:** EBADPLATFORM: Linux-only Tailwind native dependency. Forced install allowed QA to continue.

**Evidence:** clean-install.log; install-workaround.log

**Recommended action:** Remove direct Linux dependency and regenerate/verify platform-safe lockfile.

### BUG-008: Quotation hydration runtime error

Proposed severity: Medium. Disposition: Open. Related cases: TC-016. Owner: development team, assignee pending.

**Steps:** Open /admin/quotation in a fresh production-page load.

**Expected:** Page loads without runtime errors.

**Actual:** React error #418 occurs. Page recovers visibly. Math.random during render is a likely cause, also flagged by lint.

**Evidence:** admin-smoke.json; console.json; TC-016-quotation.png

**Recommended action:** Use a stable reference identifier; retest initial page load.

### BUG-009: Quotation record submission is absent

Proposed severity: Medium. Disposition: Scope clarification. Related cases: TC-017. Owner: development team, assignee pending.

**Steps:** Enter a unique client and inspect available actions.

**Expected:** Original deck expects submission and a resulting quotation record.

**Actual:** Live preview exists, but no submit/save record action. Fails the written case; requirement must be agreed.

**Evidence:** TC-017-filled.png

**Recommended action:** Confirm whether record creation belongs in this iteration, then implement or explicitly rescope.

## Evidence and reproduction

Evidence directory: [test/iteration-2/evidence](../../test/iteration-2/evidence). Main records: [results.json](../../test/iteration-2/evidence/results.json), [console.json](../../test/iteration-2/evidence/console.json), [admin-smoke.json](../../test/iteration-2/evidence/admin-smoke.json). The directory includes screenshots, browser-trace.zip, install logs, build logs and lint/typecheck logs.

After the documented install workaround, run npm run build, npm start -- -p 3000, then node test/iteration-2/run-qa.mjs. The runner requires installed Microsoft Edge and the app running locally. Test TC-018 separately before the workaround, from no node_modules; the browser runner carries the recorded clean-install outcome and does not redo npm ci itself. Results from a new run must replace narrative counts only after reconciliation.

React error #418 describes server/client hydration mismatch: https://react.dev/errors/418. The existing Math.random call during render is a suspected cause, not an isolated causal experiment.

## Exit assessment

All cases accounted for: met. At least 95% pass: unmet. Readable invoice PDF: unmet. No High customer-path defects: unmet. Evidence and proposed severity: recorded. Named developer ownership: pending. Source fix identification and formal requirements review were not available, so the run is a documented assessment with entry exceptions rather than a claim that every entry condition was met.
