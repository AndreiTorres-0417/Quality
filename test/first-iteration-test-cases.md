# JazGot Tours - First Iteration Test Cases

Test basis: No completed use-case documentation was found in the repository. These test cases are inferred from the current implemented app pages and components.

Test date: September 10, 2026

## Test Case Table

| Test Case ID | Inferred Use Case | Scenario | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Status | Execution Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-001 | View tour packages | Customer views available tours from the home page. | App is running. User is on the home page. | 1. Open the home page. 2. Scroll to the Products section. 3. Check if Tour A, Tour B, and Tour C are displayed. | None | Home page displays hero carousel and three tour product cards with image, title, description, and price. | AI browser test confirmed home page loads and displays Tour A, Tour B, and Tour C. | Pass | AI | Covers basic product browsing. |
| TC-002 | Sign in before booking | Customer clicks a tour while logged out and is prompted to sign in. | App is running. User is logged out or Dev Status shows LOGGED OUT. | 1. Open the home page. 2. Click any tour package. | Tour A, B, or C | Authentication modal appears with sign-in form fields for email and password. | AI browser test confirmed clicking Tour A while logged out opened the sign-in modal. | Pass | AI | Authentication is currently simulated in the UI. |
| TC-003 | Create account before booking | Customer switches to sign-up mode and creates an account before booking. | Authentication modal is open. | 1. Click the sign-up option in the auth modal. 2. Enter full name. 3. Enter email. 4. Enter password. 5. Submit the form. | Name: Juan Dela Cruz; Email: juan@example.com; Password: password123 | Modal closes, success toast appears, and selected tour booking modal opens. | AI browser test confirmed sign-up accepted data and opened the booking modal. | Pass | AI | No real backend validation confirmed. |
| TC-004 | Book selected tour | Customer completes booking details for a selected tour. | User is signed in through the modal or Dev Status is LOGGED IN. A tour booking modal is open. | 1. Enter guest name. 2. Enter number of guests. 3. Select tour date. 4. Enter contact number. 5. Select optional add-ons if needed. 6. Click Confirm & Pay. | Guest: Juan Dela Cruz; Pax: 2; Date: 2026-09-15; Contact: +639000000000 | App shows processing toast and redirects to `/checkout`. | AI browser test confirmed booking form submitted and redirected to `/checkout`. | Pass | AI | Button text in the app is `Confirm & Pay`. |
| TC-005 | Calculate booking total | Customer changes pax and add-ons before booking. | Tour booking modal is open. | 1. Set pax to 2. 2. Enable ETDF add-on. 3. Enable Big Lagoon add-on. 4. Check displayed total. | Tour A price: PHP 1,350; ETDF: PHP 400; Lagoon: PHP 200; Pax: 2 | Total should be `(1350 + 400 + 200) * 2 = PHP 3,900`. | AI browser test confirmed the displayed total updated to PHP 3,900. | Pass | AI | Use the actual displayed selected tour price if testing Tour B or C. |
| TC-006 | Checkout payment | Customer submits payment details. | User is on `/checkout`. | 1. Select payment method. 2. Enter cardholder name. 3. Enter card number. 4. Enter expiry date. 5. Enter CVC. 6. Click Pay. | Cardholder: Juan Dela Cruz; Card: 4242 4242 4242 4242; Expiry: 12/30; CVC: 123 | Button changes to processing state, success toast appears, and app redirects to `/dashboard`. | AI browser test confirmed payment form submitted, showed processing state, and redirected to `/dashboard`. | Pass | AI | Payment is simulated, not integrated with a real payment gateway. |
| TC-007 | View confirmed booking | Customer views booking and invoice after payment. | Payment flow completed or user opens `/dashboard`. | 1. Open `/dashboard`. 2. Check booking status. 3. Expand invoice details if collapsed. | None | Dashboard displays confirmed and paid booking, booking reference, guest details, itinerary, and total paid. | AI browser test confirmed dashboard displayed confirmed paid booking and invoice/itinerary details. | Pass | AI | Current data appears hardcoded. |
| TC-008 | Download invoice PDF | Customer downloads invoice from dashboard. | User is on `/dashboard` and invoice section is visible. | 1. Click Download PDF. 2. Wait for generation to finish. 3. Check downloaded file. | None | PDF file named similar to `JazGot_Invoice_JZT-84729.pdf` is downloaded and success toast appears. | AI browser test clicked Download PDF, but no file downloaded. Console showed `PDF Generation Error: unsupported color function "lab"` from `html2canvas`. | Fail | AI / Manual Review | This is an app issue in PDF generation; manual review can confirm after the bug is fixed. |
| TC-009 | View admin dashboard | Admin views sales workspace overview. | App is running. User opens admin route. | 1. Navigate to `/admin`. 2. Check dashboard cards. 3. Check recent quotations table. | None | Admin page displays quotation count, invoice count, client count, and recent quotation rows. | TBD | Not Run | AI | No access control was observed. |
| TC-010 | Navigate admin modules | Admin opens admin module pages. | User is on `/admin`. | 1. Open `/admin/quotation`. 2. Open `/admin/clients`. 3. Open `/admin/products`. 4. Open `/admin/invoices`. | None | Each admin page loads without blank screen or runtime error. | TBD | Not Run | AI | Confirms first-iteration route availability. |
| TC-011 | Contact page loads | Customer opens contact page. | App is running. | 1. Navigate to `/contact`. 2. Check contact form/page content. | None | Contact page loads and shows contact-related form or details. | TBD | Not Run | AI | Useful smoke test for public navigation. |
| TC-012 | Sign-in page loads | Customer opens dedicated sign-in page. | App is running. | 1. Navigate to `/signin`. 2. Check form fields. | None | Sign-in page loads and displays sign-in form without runtime error. | TBD | Not Run | AI | Separate from modal auth flow. |

