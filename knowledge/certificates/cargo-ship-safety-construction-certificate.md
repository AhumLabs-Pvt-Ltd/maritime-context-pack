---
id: cargo-ship-safety-construction-certificate
title: Cargo Ship Safety Construction Certificate
short_name: SC
convention: SOLAS Chapter I (survey and certification) with the construction rules in Chapter II-1 and II-2
issued_by: Flag state administration, or a recognized organization acting for it
max_validity_years: 5
source_links:
  - https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx
  - https://www.imo.org/en/OurWork/Safety/Pages/Default.aspx
verified_by: ""
last_checked: 2026-11-04
---

# Cargo Ship Safety Construction Certificate

> Summary in our own words. Not legal advice. Always check the flag state's own rules.

## What it is

Confirms that a cargo ship's hull, machinery and related structure meet the SOLAS
construction requirements, including structural fire protection. It covers the ship as
built and maintained, not its equipment (that is the Safety Equipment Certificate) or its
radio (the Safety Radio Certificate).

## Issuing authority

The flag state administration, or a recognized organization it has authorised. For most
ships this is the class society, and the statutory surveys are often done at the same time
as class surveys.

## Convention

SOLAS Chapter I sets the surveys and certificate. Applies to cargo ships of 500 gross
tonnage and above on international voyages.

## Validity

Up to 5 years, as long as the annual and intermediate surveys are completed and endorsed.

## Survey windows

- **Initial survey** before first issue.
- **Annual survey** within 3 months before or after each anniversary date.
- **Intermediate survey** within 3 months before or after the second or third anniversary
  date, in place of one annual survey.
- **Inspection of the outside of the bottom**: at least two in each 5-year period, one of
  them at the renewal survey. The gap between two inspections must not exceed 36 months.
- **Renewal survey** before expiry.

## Common problems

- Bottom inspection overdue, often because a dry-docking slipped.
- Corrosion, wastage or damage to hull structure found at survey or by port state control.
- Fire doors, dampers or insulation that no longer meet structural fire protection rules.
- Annual or intermediate survey not endorsed within the window.
- Modifications carried out without approval and survey.

## Data fields

| Field                     | Type   | Notes                       |
| ------------------------- | ------ | --------------------------- |
| certificate_number        | string |                             |
| imo_number                | string |                             |
| issued_by                 | string |                             |
| issued_on                 | date   |                             |
| expires_on                | date   |                             |
| anniversary_date          | string | MM-DD                       |
| last_annual_survey_on     | date   |                             |
| intermediate_survey_on    | date   |                             |
| last_bottom_inspection_on | date   | Dry-dock or in-water survey |

## Source

- [IMO: SOLAS](<https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx>)
- [IMO: maritime safety](https://www.imo.org/en/OurWork/Safety/Pages/Default.aspx)

## Verification

`verified_by` is empty until a qualified reviewer checks this card against the sources and
signs it off in a pull request.
