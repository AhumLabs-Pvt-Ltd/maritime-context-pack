import { describe, expect, it } from "vitest";
import { getCertificateCard, listCertificateTypes } from "../src/knowledge.js";

const REQUIRED_SECTIONS = [
  "## What it is",
  "## Issuing authority",
  "## Convention",
  "## Validity",
  "## Survey windows",
  "## Common problems",
  "## Data fields",
  "## Source",
];

describe("certificate cards", () => {
  const cards = listCertificateTypes();

  it("has the five starter cards", () => {
    expect(cards.map((c) => c.id)).toEqual([
      "cargo-ship-safety-construction-certificate",
      "certificate-of-registry",
      "international-load-line-certificate",
      "iopp-certificate",
      "safety-management-certificate",
    ]);
  });

  it.each(cards.map((c) => c.id))("%s follows the card structure", (id) => {
    const card = getCertificateCard(id)!;
    expect(card.meta.id).toBe(id);
    expect(card.meta.source_links.length).toBeGreaterThan(0);
    for (const link of card.meta.source_links) expect(link).toMatch(/^https:\/\//);
    expect(card.meta.last_checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof card.meta.verified_by).toBe("string");
    let last = -1;
    for (const heading of REQUIRED_SECTIONS) {
      const at = card.body.indexOf(heading);
      expect(at, `${id} is missing "${heading}"`).toBeGreaterThan(last);
      last = at;
    }
  });

  it("refuses ids that are not cards", () => {
    expect(getCertificateCard("../../package")).toBeUndefined();
    expect(getCertificateCard("_TEMPLATE")).toBeUndefined();
  });
});
