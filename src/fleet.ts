import { readFileSync } from "node:fs";

export interface Certificate {
  certificate_id: string;
  vessel_imo: string;
  type: string;
  certificate_number: string;
  issued_by: string;
  issued_on: string;
  expires_on: string | null;
  last_annual_survey_on?: string;
  interim?: boolean;
  synthetic: boolean;
}

export interface Vessel {
  imo: string;
  name: string;
  flag: string;
  vessel_type: string;
  gross_tonnage: number;
  year_built: number;
  owner: string;
  manager: string;
  class_society: string;
  synthetic: boolean;
  certificates: Certificate[];
}

export interface Fleet {
  synthetic: true;
  generated_as_of: string;
  vessels: Vessel[];
}

export type Status = "valid" | "expiring" | "expired" | "no_expiry";

export const DEFAULT_FLEET_PATH = new URL("../data/synthetic-fleet/fleet.json", import.meta.url);

export function loadFleet(path: string | URL = DEFAULT_FLEET_PATH): Fleet {
  return JSON.parse(readFileSync(path, "utf8")) as Fleet;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Whole days from asOf to date (negative if date is in the past). Dates are YYYY-MM-DD. */
export function daysBetween(asOf: string, date: string): number {
  return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${asOf}T00:00:00Z`)) / DAY_MS);
}

export function certificateStatus(cert: Certificate, asOf: string, withinDays: number): Status {
  if (cert.expires_on === null) return "no_expiry";
  const days = daysBetween(asOf, cert.expires_on);
  if (days < 0) return "expired";
  if (days <= withinDays) return "expiring";
  return "valid";
}

export interface FleetQuery {
  withinDays: number;
  asOf?: string;
  includeExpired?: boolean;
}

export interface FleetQueryRow {
  imo: string;
  vessel_name: string;
  certificate_type: string;
  certificate_number: string;
  expires_on: string;
  days_left: number;
  status: "expiring" | "expired";
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Certificates expiring within N days of asOf (and optionally those already expired), soonest first. */
export function queryFleet(fleet: Fleet, query: FleetQuery): FleetQueryRow[] {
  const asOf = query.asOf ?? todayUtc();
  const rows: FleetQueryRow[] = [];
  for (const vessel of fleet.vessels) {
    for (const cert of vessel.certificates) {
      const status = certificateStatus(cert, asOf, query.withinDays);
      if (status === "expiring" || (status === "expired" && query.includeExpired)) {
        rows.push({
          imo: vessel.imo,
          vessel_name: vessel.name,
          certificate_type: cert.type,
          certificate_number: cert.certificate_number,
          expires_on: cert.expires_on as string,
          days_left: daysBetween(asOf, cert.expires_on as string),
          status,
        });
      }
    }
  }
  return rows.sort((a, b) => a.days_left - b.days_left || a.imo.localeCompare(b.imo));
}
