# VitalPath future-interest intake: verified contract and release gates

Status: **DRAFT / NO-GO**. Review evidence recorded October 30, 2026. Do not enable bookings, deposits, clinical intake, or production CRM writes based on this document.

## Existing sources verified

- Website PR #13 renders `request-services.html` as **Future Service Interest** with Netlify form name `vitalpath-future-service-interest`, honeypot `bot-field`, and required `consent`.
- Netlify site registry includes `vitalpath-future-service-interest`, `vitalpath-worker-interest-form`, and legacy `vitalpath-request-services`. Inspected forms have zero recorded submissions. The legacy form remains registered and lacks a honeypot.
- Supabase project `gluvpnusvgfkfcwutdbk`, table `public.vp_inquiries`, has RLS enabled, zero rows, and **no policies**. This is a deliberate fail-closed state, not evidence that browser submissions can write to it.
- PR #13 deploy-preview status succeeded at head `751942e8236ee20251c3cf2e670da0ba5f40422f`. No GitHub Actions PR workflow run was returned. Source assertions were checked independently, but no hosted form POST was performed.

## Existing `vp_inquiries` database columns

| Column | Type | Null? | Intended draft mapping |
| --- | --- | --- | --- |
| `id` | uuid | no | database generated |
| `category` | text | no | server-assigned `future_service_interest` |
| `status` | text | no | database default `new` |
| `full_name` | text | no | validated `full_name` |
| `email` | text | yes | validated `email` |
| `phone` | text | yes | NULL (not collected on draft form) |
| `area` | text | yes | validated `city_area` |
| `notes` | text | yes | validated `message`, nonclinical only |
| `assigned_to` | uuid | yes | NULL until authorized assignment |
| `created_at` | timestamptz | no | database generated |

**Consent gap:** the existing table has no explicit consent-evidence column. Do not imply that the `consent` checkbox is retained in CRM or use `notes` as a substitute for a proper audit record. Define a controlled consent/audit design and retention policy before ingestion.

## Required secure pipeline (not yet implemented or verified)

1. Browser submits only the nonclinical Netlify future-interest form; do not send service-role keys to the browser.
2. A trusted backend retrieves verified Netlify submissions or receives authenticated notifications; validate origin/authentication, honeypot, field lengths, required consent, and exact form name. Never trust client-supplied `category`, `status`, `assigned_to`, or company identity.
3. Use server-side least-privilege credentials and an idempotency key derived from the verified provider submission ID; log failures without leaking personal data. Decide whether Netlify is the system of record or only a transit store.
4. Store consent evidence and enforce data minimization, retention, restricted access, and appropriate notices. Do not collect clinical information in this pipeline.
5. Only authorized VitalPath staff may read the relevant inquiry through the existing authenticated dashboard backend; reject cross-company access and stale sessions. Keep RLS fail-closed unless a reviewed access model is implemented.
6. Test synthetic successful submission, duplicates, malformed/spam input, missing consent, provider replay, backend outage, staff revocation, and unauthorized access. Verify the actual row and employee dashboard visibility; delete synthetic records per retention procedure.

## CI / deployment gates

- Determine why `.github/workflows/future-interest-safety.yml` on the draft PR branch has no reported run. Verify GitHub Actions repo settings and workflow registration; do not claim the checks passed in CI.
- A Netlify deploy-preview **success** indicates a built preview, not a verified form submission.
- Resolve the legacy price/package form and links on the published website, and confirm approved launch language on every active entry point.
- Keep PR #13 draft and unmerged until tests, privacy/compliance review, owner approval, and controlled rollout are complete.
