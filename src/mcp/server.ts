// MCP server for the maritime context pack. Run with "pnpm mcp" (stdio).
// Tools: list_certificate_types, get_certificate_card, query_fleet.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { loadEnvFile } from "../config.js";
import { loadFleet, queryFleet, type Fleet } from "../fleet.js";
import { getCertificateCard, listCertificateTypes } from "../knowledge.js";
import { log } from "../log.js";

const json = (value: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
});

export function createMcpServer(fleet: Fleet = loadFleet()): McpServer {
  const server = new McpServer({ name: "ahum-maritime-context-pack", version: "0.1.0" });

  server.registerTool(
    "list_certificate_types",
    {
      description:
        "List the certificate types that have a knowledge card: id, title, convention and issuer.",
      inputSchema: {},
    },
    async () =>
      json(
        listCertificateTypes().map(({ id, title, short_name, convention, issued_by }) => ({
          id,
          title,
          short_name,
          convention,
          issued_by,
        })),
      ),
  );

  server.registerTool(
    "get_certificate_card",
    {
      description:
        "Get the full knowledge card for one certificate type: what it is, issuer, convention, validity, survey windows, common problems, data fields and sources. Cards are community-written summaries, not legal text; check verified_by.",
      inputSchema: {
        id: z.string().describe("Certificate type id from list_certificate_types"),
      },
    },
    async ({ id }) => {
      const card = getCertificateCard(id);
      if (!card) {
        const ids = listCertificateTypes().map((c) => c.id);
        return {
          isError: true,
          content: [{ type: "text", text: `Unknown id "${id}". Known ids: ${ids.join(", ")}` }],
        };
      }
      return { content: [{ type: "text", text: `${JSON.stringify(card.meta)}\n\n${card.body}` }] };
    },
  );

  server.registerTool(
    "query_fleet",
    {
      description:
        "Find certificates in the SYNTHETIC demo fleet that expire within N days. Returns vessel, certificate type, expiry date and days left, soonest first.",
      inputSchema: {
        within_days: z.number().int().min(0).max(3650).describe("Look-ahead window in days"),
        as_of: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Reference date YYYY-MM-DD. Defaults to today (UTC)."),
        include_expired: z
          .boolean()
          .optional()
          .describe("Also return certificates that have already expired"),
      },
    },
    async ({ within_days, as_of, include_expired }) =>
      json({
        synthetic: true,
        results: queryFleet(fleet, {
          withinDays: within_days,
          asOf: as_of,
          includeExpired: include_expired,
        }),
      }),
  );

  return server;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  loadEnvFile();
  await createMcpServer().connect(new StdioServerTransport());
  log("Maritime context pack MCP server running on stdio");
}
