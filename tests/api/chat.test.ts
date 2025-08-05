import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/chat/route";

vi.mock("@/lib/agents", () => ({
  runAgent: vi.fn(async () =>
    new ReadableStream({
      start(controller) {
        controller.enqueue("data: test\n\n");
        controller.close();
      },
    }),
  ),
}));

vi.mock("@/lib/router", () => ({
  route: vi.fn(async () => ({ agent: "Listener", headers: new Headers() })),
}));

describe("/api/chat", () => {
  it("returns stream on POST", async () => {
    const req = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("text/event-stream");
  });

  it("rejects non-POST methods", async () => {
    const req = new NextRequest("http://localhost/api/chat", { method: "GET" });
    const res = await GET(req);
    expect(res.status).toBe(405);
    expect(res.headers.get("Content-Type")).toBe("application/json");
    const body = await res.json();
    expect(body).toEqual({ error: "Method not allowed" });
  });
});
