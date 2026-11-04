import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_AS_OF, generateFleet } from "../scripts/generate-fleet.js";
import { certificateStatus, daysBetween, loadFleet, queryFleet } from "../src/fleet.js";

const fleet = loadFleet();

describe("generator", () => {
  it("matches the committed fleet.json (run pnpm generate:fleet after changing it)", () => {
    const committed = readFileSync("data/synthetic-fleet/fleet.json", "utf8");
    expect(JSON.stringify(generateFleet(DEFAULT_AS_OF), null, 2) + "\n").toBe(committed);
  });

  it("produces a mix of valid, expiring and expired certificates", () => {
    const counts = { valid: 0, expiring: 0, expired: 0, no_expiry: 0 };
    for (const v of fleet.vessels) {
      for (const c of v.certificates) counts[certificateStatus(c, fleet.generated_as_of, 90)]++;
    }
    expect(counts.valid).toBeGreaterThan(0);
    expect(counts.expiring).toBeGreaterThan(0);
    expect(counts.expired).toBeGreaterThan(0);
  });

  it("marks everything as synthetic", () => {
    expect(fleet.synthetic).toBe(true);
    for (const v of fleet.vessels) {
      expect(v.synthetic).toBe(true);
      expect(v.name.startsWith("SYN ")).toBe(true);
      for (const c of v.certificates) expect(c.synthetic).toBe(true);
    }
  });
});

describe("queryFleet", () => {
  const asOf = fleet.generated_as_of;

  it("returns only certificates expiring within the window, soonest first", () => {
    const rows = queryFleet(fleet, { withinDays: 30, asOf });
    for (const r of rows) {
      expect(r.status).toBe("expiring");
      expect(r.days_left).toBeGreaterThanOrEqual(0);
      expect(r.days_left).toBeLessThanOrEqual(30);
    }
    const days = rows.map((r) => r.days_left);
    expect(days).toEqual([...days].sort((a, b) => a - b));
  });

  it("widening the window never returns fewer results", () => {
    const small = queryFleet(fleet, { withinDays: 30, asOf }).length;
    const large = queryFleet(fleet, { withinDays: 90, asOf }).length;
    expect(large).toBeGreaterThanOrEqual(small);
    expect(large).toBeGreaterThan(0);
  });

  it("includes expired certificates only when asked", () => {
    expect(queryFleet(fleet, { withinDays: 0, asOf }).some((r) => r.status === "expired")).toBe(
      false,
    );
    const withExpired = queryFleet(fleet, { withinDays: 0, asOf, includeExpired: true });
    expect(withExpired.some((r) => r.status === "expired")).toBe(true);
  });

  it("counts days in UTC", () => {
    expect(daysBetween("2026-11-01", "2026-11-11")).toBe(10);
    expect(daysBetween("2026-11-01", "2026-10-31")).toBe(-1);
  });
});
