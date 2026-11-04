# Contributing

The organization-wide guide applies here:
[AhumLabs-Pvt-Ltd/.github CONTRIBUTING.md](https://github.com/AhumLabs-Pvt-Ltd/.github/blob/main/CONTRIBUTING.md).
It covers the synthetic-data rule, secrets, the Code of Conduct and the CLA.

## Setup

```sh
corepack enable
pnpm install
pnpm run init
```

Before you open a pull request:

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm validate
```

## Knowledge contributions

- Write in your own words. Link the official source. Do not copy convention text.
- Keep the card structure from `knowledge/certificates/_TEMPLATE.md`.
- Leave `verified_by` empty. If you are a qualified reviewer (surveyor, auditor,
  superintendent, flag or class staff) and want to verify a card, say so in the pull
  request and a maintainer will add your name or handle after review.
- Content in `knowledge/` is contributed under CC BY 4.0 (see `LICENSE-CONTENT`). Code is
  contributed under Apache-2.0 (see `LICENSE`).

## Data contributions

Only synthetic data. Change `scripts/generate-fleet.ts` and run `pnpm generate:fleet`
rather than editing `fleet.json` by hand.
