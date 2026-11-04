import { readdirSync, readFileSync } from "node:fs";
import { parse } from "yaml";

export const KNOWLEDGE_DIR = new URL("../knowledge/certificates/", import.meta.url);

export interface CardMeta {
  id: string;
  title: string;
  short_name: string;
  convention: string;
  issued_by: string;
  max_validity_years: number | null;
  source_links: string[];
  verified_by: string;
  last_checked: string;
}

export interface Card {
  meta: CardMeta;
  /** Markdown body without the front matter. */
  body: string;
}

export function parseCard(text: string): Card {
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!match?.[1] || match[2] === undefined) throw new Error("Card has no front matter.");
  const meta = parse(match[1], { schema: "failsafe" }) as Record<string, unknown>;
  return {
    meta: {
      ...(meta as unknown as CardMeta),
      max_validity_years:
        meta.max_validity_years === "null" ? null : Number(meta.max_validity_years),
      verified_by: String(meta.verified_by ?? ""),
    },
    body: match[2].trimStart(),
  };
}

function cardFiles(dir: URL): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .sort();
}

export function listCertificateTypes(dir: URL = KNOWLEDGE_DIR): CardMeta[] {
  return cardFiles(dir).map((f) => parseCard(readFileSync(new URL(f, dir), "utf8")).meta);
}

/** Returns a card by id, or undefined. Only ids of existing cards are accepted. */
export function getCertificateCard(id: string, dir: URL = KNOWLEDGE_DIR): Card | undefined {
  const file = cardFiles(dir).find((f) => f === `${id}.md`);
  return file ? parseCard(readFileSync(new URL(file, dir), "utf8")) : undefined;
}
