#!/usr/bin/env node

import { auditSite } from "./index.js";
import { renderJsonReport, renderTextReport } from "./report.js";

function printHelp() {
  console.log(`Agentic Commerce Kit

Usage:
  ackit audit [--json] <url>
  agentic-commerce-kit audit [--json] <url>

Examples:
  ackit audit https://pixvoices.com
  npx agentic-commerce-kit audit https://example-store.com
`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command !== "audit") {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  const json = args.includes("--json");
  const targetUrl = args.find((arg) => arg !== "--json");

  if (!targetUrl) {
    console.error("Missing URL.");
    printHelp();
    process.exitCode = 1;
    return;
  }

  try {
    const report = await auditSite(targetUrl);
    console.log(json ? renderJsonReport(report) : renderTextReport(report));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
