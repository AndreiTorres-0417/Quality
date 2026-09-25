# Presenter guide: JazGot Tours Iteration 2

**Source verification:** On 18 September 2026, the official GitHub repository's `main` was `fffd308` (2 September, "fixed admin dashboard home page"). All 46 application files match the tested `Quality` copy after accounting for Windows line endings. All shared dependency definitions match; the copy adds Playwright and QA material. The results were executed on the copy, with this comparison establishing its match to upstream.

**If asked whether the copy was outdated:** "We compared it against the official repository's current main branch. The application source and shared locked dependencies match. The copy adds testing tools and documentation. Our evidence identifies both commits."

## The one-minute explanation

JazGot Tours lets a customer browse a tour, enter booking details, move through simulated payment, view a booking, and request an invoice. The live QA run shows that navigation works, but actual customer data does not survive the journey. A two-person PHP 3,900 booking becomes a one-person PHP 1,350 booking on checkout and the dashboard. PDF download fails. Empty payment fields are rejected, but malformed nonempty card details and past tour dates are accepted.

**Remember: 18 cases, 8 pass, 9 fail, 1 blocked. 47.06% pass among the 17 executed cases. Exit criteria unmet.**

## Slide-by-slide speaking notes

### Slide 1

Good morning. This is the Iteration 2 QA report for JazGot Tours. The live verification run on 18 September 2026 covered the 18 cases actually listed in the original deck. Results are eight pass, nine fail and one blocked. The original deck said nineteen, but that was a counting error. These are tests of a local prototype with simulated authentication and payment.

### Slide 2

Iteration 1 recorded seven passes and one PDF-download failure among eight customer-flow cases, giving 87.5 percent. Those earlier passes mainly established navigation and the presence of information. They did not establish that the information belonged to the customer. The raw JSON and written report used different labels for the PDF issue; both recorded that the download failed. The historical figures are taken from the supplied records, not a recreation of the old build.

### Slide 3

The four objectives were to verify the PDF fix, preserve the working navigation, follow actual customer information between screens, and check invalid inputs. Retesting targets a particular reported bug. Regression testing checks whether previously working behavior still works. Negative testing passes when the app correctly rejects invalid input.

### Slide 4

We covered the customer booking path, checkout, dashboard and PDF export, data continuity, basic admin behavior, invalid inputs, and clean Windows installation. We did not test production payments, security, load, accessibility conformance or a browser matrix. UC identifiers here follow the Iteration 2 deck. Earlier documents used UC-003 for admin, so the workbook makes the current mapping explicit. Requirements are inferred from the implementation and supplied deck where no completed requirements were available.

### Slide 5

The tested source is commit 90f5c44aa7eb1fe36d6820a36da27d9110740694. Custom color values use hex, and PDF capture excludes controls, but that does not prove export works. Supabase is present only as an unused client. A clean npm ci on Windows failed with EBADPLATFORM. To continue QA without changing submitted source, we used npm ci --force and built with network access for Google Fonts. Build and TypeScript passed. Lint reported five errors and one warning.

### Slide 6

The PDF failure is now reproduced, not merely suspected. Clicking Download PDF Invoice produced no download, and the console reported an unsupported color function named lab. html2canvas renders the invoice region into an image, and jsPDF packages it as a PDF. The image-rendering step failed. UC-002-BUG-001 remains open. The next case, checking PDF contents, is blocked because no file exists. No one should claim the PDF was opened or visually inspected.

### Slide 7

The proposed fixes remain options for the development team. They can constrain capture styles to supported color values, change relevant theme values with visual regression checks, or generate the PDF from structured booking data. None of these proposals has been implemented in this QA run. The acceptance condition is a downloaded, readable and accurate invoice.

### Slide 8

Four confirmed customer-flow findings matter most here. A two-person booking with both add-ons totals 3,900 pesos, but checkout and the dashboard show one person and 1,350 pesos. The dashboard also substitutes a sample name. Payment accepts malformed nonempty card values. We separately tested an alphabetic card number, an impossible expiry format and an alphabetic CVC. All produced simulated success. Empty fields are correctly rejected, so the original claim that no validation exists was wrong. A past tour date was also accepted.

### Slide 9

There are eighteen cases: seven regression, one retest, six new functional cases, three negative cases and one setup case. The table shows the eleven cases beyond the seven regression cases, with their executed status. TC-009 is blocked by the failed PDF export. TC-017 fails the behavior written in the original deck, but its record-creation requirement still needs confirmation. Updated test data uses a future date so the old September 15 date does not accidentally become an invalid-input test.

### Slide 10

Eight tests passed, nine failed, and one was blocked. Seventeen of eighteen cases reached a pass or fail outcome, so execution completion is 94.44 percent. The executed-case pass rate is eight divided by seventeen, or 47.06 percent. Passing cases as a share of the whole planned set are eight divided by eighteen, or 44.44 percent. We report both denominators openly. The first and second iterations cover different sets, so their pass rates alone do not measure a decline in the software.

