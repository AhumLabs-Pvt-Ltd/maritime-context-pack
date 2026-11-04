---
id: iopp-certificate
title: International Oil Pollution Prevention Certificate
short_name: IOPP
convention: MARPOL Annex I
issued_by: Flag state administration, or a recognized organization acting for it
max_validity_years: 5
source_links:
  - https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Prevention-of-Pollution-from-Ships-(MARPOL).aspx
  - https://www.imo.org/en/OurWork/Environment/Pages/OilPollution-Default.aspx
verified_by: ""
last_checked: 2026-11-04
---

# International Oil Pollution Prevention Certificate

> Summary in our own words. Not legal advice. Always check the flag state's own rules.

## What it is

Confirms that a ship's structure, equipment and arrangements for preventing oil pollution
meet MARPOL Annex I. Examples: the oily water separator, the 15 ppm bilge alarm, sludge
tanks, and for tankers the cargo-area arrangements. A Supplement lists the equipment in
detail: Form A for ships other than oil tankers, Form B for oil tankers.

## Issuing authority

The flag state administration, or a recognized organization it has authorised.

## Convention

MARPOL Annex I (prevention of pollution by oil). Required for oil tankers of 150 gross
tonnage and above and other ships of 400 gross tonnage and above on international voyages.

## Validity

Up to 5 years, as long as annual and intermediate surveys are completed and endorsed.

## Survey windows

- **Initial survey** before first issue.
- **Annual survey** within 3 months before or after each anniversary date.
- **Intermediate survey** within 3 months before or after the second or third anniversary
  date. It takes the place of one annual survey.
- **Renewal survey** before expiry.

## Common problems

- Oily water separator or 15 ppm alarm not working, or crew unable to operate it.
- Oil Record Book entries missing, inconsistent with tank soundings, or not signed.
- Supplement (Form A or B) not updated after equipment changes.
- Annual or intermediate survey not endorsed within the window.
- Signs of bypass piping around the separator. This is treated very seriously.

## Data fields

| Field                  | Type   | Notes                                |
| ---------------------- | ------ | ------------------------------------ |
| certificate_number     | string |                                      |
| imo_number             | string |                                      |
| issued_by              | string |                                      |
| issued_on              | date   |                                      |
| expires_on             | date   |                                      |
| anniversary_date       | string | MM-DD                                |
| last_annual_survey_on  | date   |                                      |
| intermediate_survey_on | date   |                                      |
| supplement_form        | string | `A` (non-tanker) or `B` (oil tanker) |

## Source

- [IMO: MARPOL](<https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Prevention-of-Pollution-from-Ships-(MARPOL).aspx>)
- [IMO: oil pollution prevention](https://www.imo.org/en/OurWork/Environment/Pages/OilPollution-Default.aspx)

## Verification

`verified_by` is empty until a qualified reviewer checks this card against the sources and
signs it off in a pull request.
