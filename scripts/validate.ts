// pnpm validate [file.json]: validates the synthetic fleet (default) or a JSON file holding
// one certificate, one vessel, a list of either, or a fleet object.
import { readFileSync } from "node:fs";
import { validateCertificate, validateVessel } from "../src/validate.js";

const path = process.argv[2] ?? "data/synthetic-fleet/fleet.json";
const data = JSON.parse(readFileSync(path, "utf8"));
const records: unknown[] = Array.isArray(data) ? data : data.vessels ? data.vessels : [data];

let failures = 0;
records.forEach((record, i) => {
  const isVessel = typeof record === "object" && record !== null && "certificates" in record;
  const result = isVessel ? validateVessel(record) : validateCertificate(record);
  if (!result.valid) {
    failures++;
    console.log(`Record ${i}: invalid`);
    for (const e of result.errors) console.log(`  ${e}`);
  }
});
console.log(`${records.length - failures}/${records.length} records valid in ${path}`);
process.exitCode = failures === 0 ? 0 : 1;