## Execution Split

| Group | Test Cases | Why |
| --- | --- | --- |
| AI can test | TC-001, TC-002, TC-003, TC-004, TC-005, TC-006, TC-007, TC-009, TC-010, TC-011, TC-012 | These can be checked through build checks, route smoke tests, and browser automation because the app behavior is local and deterministic. |
| Manual or mixed | TC-008 | AI can trigger PDF generation, but a person should confirm the downloaded invoice file opens correctly and has acceptable visual layout. |
| Manual only | None for first iteration | No real payment gateway, email/SMS delivery, external account verification, or production deployment flow is configured in this repo. |

## AI Execution Results

| Check | Related Test Cases | Result | Evidence |
| --- | --- | --- | --- |
| TypeScript type check | General quality gate | Pass | `npm run typecheck` completed successfully. |
| Production build | General quality gate, TC-001, TC-007, TC-009, TC-010, TC-011, TC-012 | Pass | `npm run build` completed successfully and generated static pages for `/`, `/about`, `/contact`, `/signin`, `/checkout`, `/dashboard`, `/admin`, `/admin/quotation`, `/admin/clients`, `/admin/products`, and `/admin/invoices`. |
| Route smoke test | TC-001, TC-007, TC-009, TC-010, TC-011, TC-012 | Pass | Built app returned HTTP 200 for all main public and admin routes. |
| ESLint | General quality gate | Fail | `npm run lint` found existing issues in `app/admin/quotation/page.tsx` and `components/products-section.tsx`. |

## Still Needs Interactive Testing

| Test Cases | Who Can Do It | Reason |
| --- | --- | --- |
| TC-002, TC-003, TC-004, TC-005, TC-006 | AI can do it with browser automation, or a human can do it manually | These require clicking, typing into forms, checking modal behavior, checking calculated totals, and confirming redirect behavior. |
| TC-008 | Human final check recommended | AI can trigger the download, but a person should open the PDF and confirm the invoice content/layout is acceptable. |

## First Iteration Use Cases Covered

| Use Case ID | Use Case Name | Related Test Cases |
| --- | --- | --- |
| UC-001 | Browse and book a tour package | TC-001, TC-002, TC-003, TC-004, TC-005 |
| UC-002 | Pay for booking and view invoice | TC-006, TC-007, TC-008 |
| UC-003 | Manage admin workspace | TC-009, TC-010 |

## Test Status Legend

| Status | Meaning |
| --- | --- |
| Not Run | Test case is ready but has not been executed. |
| Pass | Actual result matched expected result. |
| Fail | Actual result did not match expected result. |
| Blocked | Test could not be completed because of missing setup, unavailable page, or runtime error. |
