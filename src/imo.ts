/**
 * IMO numbers are 7 digits. The last digit is a check digit: multiply the first six digits
 * by 7, 6, 5, 4, 3, 2, add them up, and take the last digit of the sum.
 */
export function imoCheckDigit(first6: string): number {
  if (!/^\d{6}$/.test(first6)) throw new Error("Need exactly six digits.");
  const sum = [...first6].reduce((acc, d, i) => acc + Number(d) * (7 - i), 0);
  return sum % 10;
}

export function hasValidImoCheckDigit(imo: string): boolean {
  const digits = imo.replace(/^IMO/, "");
  if (!/^\d{7}$/.test(digits)) return false;
  return imoCheckDigit(digits.slice(0, 6)) === Number(digits[6]);
}

/**
 * Synthetic IMO numbers used in this repository start with "IMO0" (no real IMO number
 * starts with 0) and deliberately fail the check digit. Both rules make collisions with
 * real ships impossible.
 */
export function isSyntheticImo(imo: string): boolean {
  return /^IMO0\d{6}$/.test(imo) && !hasValidImoCheckDigit(imo);
}

/** Builds a synthetic IMO number from five digits. */
export function syntheticImo(five: string, offset: number): string {
  const first6 = `0${five}`;
  const valid = imoCheckDigit(first6);
  const wrong = (valid + 1 + (Math.abs(offset) % 9)) % 10;
  return `IMO${first6}${wrong}`;
}
