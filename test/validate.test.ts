import { describe, expect, it } from "vitest";
import { loadFleet } from "../src/fleet.js";
import { validateCertificate, validateVessel } from "../src/validate.js";

const fleet = loadFleet();
const sample = () => structuredClone(fleet.vessels[0]!.certificates[1]!);

describe("validateCertificate", () => {
  it("accepts a synthetic record", () => {
    expect(validateCertificate(sample())).toEqual({ valid: true, errors: [] });
  });

  it("reports missing required fields", () => {
    const record: Record<string, unknown> = { ...sample() };
    delete record.certificate_number;
    const result = validateCertificate(record);
    expect(result.valid).toBe(false);
    expect(result.errors.join()).toContain("certificate_number");
  });

  it("rejects unknown certificate types and bad dates", () => {
    expect(validateCertificate({ ...sample(), type: "made-up" }).valid).toBe(false);
    expect(validateCertificate({ ...sample(), issued_on: "2026-13-01" }).valid).toBe(false);
  });

  it("rejects expiry before issue", () => {
    const result = validateCertificate({ ...sample(), issued_on: "2030-01-01" });
    expect(result.errors.join()).toMatch(/expires_on must not be before issued_on/);
  });

  it("rejects non-synthetic data", () => {
    expect(validateCertificate({ ...sample(), synthetic: false }).valid).toBe(false);
    expect(validateCertificate({ ...sample(), vessel_imo: "IMO1234567" }).valid).toBe(false);
  });

  it("rejects extra fields", () => {
    expect(validateCertificate({ ...sample(), crew_name: "x" }).valid).toBe(false);
  });
});

describe("synthetic fleet", () => {
  it("has 20 vessels that all validate", () => {
    expect(fleet.vessels).toHaveLength(20);
    for (const vessel of fleet.vessels) {
      expect(validateVessel(vessel)).toEqual({ valid: true, errors: [] });
    }
  });

  it("catches a certificate attached to the wrong vessel", () => {
    const vessel = structuredClone(fleet.vessels[0]!);
    vessel.certificates[0]!.vessel_imo = fleet.vessels[1]!.imo;
    expect(validateVessel(vessel).errors.join()).toContain("does not match");
  });
});
