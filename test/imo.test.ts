import { describe, expect, it } from "vitest";
import { hasValidImoCheckDigit, imoCheckDigit, isSyntheticImo, syntheticImo } from "../src/imo.js";

describe("IMO numbers", () => {
  it("computes the check digit", () => {
    // 1 2 3 4 5 6 -> 1*7+2*6+3*5+4*4+5*3+6*2 = 77 -> 7. A textbook example, not a ship.
    expect(imoCheckDigit("123456")).toBe(7);
    expect(hasValidImoCheckDigit("IMO1234567")).toBe(true);
    expect(hasValidImoCheckDigit("IMO1234568")).toBe(false);
  });

  it("generates numbers that can never be real", () => {
    for (let i = 0; i < 50; i++) {
      const imo = syntheticImo(String(10000 + i * 997), i);
      expect(imo).toMatch(/^IMO0\d{6}$/);
      expect(hasValidImoCheckDigit(imo)).toBe(false);
      expect(isSyntheticImo(imo)).toBe(true);
    }
  });

  it("does not treat a well-formed number as synthetic", () => {
    expect(isSyntheticImo("IMO1234567")).toBe(false);
  });
});
