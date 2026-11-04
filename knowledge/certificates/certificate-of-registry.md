---
id: certificate-of-registry
title: Certificate of Registry
short_name: CoR
convention: National law of the flag state (nationality of ships under UNCLOS Articles 91 and 94)
issued_by: Flag state ship registry
max_validity_years: null
source_links:
  - https://www.un.org/depts/los/convention_agreements/texts/unclos/unclos_e.pdf
  - https://www.imo.org/en/OurWork/MSAS/Pages/default.aspx
verified_by: ""
last_checked: 2026-11-04
---

# Certificate of Registry

> Summary in our own words. Not legal advice. Always check the flag state's own rules.

## What it is

The document that proves a ship is registered with a flag state and so has that state's
nationality. It names the ship, its owner and its port of registry. Most other statutory
certificates assume the ship is validly registered, so a problem here affects everything
else.

## Issuing authority

The ship registry of the flag state, sometimes through a regional office, a consulate or
an appointed agent. It is not issued by class societies.

## Convention

There is no IMO convention that sets out a standard Certificate of Registry. The duty for
ships to carry the nationality of one state, and for that state to keep a register, comes
from the UN Convention on the Law of the Sea (UNCLOS). The form, content and rules for the
certificate are set by each flag state's national law.

## Validity

Set by the flag state, so it varies:

- Some registries issue a permanent certificate that stays valid until the ship changes
  owner, name or flag, or is deleted from the register.
- Others issue certificates for a fixed term and require renewal.
- Many issue a provisional certificate first (often valid for around six months) while the
  owner provides final documents, such as the deletion certificate from the previous flag.

Annual registry fees or tonnage taxes may also need to be paid to keep the registration in
good standing.

## Survey windows

No survey is tied to this certificate. Some flags require an inspection before or shortly
after registration. Renewal dates for fixed-term or provisional certificates should be
tracked like expiry dates.

## Common problems

- Provisional registration expires before the permanent certificate is issued.
- Previous flag's deletion certificate is missing, so permanent registration stalls.
- Ship name, owner or call sign on other certificates does not match the registry entry
  after a sale or rename.
- Annual fees unpaid, which some registries treat as grounds to suspend registration.

## Data fields

| Field              | Type    | Notes                                       |
| ------------------ | ------- | ------------------------------------------- |
| certificate_number | string  | Registry's own number                       |
| official_number    | string  | Flag state's number for the ship            |
| imo_number         | string  | 7 digits, with `IMO` prefix                 |
| ship_name          | string  |                                             |
| call_sign          | string  |                                             |
| flag_state         | string  | ISO 3166-1 alpha-2 code                     |
| port_of_registry   | string  |                                             |
| registered_owner   | string  |                                             |
| gross_tonnage      | number  |                                             |
| net_tonnage        | number  |                                             |
| provisional        | boolean | True for a provisional certificate          |
| issued_on          | date    |                                             |
| expires_on         | date    | Empty if the certificate has no expiry date |

## Source

- [UNCLOS, Articles 91 and 94](https://www.un.org/depts/los/convention_agreements/texts/unclos/unclos_e.pdf)
- [IMO: member state audit and implementation](https://www.imo.org/en/OurWork/MSAS/Pages/default.aspx)
- The flag state registry's own published requirements.

## Verification

`verified_by` is empty until a qualified reviewer checks this card against the sources and
signs it off in a pull request.
