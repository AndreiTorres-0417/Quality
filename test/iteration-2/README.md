# Iteration 2 recorded QA run

The evidence in this directory supports the [QA report](../../outputs/iteration-2/iteration-2-qa-report.md). `evidence/results.json` contains the completed results; `admin-smoke.json` records the follow-up check of all five admin routes. The report explains the original source commit, environment and upstream comparison.

## Scripts and reruns

These scripts preserve the procedure used for the recorded run. They are diagnostic scripts, not a general regression suite or a CI pass/fail gate. Their process exit code does not represent whether all test cases passed.

With dependencies installed, Microsoft Edge available, and the production app already running at `http://localhost:3000`, the browser procedure can be repeated from the repository root:

```powershell
node test/iteration-2/run-qa.mjs
```

`QA_URL` can override the main script's base URL. `complete-admin-smoke.mjs` is the historical follow-up script and uses localhost port 3000.

Rerunning overwrites evidence files. Preserve the recorded evidence first and review the scripts against the application revision being tested. The clean-install case (TC-018) is a recorded manual outcome embedded in the main script; it must be independently re-executed and updated for a new run. PDF readability/content inspection still needs a separate check if download begins working. The follow-up admin script also includes historical result wording that must be reviewed before reuse.

See the report for the failed clean Windows install and the workaround used to continue testing. Test credentials and payment details are synthetic; payment and authentication were simulated.
