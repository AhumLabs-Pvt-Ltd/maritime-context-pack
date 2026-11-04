# AGENTS.md

Instructions for AI coding agents working in this repository.

## Install

```sh
corepack enable
pnpm install
pnpm run init     # creates .env from .env.example, installs hooks, runs doctor
```

Use `pnpm run init` and `pnpm run doctor`, not `pnpm init` / `pnpm doctor` (built-in pnpm
commands). No API key is needed.

## Test

All must pass before you finish:

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm validate     # synthetic fleet against the schemas
pnpm audit
gitleaks git --redact .   # if installed
```

## Run

```sh
pnpm mcp                              # MCP server on stdio
pnpm generate:fleet [--as-of DATE]    # rewrite data/synthetic-fleet/fleet.json
```

## Rules

- **Synthetic data only.** Never add real ship names, real IMO numbers, real companies,
  crew or client data. Synthetic IMO numbers start with `IMO0` and fail the check digit;
  use `syntheticImo()` from `src/imo.ts`. Names start with `SYN`.
- `data/synthetic-fleet/fleet.json` is generated. Change `scripts/generate-fleet.ts`, then
  run `pnpm generate:fleet`. A test fails if the two differ.
- **Knowledge cards:** write in your own words and link official sources (IMO, flag state).
  Never paste convention text. Keep all section headings from `_TEMPLATE.md`. Never fill in
  `verified_by`: only a human reviewer does that. If you are unsure of a fact, say so in the
  card rather than guessing.
- A new certificate type needs a card and an entry in the `type` enum of
  `schema/certificate.schema.json`.
- `knowledge/` is CC BY 4.0; everything else is Apache-2.0.
- Never read, print or commit `.env`. stdout is reserved for MCP; log with `log()`.
- Plain, direct writing.