### Slide 11

We accounted for all eighteen cases. However, exit criteria are not met: the pass rate is below the target, PDF export fails, and high-severity booking-data and validation defects remain open. Entry was also conditional because the clean install failed and a workaround was needed. A completed QA report can report failed exit criteria. It does not certify release readiness. Severity and owner assignments are proposed; actual developer assignment remains pending.

### Slide 12

Additional findings are the Windows installation failure and a React hydration error on the quotation page. Hydration means React connects the server-rendered page to the interactive browser application. Different server and browser text can cause the error. All five admin routes returned HTTP 200 with content, but the quotation page raised error 418. It recovered visibly; it was not a blank-page crash. The quotation case also expected record submission, but only preview actions exist. That is a failed written case with a requirement clarification outstanding. Supabase remains an observation rather than a demonstrated live defect.

### Slide 13

Tests ran against the local production build using Playwright and headless Microsoft Edge, which uses Chromium. We saved screenshots, console output, a browser trace and per-case results. The PDF inspection was blocked because export failed. Authentication and payment are simulated. The app source and package files were not changed. The build required access to Google Fonts, and the install workaround is documented in the report.

### Slide 14

Our recommendations are to carry booking data through the customer journey, validate malformed inputs and past dates, fix PDF export, correct the platform-specific dependency, and resolve the quotation runtime error. Confirm the scope of quotation record creation before calling it a required production feature. Each implemented fix should receive its own retest and relevant regression checks. The QA team documents these actions; it has not implemented them in the submitted app.

### Slide 15

The navigation checks pass, but the actual booking details are wrong and PDF export still fails. Eighteen cases are accounted for: eight passed, nine failed and one is blocked. Exit criteria are unmet. The corrected deck is accompanied by the execution workbook, detailed report and evidence. Questions can be answered from those records rather than from assumptions about a completed production booking.

## Terms in plain English

- QA: compare expected and actual behavior, document problems and verify fixes.
- Use case: a user goal. Test case: specific steps and expected result.
- Retest: check a reported bug after a fix. Regression: recheck existing behavior.
- Happy path: normal valid input. Negative test: invalid input, which should be rejected.
- Smoke test: basic loading and runtime check. HTTP 200 means a response arrived successfully, not that all behavior is correct.
- Hardcoded: fixed sample values in source. Data continuity: keeping the same booking information between screens.
- Persistence: keeping records beyond temporary screen state, according to requirements. A database is not required merely to carry state between pages.
- Simulated payment: the app displays success without charging money.
- html2canvas: renders webpage content into an image. jsPDF: produces the PDF containing that image.
- Hex / lab / oklch: different ways CSS represents colors. The capture library reported an unsupported lab value.
- Hydration: React connecting server-rendered content to browser interactivity. Error 418 means they did not match.
- Severity: impact. Priority: urgency. Owner: person responsible for resolving the issue.
- Pass: observed result matches expected. Fail: it does not. Blocked: a prerequisite prevents execution.

## Likely questions

**Did you execute these personally?**
The current run was executed through Playwright by Codex and is documented with screenshots, logs and a browser trace. I am presenting those recorded results. I did not personally perform the earlier team's tests.

**Why did checkout pass before?**
The old case checked navigation. The added cases compare actual guest details and totals. Passing a narrow assertion does not prove the entire feature is correct.

**Is the PDF fixed?**
No. The live retest reproduced the lab parsing error and produced no file.

**Why is TC-009 blocked while the continuity tests fail?**
There is no PDF to inspect, so TC-009 lacks its prerequisite. Checkout does display a result and that result is wrong, so continuity tests fail.

**Why 18 instead of 19?**
The original list has eleven cases plus seven regression cases. Its total and chart were wrong.

**How did you calculate 47.06%?**
Eight passes divided by seventeen cases with a pass/fail outcome. We also disclose eight divided by all eighteen planned cases: 44.44%.

**Does the lower rate mean development made the app worse?**
Not necessarily. The second round checks behaviors that the first round did not test.

**Why did you use force for installation?**
To continue assessing the app without altering the submitted source after capturing the real clean-install failure. TC-018 remains failed.

**Are empty card fields accepted?**
No. The live test confirmed native required-field validation. The failure is malformed nonempty card values.

**What does the admin failure mean?**
All five routes return content, but quotation raises a recoverable React hydration error. Its expected record-submission action is also absent; that requirement needs scope agreement.

**Is Supabase a confirmed bug?**
No active failure was demonstrated. It is an unused integration scaffold, recorded separately as an observation.

**Is the application ready?**
The stated exit criteria are not met. Booking data, validation and export need fixes and retesting. The app also remains a prototype with simulated payments.

**What should happen next?**
Development should resolve the documented defects, clarify quotation scope, identify each fix, and return the build for retesting.
