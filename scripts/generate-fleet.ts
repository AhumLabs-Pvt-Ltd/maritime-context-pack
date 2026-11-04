// Generates data/synthetic-fleet/fleet.json: 20 made-up vessels, 5 certificates each.
// Deterministic: the same seed and --as-of date always produce the same file.
//
//   pnpm generate:fleet                    # as of the default date
//   pnpm generate:fleet --as-of 2027-01-15 # shift expiry dates around a new date
//
// Every vessel, company and number is invented. IMO numbers start with IMO0 and fail the
// check digit, so they cannot match a real ship.
import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import type { Certificate, Fleet, Vessel } from "../src/fleet.js";
import { syntheticImo } from "../src/imo.js";

export const DEFAULT_AS_OF = "2026-11-01";
const SEED = 20261101;
const VESSEL_COUNT = 20;

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NAMES = [
  "Albatross",
  "Bluefin",
  "Cormorant",
  "Driftwood",
  "Egret",
  "Fjord",
  "Gannet",
  "Harbour",
  "Ibis",
  "Jetty",
  "Kestrel",
  "Lagoon",
  "Marlin",
  "Nautilus",
  "Osprey",
  "Petrel",
  "Quay",
  "Reef",
  "Shearwater",
  "Tern",
];
const FLAGS = ["PA", "LR", "MH", "SG", "MT", "BS", "HK", "GR", "CY", "NO"];
const TYPES = ["bulk_carrier", "oil_tanker", "chemical_tanker", "container_ship", "general_cargo"];
const CLASS = [
  "Synthetic Class Society A",
  "Synthetic Class Society B",
  "Synthetic Class Society C",
];
const CERT_TYPES = [
  "certificate-of-registry",
  "international-load-line-certificate",
  "safety-management-certificate",
  "iopp-certificate",
  "cargo-ship-safety-construction-certificate",
] as const;
const PREFIX: Record<(typeof CERT_TYPES)[number], string> = {
  "certificate-of-registry": "COR",
  "international-load-line-certificate": "LL",
  "safety-management-certificate": "SMC",
  "iopp-certificate": "IOPP",
  "cargo-ship-safety-construction-certificate": "SC",
};

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function addYears(date: string, years: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

/**
 * Picks days until expiry so the fleet has a fixed mix: about 70% valid (more than 90
 * days left), 18% expiring within 90 days, and 12% already expired.
 */
function daysToExpiry(rand: () => number): number {
  const r = rand();
  if (r < 0.12) return -1 - Math.floor(rand() * 180);
  if (r < 0.3) return Math.floor(rand() * 91);
  return 91 + Math.floor(rand() * 1500);
}

export function generateFleet(asOf: string = DEFAULT_AS_OF, seed: number = SEED): Fleet {
  const rand = mulberry32(seed);
  const pick = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)] as T;
  const vessels: Vessel[] = [];

  for (let i = 0; i < VESSEL_COUNT; i++) {
    const n = String(i + 1).padStart(2, "0");
    const imo = syntheticImo(String(10000 + Math.floor(rand() * 89999)), i);
    const vesselType = pick(TYPES);
    const certificates: Certificate[] = CERT_TYPES.map((type, j) => {
      const cert: Certificate = {
        certificate_id: `syn-${n}-${PREFIX[type].toLowerCase()}`,
        vessel_imo: imo,
        type,
        certificate_number: `SYN-${PREFIX[type]}-${n}${j}${Math.floor(rand() * 9000 + 1000)}`,
        issued_by: type === "certificate-of-registry" ? "Synthetic Flag Registry" : pick(CLASS),
        issued_on: "",
        expires_on: null,
        synthetic: true,
      };
      // Registry: half permanent (no expiry), half provisional (about 6 months).
      if (type === "certificate-of-registry" && rand() < 0.5) {
        cert.issued_on = addDays(asOf, -Math.floor(rand() * 3000) - 30);
        return cert;
      }
      const expires = addDays(asOf, daysToExpiry(rand));
      const provisional = type === "certificate-of-registry";
      cert.expires_on = expires;
      cert.issued_on = provisional ? addDays(expires, -180) : addYears(expires, -5);
      if (provisional) cert.interim = true;
      if (!provisional && type !== "safety-management-certificate") {
        // Most recent annual survey: some time in the year before asOf, never before issue.
        const survey = addDays(asOf, -Math.floor(rand() * 330) - 1);
        cert.last_annual_survey_on = survey > cert.issued_on ? survey : cert.issued_on;
      }
      return cert;
    });

    vessels.push({
      imo,
      name: `SYN ${NAMES[i]}`,
      flag: pick(FLAGS),
      vessel_type: vesselType,
      gross_tonnage: 3000 + Math.floor(rand() * 90000),
      year_built: 1998 + Math.floor(rand() * 27),
      owner: `Synthetic Owner ${n} Ltd`,
      manager: `Synthetic Ship Management ${String.fromCharCode(65 + (i % 4))}`,
      class_society: pick(CLASS),
      synthetic: true,
      certificates,
    });
  }

  return { synthetic: true, generated_as_of: asOf, vessels };
}

if (process.argv[1]?.endsWith("generate-fleet.ts")) {
  const { values } = parseArgs({ options: { "as-of": { type: "string" } } });
  const asOf = values["as-of"] ?? DEFAULT_AS_OF;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(asOf)) throw new Error("--as-of must be YYYY-MM-DD");
  const fleet = generateFleet(asOf);
  writeFileSync(
    new URL("../data/synthetic-fleet/fleet.json", import.meta.url),
    JSON.stringify(fleet, null, 2) + "\n",
  );
  console.log(`Wrote ${fleet.vessels.length} synthetic vessels as of ${asOf}.`);
}
