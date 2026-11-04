---
id: international-load-line-certificate
title: International Load Line Certificate
short_name: ILLC
convention: International Convention on Load Lines, 1966, as modified by the 1988 Protocol
issued_by: Flag state administration, or a recognized organization acting for it
max_validity_years: 5
source_links:
  - https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Load-Lines.aspx
  - https://www.imo.org/en/OurWork/Safety/Pages/LoadLines.aspx
verified_by: ""
last_checked: 2026-11-04
---

# International Load Line Certificate

> Summary in our own words. Not legal advice. Always check the flag state's own rules.

## What it is

Confirms that a ship has been surveyed and marked with load lines that show how deep it
may safely be loaded in different seasons and sea areas, and that its hull openings
(hatches, doors, vents, air pipes) can be closed weathertight. It records the assigned
freeboards.

## Issuing authority

The flag state administration. In practice it is often issued by a recognized
organization (usually the ship's class society) that the flag has authorised to survey and
certify on its behalf.

## Convention

International Convention on Load Lines, 1966 (LL 66), and its 1988 Protocol, which brought
the survey and certification cycle into line with the Harmonized System of Survey and
Certification (HSSC). Applies to ships on international voyages above the size limits in
the convention (generally 24 metres in length and over).

## Validity

Up to 5 years. The certificate stays valid only if each annual survey is completed and
endorsed on it. The convention allows short extensions in limited cases, for example when
the ship is not in a port where it can be surveyed when the certificate expires.

## Survey windows

- **Initial survey** before the certificate is first issued.
- **Annual survey** within 3 months before or after each anniversary date.
- **Renewal survey** before the certificate expires. If completed within 3 months before
  expiry, the new certificate runs 5 years from the old expiry date.

## Common problems

- Annual survey not done or not endorsed within the window, making the certificate invalid.
- Load line marks or deck line worn, painted over, or in the wrong place.
- Closing appliances in poor condition: hatch cover seals, cleats, weathertight doors, vent
  and air pipe closures. These are frequent port state control findings.
- Ship loaded beyond the marks for the season or zone.
- Conditions of assignment changed (for example structural modifications) without the
  certificate being re-issued.

## Data fields

| Field                 | Type   | Notes                                          |
| --------------------- | ------ | ---------------------------------------------- |
| certificate_number    | string |                                                |
| imo_number            | string |                                                |
| issued_by             | string | Administration or recognized organization      |
| issued_on             | date   |                                                |
| expires_on            | date   |                                                |
| anniversary_date      | string | Day and month, MM-DD                           |
| last_annual_survey_on | date   |                                                |
| ship_type             | string | Type A or type B under the convention          |
| summer_freeboard_mm   | number | Other seasonal freeboards follow the same form |
| deck_line_position    | string |                                                |

## Source

- [IMO: International Convention on Load Lines](https://www.imo.org/en/About/Conventions/Pages/International-Convention-on-Load-Lines.aspx)
- [IMO: load lines overview](https://www.imo.org/en/OurWork/Safety/Pages/LoadLines.aspx)

## Verification

`verified_by` is empty until a qualified reviewer checks this card against the sources and
signs it off in a pull request.
