# JazGot Tours: Iteration 2 presenter notes

Ten slides, approximately 10–15 minutes. The 20 September version is reserved for Iteration 3 testing.

## 1. Introduction

This presentation reports the second QA iteration for JazGot Tours. The execution was on 18 September 2026 using the Quality copy. We compared its application source with the official repository main branch at commit fffd308, so the tested application code matched that baseline. The purpose today is to close the actions from Iteration 1, show an updated requirements traceability matrix with execution evidence, explain defect priorities, and set out the third iteration plan. A later official repository update arrived on 20 September. Following the agreed reporting boundary, that version is for Iteration 3. The results in this presentation remain the recorded Iteration 2 result.

## 2. Previous action items

The previous iteration recorded eight cases: seven passed and one PDF download failed. Its passing assertions mostly established that screens opened and navigation worked. They did not reliably compare the booking details entered by the customer with the values on later screens. Our action in Iteration 2 was to retest the PDF problem, then add those accuracy checks. We also executed negative input checks, admin smoke checks and a clean Windows setup case. The PDF failure remained open. The wider checks exposed booking data changes between screens. Fix owners were not assigned in the material we received, and the written expectation for quotation record creation still needs agreement. The four figures at the top are the recorded first iteration baseline, not the Iteration 2 result.

## 3. RTM coverage

RTM means requirements traceability matrix. It answers which expected behavior each test addresses, what we observed, whether it passed, and where the supporting evidence is. We reconstructed the Iteration 2 matrix from the supplied deck, the test cases and the implemented interface because formal approved requirements were unavailable. The workbook gives one row to every case and links it to screenshots, logs or JSON. UC-001 has six cases, with five passes and one failure for a past tour date. UC-002 has six cases, with three passes, two failures and one blocked PDF content check. UC-003 covers booking continuity and all three cases failed. UC-004 has two admin cases, both failed under the written expectations. The installation case failed. For TC-017, quotation record creation, we record the failed written case while explicitly requesting scope agreement.

## 4. Execution summary

Across the RTM there are eighteen planned cases. Eight passed, nine failed and one was blocked. Seventeen reached either a pass or fail outcome. Eight divided by seventeen is a 47.06 percent executed pass rate, below the 95 percent target. Eight divided by all eighteen planned cases is 44.44 percent. TC-009 is blocked because the PDF download test failed and no file existed to inspect. The results JSON and evidence files support the individual rows of the RTM; the separate spreadsheet lets reviewers inspect each expectation and observation. The first iteration pass rate should not be used as a direct measure of development regression because this round added deeper data accuracy checks.

## 5. Booking evidence

This table is a concrete trace from requirement to execution. The customer chose Tour A with two guests and two add-ons. The booking form calculated 3,900 pesos and accepted September 27 as the future tour date. Checkout showed one guest, 1,350 pesos and a pending date. The dashboard repeated those values and used a sample name. TC-010, TC-011 and TC-012 failed on the mismatch. The linked screenshots show the input and subsequent pages. These defects matter because the customer could proceed while reviewing a transaction different from the one requested. The requirement is that guest count, tour date, contact details, add-ons and total remain consistent across the flow. The newer source still contains hardcoded checkout values, but its behavior belongs to Iteration 3 retesting.

## 6. PDF evidence

The invoice PDF failure is the carried defect from Iteration 1. The current iteration retest, TC-008R, again produced no downloaded file. The console recorded an unsupported lab colour function in html2canvas. TC-009, which would compare the contents of the downloaded invoice with the on-screen details, was blocked because there was no PDF. The impact is straightforward: the customer cannot obtain or check the invoice file. This is why the two cases have different outcomes, failed download and blocked content comparison. The retest after a developer change must confirm that a PDF downloads, opens, is readable and contains the correct booking data. The evidence file names are shown on this slide.

## 7. Defect priorities

We recommend the booking data defects, BUG-002 and BUG-003, as the first priority. They change what the customer appears to purchase and what the dashboard confirms. They were proposed as high severity in the report. The PDF defect is next because it prevents delivery of the invoice and blocks the content test. The old checkout form accepted malformed card values, a high severity finding for that tested version. However, the newer version replaces that form with a PayMongo redirect. We will retire the obsolete card field assertion and test the new gateway flow in a controlled sandbox in Iteration 3. Priority describes urgency for the next fixes and tests; the proposed severities and owners still need development team triage.

## 8. Remaining issues

Other findings also need a decision. TC-015 showed that the booking form accepted a past tour date. TC-018 showed a clean Windows install failing on a Linux-only Tailwind dependency; a forced install let us continue QA but did not change that case result. TC-016 found a React hydration error on the quotation page. All five admin routes returned page content, so this was not a blank page. TC-017 expected quotation submission and record creation, but the page had a preview without a save or submit action. We label that a scope clarification, since the agreed requirement was not available. Unused Supabase integration was only an observation in the tested version, not a confirmed customer defect. The new checkout API changes backend use, so that observation also needs fresh assessment in Iteration 3.

## 9. Iteration 3 plan

The third iteration will use official main commit 2f0d932, the version merged on September 20, as a new baseline. Its changes add a PayMongo checkout route and pending booking insertion into Supabase, remove the local raw card fields, and improve the booking modal on smaller screens. We will update the RTM before execution because some old payment cases no longer match the new interface. We should use a configured test or sandbox payment environment and never treat a redirect alone as proof of a completed payment. The highest value regression is one booking with two guests and add-ons, checked through the checkout request, pending record and return page. We will then repeat the PDF, past date, Windows setup and admin checks, clarify quotation scope, and attach new evidence and outcomes. The new code has not been counted as an Iteration 2 fix.

## 10. Iteration 2 decision

The Iteration 2 exit criteria were not met. We accounted for all eighteen cases, but the executed pass rate was below the 95 percent target, PDF export failed and high severity booking data findings remained. This is a completed QA assessment of the tested baseline, not a claim that the latest repository version was retested. The full RTM, test workbook, report and screenshots support questions on individual cases. The next step is to agree defect owners and quotation scope, then execute the revised Iteration 3 matrix on the newer build. Thank you.
