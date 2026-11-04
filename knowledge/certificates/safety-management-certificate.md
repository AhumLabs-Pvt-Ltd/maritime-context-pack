---
id: safety-management-certificate
title: Safety Management Certificate
short_name: SMC
convention: SOLAS Chapter IX and the International Safety Management (ISM) Code
issued_by: Flag state administration, or a recognized organization acting for it
max_validity_years: 5
source_links:
  - https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx
  - https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx
verified_by: ""
last_checked: 2026-11-04
---

# Safety Management Certificate

> Summary in our own words. Not legal advice. Always check the flag state's own rules.

## What it is

Confirms that the safety management system (SMS) on board a ship has been audited and
works as the ISM Code requires. It is the ship-level partner of the company's Document of
Compliance (DOC). A ship needs both: a valid DOC for the company that manages it, and a
valid SMC for the ship itself.

## Issuing authority

The flag state administration, or a recognized organization it has authorised. The
certificate is issued after a successful audit on board.

## Convention

SOLAS Chapter IX makes the ISM Code mandatory for passenger ships, and for cargo ships and
mobile offshore drilling units of 500 gross tonnage and above.

## Validity

Up to 5 years, provided the intermediate verification is completed. An interim SMC
(usually valid for up to 6 months, extendable once in limited cases) can be issued to a
new ship or a ship newly taken over by a company.

The SMC is only valid while the company's DOC is valid for that ship type. If the DOC is
withdrawn, the SMCs that depend on it are too.

## Survey windows

- **Initial audit** before the full-term certificate is issued.
- **Intermediate verification** between the second and third anniversary dates. Only one
  intermediate is required in each 5-year cycle unless the flag asks for more.
- **Renewal audit** before expiry. If completed within 3 months before expiry, the new
  certificate runs 5 years from the old expiry date.

## Common problems

- Company name or address on the SMC does not match the DOC.
- Intermediate verification overdue.
- Port state control finds a serious ISM failure, which can lead to detention and an
  additional audit.
- Non-conformities from the last audit not closed by the agreed date.
- Management company changes and the ship sails on the previous company's SMC.

## Data fields

| Field                    | Type    | Notes                                   |
| ------------------------ | ------- | --------------------------------------- |
| certificate_number       | string  |                                         |
| imo_number               | string  |                                         |
| company_name             | string  | Must match the DOC                      |
| company_imo_number       | string  | IMO company and registered owner number |
| doc_certificate_number   | string  | The DOC this SMC relies on              |
| issued_by                | string  |                                         |
| issued_on                | date    |                                         |
| expires_on               | date    |                                         |
| interim                  | boolean |                                         |
| intermediate_verified_on | date    |                                         |

## Source

- [IMO: ISM Code](https://www.imo.org/en/OurWork/HumanElement/Pages/ISMCode.aspx)
- [IMO: SOLAS](<https://www.imo.org/en/About/Conventions/Pages/International-Convention-for-the-Safety-of-Life-at-Sea-(SOLAS),-1974.aspx>)

## Verification

`verified_by` is empty until a qualified reviewer checks this card against the sources and
signs it off in a pull request.
