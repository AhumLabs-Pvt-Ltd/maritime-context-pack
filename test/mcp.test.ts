import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { beforeAll, describe, expect, it } from "vitest";
import { loadFleet } from "../src/fleet.js";
import { createMcpServer } from "../src/mcp/server.js";

const text = (result: Awaited<ReturnType<Client["callTool"]>>) =>
  (result.content as { type: string; text: string }[])[0]!.text;

describe("MCP server", () => {
  const client = new Client({ name: "test", version: "0.0.0" });
  const fleet = loadFleet();

  beforeAll(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await createMcpServer(fleet).connect(serverTransport);
    await client.connect(clientTransport);
  });

  it("exposes the three tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual([
      "get_certificate_card",
      "list_certificate_types",
      "query_fleet",
    ]);
  });

  it("lists certificate types", async () => {
    const types = JSON.parse(text(await client.callTool({ name: "list_certificate_types" })));
    expect(types).toHaveLength(5);
  });

  it("returns a card and reports unknown ids", async () => {
    const ok = await client.callTool({
      name: "get_certificate_card",
      arguments: { id: "iopp-certificate" },
    });
    expect(text(ok)).toContain("MARPOL Annex I");
    const bad = await client.callTool({ name: "get_certificate_card", arguments: { id: "nope" } });
    expect(bad.isError).toBe(true);
  });

  it("queries the fleet", async () => {
    const result = await client.callTool({
      name: "query_fleet",
      arguments: { within_days: 90, as_of: fleet.generated_as_of },
    });
    const body = JSON.parse(text(result));
    expect(body.synthetic).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);
  });
});
