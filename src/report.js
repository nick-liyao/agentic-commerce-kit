function statusIcon(ok) {
  return ok ? "OK  " : "WARN";
}

export function renderTextReport(report) {
  const lines = [
    "Agentic Commerce Kit",
    "",
    `Target: ${report.target}`,
    `Checked: ${report.checkedAt}`,
    `AI Agent Readiness Score: ${report.score}/100`,
    "",
    "Checks:"
  ];

  for (const check of report.checks) {
    lines.push(`${statusIcon(check.ok)} ${check.label}`);
    lines.push(`     ${check.detail}`);
  }

  const failed = report.checks.filter((check) => !check.ok);

  lines.push("");
  lines.push("Recommended next steps:");

  if (failed.length === 0) {
    lines.push("1. Add an agent-readable commerce catalog feed.");
    lines.push("2. Wire the store into an MCP server for read-only AI agent access.");
    lines.push("3. Schedule weekly audits in CI.");
  } else {
    failed.slice(0, 5).forEach((check, index) => {
      lines.push(`${index + 1}. Fix: ${check.label}.`);
    });
  }

  return lines.join("\n");
}

export function renderJsonReport(report) {
  return JSON.stringify(report, null, 2);
}
