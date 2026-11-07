import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_AS_OF, generateFleet } from "../scripts/generate-fleet.js";
import { certificateStatus, daysBetween, loadFleet, queryFleet } from "../src/fleet.js";
import type { Fleet } from "../src/fleet.js";
import { syntheticImo } from "../src/imo.js";

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

  describe("date boundaries", () => {
    const historicalAsOf = "2020-01-01";
    const imo = syntheticImo("12345", 0);
    // Deliberately not in expiry order, so the assertions also check sorting.
    const certificates = (
      [
        ["window-end", "2020-01-31"],
        ["yesterday", "2019-12-31"],
        ["same-day", "2020-01-01"],
        ["outside-window", "2020-02-01"],
        ["older-expired", "2019-12-02"],
        ["next-day", "2020-01-02"],
        ["no-expiry", null],
      ] satisfies [string, string | null][]
    ).map(([id, expiresOn]) => ({
      certificate_id: `SYN-${id}`,
      vessel_imo: imo,
      type: "international-load-line-certificate",
      certificate_number: `SYN-${id}`,
      issued_by: "SYN Test Class",
      issued_on: "2019-01-01",
      expires_on: expiresOn,
      synthetic: true,
    }));
    const boundaryFleet: Fleet = {
      synthetic: true,
      generated_as_of: "2026-11-01",
      vessels: [
        {
          imo,
          name: "SYN Boundary Test",
          flag: "SYN",
          vessel_type: "bulk_carrier",
          gross_tonnage: 10000,
          year_built: 2010,
          owner: "SYN Test Owner",
          manager: "SYN Test Manager",
          class_society: "SYN Test Class",
          synthetic: true,
          certificates,
        },
      ],
    };
    const summarize = (rows: ReturnType<typeof queryFleet>) =>
      rows.map((row) => [row.certificate_number, row.days_left, row.status]);

    it("uses a historical asOf rather than the fleet date to classify certificates", () => {
      const dated = certificates.filter((cert) => cert.expires_on !== null);
      expect(
        dated.map((cert) => certificateStatus(cert, boundaryFleet.generated_as_of, 30)),
      ).toEqual(dated.map(() => "expired"));
      expect(certificateStatus(certificates[3]!, historicalAsOf, 30)).toBe("valid");
      expect(
        summarize(queryFleet(boundaryFleet, { withinDays: 30, asOf: historicalAsOf })),
      ).toEqual([
        ["SYN-same-day", 0, "expiring"],
        ["SYN-next-day", 1, "expiring"],
        ["SYN-window-end", 30, "expiring"],
      ]);
    });

    it("includes the same day but not the next day in a zero-day window", () => {
      expect(summarize(queryFleet(boundaryFleet, { withinDays: 0, asOf: historicalAsOf }))).toEqual(
        [["SYN-same-day", 0, "expiring"]],
      );
    });

    it.each([undefined, false])(
      "excludes expired certificates when includeExpired is %s",
      (includeExpired) => {
        const rows = queryFleet(boundaryFleet, {
          withinDays: 30,
          asOf: historicalAsOf,
          includeExpired,
        });
        expect(summarize(rows)).toEqual([
          ["SYN-same-day", 0, "expiring"],
          ["SYN-next-day", 1, "expiring"],
          ["SYN-window-end", 30, "expiring"],
        ]);
      },
    );

    it("includes expired certificates with their status and sorts all results soonest first", () => {
      const rows = queryFleet(boundaryFleet, {
        withinDays: 30,
        asOf: historicalAsOf,
        includeExpired: true,
      });
      expect(summarize(rows)).toEqual([
        ["SYN-older-expired", -30, "expired"],
        ["SYN-yesterday", -1, "expired"],
        ["SYN-same-day", 0, "expiring"],
        ["SYN-next-day", 1, "expiring"],
        ["SYN-window-end", 30, "expiring"],
      ]);
    });
  });
});
