import test from "node:test";
import assert from "node:assert/strict";
import { normalizeBaseUrl } from "../src/utils.js";
import { renderTextReport } from "../src/report.js";

test("normalizes a commerce site URL to origin root", () => {
  assert.equal(normalizeBaseUrl("pixvoices.com/products/demo?x=1#top"), "https://pixvoices.com/");
});

test("renders report text", () => {
  const report = {
    target: "https://example.com/",
    checkedAt: "2026-06-17T00:00:00.000Z",
    score: 80,
    checks: [
      {
        ok: true,
        label: "robots.txt is available",
        detail: "https://example.com/robots.txt"
      },
      {
        ok: false,
        label: "Product schema is visible",
        detail: "0 Product schema nodes found"
      }
    ]
  };

  const text = renderTextReport(report);
  assert.match(text, /AI Agent Readiness Score: 80\/100/);
  assert.match(text, /Fix: Product schema is visible/);
});
