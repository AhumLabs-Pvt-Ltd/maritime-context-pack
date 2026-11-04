import { readFileSync } from "node:fs";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";
import { isSyntheticImo } from "./imo.js";

// ajv-formats ships CommonJS; under NodeNext the callable is on .default.
const addFormats = addFormatsModule as unknown as typeof addFormatsModule.default;

const schemaUrl = (name: string) => new URL(`../schema/${name}`, import.meta.url);
const certificateSchema = JSON.parse(readFileSync(schemaUrl("certificate.schema.json"), "utf8"));
const vesselSchema = JSON.parse(readFileSync(schemaUrl("vessel.schema.json"), "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
ajv.addSchema(certificateSchema);
const checkCertificate = ajv.compile(certificateSchema);
const checkVessel = ajv.compile(vesselSchema);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function describe(errors: ErrorObject[] | null | undefined): string[] {
  return (errors ?? []).map((e) => `${e.instancePath || "(record)"} ${e.message ?? "is invalid"}`);
}

/** Rules JSON Schema cannot express. Applied only after the schema passes. */
function certificateRules(record: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const issued = record.issued_on as string;
  const expires = record.expires_on as string | null;
  if (expires !== null && expires < issued) {
    errors.push("/expires_on must not be before issued_on");
  }
  const survey = record.last_annual_survey_on as string | undefined;
  if (survey !== undefined && survey < issued) {
    errors.push("/last_annual_survey_on must not be before issued_on");
  }
  if (record.synthetic !== true) {
    errors.push("/synthetic must be true: only synthetic data is allowed in this repository");
  }
  if (!isSyntheticImo(record.vessel_imo as string)) {
    errors.push("/vessel_imo must be a synthetic IMO number (IMO0..., failing the check digit)");
  }
  return errors;
}

/** Validates one certificate record against schema/certificate.schema.json plus date rules. */
export function validateCertificate(record: unknown): ValidationResult {
  if (!checkCertificate(record)) return { valid: false, errors: describe(checkCertificate.errors) };
  const errors = certificateRules(record as Record<string, unknown>);
  return { valid: errors.length === 0, errors };
}

/** Validates a vessel and each of its certificates. */
export function validateVessel(record: unknown): ValidationResult {
  if (!checkVessel(record)) return { valid: false, errors: describe(checkVessel.errors) };
  const vessel = record as { imo: string; synthetic: boolean; certificates: unknown[] };
  const errors: string[] = [];
  if (vessel.synthetic !== true) errors.push("/synthetic must be true");
  if (!isSyntheticImo(vessel.imo)) errors.push("/imo must be a synthetic IMO number");
  vessel.certificates.forEach((cert, i) => {
    const c = cert as { vessel_imo: string };
    if (c.vessel_imo !== vessel.imo)
      errors.push(`/certificates/${i}/vessel_imo does not match /imo`);
    for (const e of certificateRules(cert as Record<string, unknown>)) {
      errors.push(`/certificates/${i}${e}`);
    }
  });
  return { valid: errors.length === 0, errors };
}
