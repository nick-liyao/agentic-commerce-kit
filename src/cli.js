#!/usr/bin/env node

import { auditSite } from "./index.js";
import { renderTextReport } from "./report.js";

function printHelp() {
  console.log(`Agentic Commerce Kit

Usage:
  ackit audit <url>
  agentic-commerce-kit audit <url>

Examples:
  ackit audit https://pixvoices.com
  npx agentic-commerce-kit audit https://example-store.com
`);
}

async function main() {
  const [command, targetUrl] = process.argv.slice(2);

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

  if (!targetUrl) {
    console.error("Missing URL.");
    printHelp();
    process.exitCode = 1;
    return;
  }

  try {
    const report = await auditSite(targetUrl);
    console.log(renderTextReport(report));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
