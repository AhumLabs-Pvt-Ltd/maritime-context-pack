# Maritime context pack

Shared maritime knowledge for developers and AI agents, plus tooling to use it:

- **Knowledge cards** for ship certificates (`knowledge/certificates/`), a glossary and a
  guide to the roles involved (owner, manager, class society, flag state, PSC).
- **JSON Schemas** for vessels and certificates (`schema/`).
- **A synthetic fleet** of 20 made-up vessels with certificates in a mix of valid,
  expiring and expired (`data/synthetic-fleet/`).
- **A validator** that checks certificate records against the schema (`src/validate.ts`).
- **An MCP server** with three tools: `list_certificate_types`, `get_certificate_card`
  and `query_fleet`.

The cards are summaries in our own words with links to official sources. They are not
legal advice and do not replace the convention text or the flag state's instructions. A
card's `verified_by` field stays empty until a qualified reviewer has checked it.

Built from [AhumLabs-Pvt-Ltd/repo-template](https://github.com/AhumLabs-Pvt-Ltd/repo-template).

## 10-minute quickstart

You need Git and Node.js 22 or newer.

1. Clone and install (3 min):

   ```sh
   git clone https://github.com/AhumLabs-Pvt-Ltd/maritime-context-pack.git
   cd maritime-context-pack
   corepack enable
   pnpm install
   pnpm run init      # creates .env, installs the secret scan hook, runs the doctor
   ```

   No API key is needed for anything in this repository.

2. Test (1 min):

   ```sh
   pnpm lint
   pnpm test
   ```

3. Read a card (1 min): open
   [knowledge/certificates/international-load-line-certificate.md](knowledge/certificates/international-load-line-certificate.md).

4. Validate data (1 min):

   ```sh
   pnpm validate                      # the synthetic fleet
   pnpm validate path/to/record.json  # your own certificate or vessel JSON
   ```

5. Run the MCP server (4 min). Add it to Claude Code:

   ```sh
   claude mcp add maritime-context-pack -- pnpm --dir "$PWD" mcp
   ```

   Then ask, for example, "Which certificates in the synthetic fleet expire in the next 30
   days?" Any MCP client that can start a stdio server works the same way: the command is
   `pnpm --dir /path/to/maritime-context-pack mcp`.

## MCP tools

| Tool                     | Input                                       | Returns                                        |
| ------------------------ | ------------------------------------------- | ---------------------------------------------- |
| `list_certificate_types` | none                                        | id, title, convention and issuer for each card |
| `get_certificate_card`   | `id`                                        | the card's metadata and full text              |
| `query_fleet`            | `within_days`, `as_of?`, `include_expired?` | synthetic certificates expiring in the window  |

`as_of` defaults to today. The fleet's dates were generated around 2026-11-01. As time
passes, more certificates will show as expired. Regenerate around a new date with
`pnpm generate:fleet --as-of YYYY-MM-DD`.

## Synthetic data

Everything in `data/` is invented:

- Vessel names start with `SYN`. Owners, managers and class societies are named
  "Synthetic ...".
- IMO numbers start with `IMO0` and deliberately fail the IMO check digit. No real IMO
  number starts with 0, and every real one passes the check, so these can never match a
  real ship. The validator rejects records that break this rule.
- Every record has `"synthetic": true`.

Never add real ship, client or crew data, even to tests.

## Layout

| Path                        | What it is                                         |
| --------------------------- | -------------------------------------------------- |
| `knowledge/certificates/`   | One card per certificate. `_TEMPLATE.md` to start. |
| `knowledge/glossary.md`     | Terms                                              |
| `knowledge/roles.md`        | Owner, manager, class society, flag state, PSC     |
| `schema/`                   | `vessel.schema.json`, `certificate.schema.json`    |
| `data/synthetic-fleet/`     | `fleet.json` and how to regenerate it              |
| `scripts/generate-fleet.ts` | Deterministic fleet generator                      |
| `src/validate.ts`           | Schema and rule checks                             |
| `src/fleet.ts`              | Expiry logic used by `query_fleet`                 |
| `src/knowledge.ts`          | Reads cards                                        |
| `src/mcp/server.ts`         | MCP server                                         |

## Adding a certificate card

1. Copy `knowledge/certificates/_TEMPLATE.md` to `<id>.md`. Keep every section heading.
2. Write in your own words. Link the official source. Do not copy convention text.
3. Leave `verified_by` empty and set `last_checked` to today.
4. Add the id to the `type` enum in `schema/certificate.schema.json`.
5. Run `pnpm test`. The card tests check the structure.

## Licenses

This repository uses two licenses:

- **Code** (everything outside `knowledge/`, including `src/`, `scripts/`, `schema/`,
  `test/` and `data/`) is licensed under [Apache-2.0](LICENSE). You can use, change and
  redistribute it, including commercially, as long as you keep the license and notices.
- **Content in `knowledge/`** (the certificate cards, glossary and roles) is licensed under
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-CONTENT). You can
  share and adapt it for any purpose, including commercially, as long as you credit
  "Ahum community, maritime-context-pack" with a link to this repository and say if you
  changed it.

Contributions to each part are accepted under that part's license.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md). Found a factual
mistake in a card? Open a **Maritime knowledge correction** issue.
