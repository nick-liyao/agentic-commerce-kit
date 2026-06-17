import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:http";

async function withAuditServer(handler) {
  const server = createServer((req, res) => {
    if (req.url === "/robots.txt") {
      res.writeHead(200, { "content-type": "text/plain" });
      res.end("User-agent: *\nAllow: /\n");
      return;
    }

    if (req.url === "/sitemap.xml") {
      res.writeHead(200, { "content-type": "application/xml" });
      res.end("<urlset></urlset>");
      return;
    }

    if (req.url === "/feed.xml") {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }

    res.writeHead(200, { "content-type": "text/html" });
    res.end(`<!doctype html>
      <html>
        <head>
          <meta property="og:title" content="Example Store">
          <script type="application/ld+json">
            {"@context":"https://schema.org","@type":"Product","name":"Widget","offers":{"@type":"Offer","price":"19.99"}}
          </script>
        </head>
        <body><img src="/product.jpg" alt="Example product image"></body>
      </html>`);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const { port } = server.address();
    return await handler(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function runCli(args) {
  const child = spawn(process.execPath, ["src/cli.js", ...args], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  let stdout = "";
  let stderr = "";

  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  const status = await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.on("close", resolve);
  });

  return { status, stdout, stderr };
}

test("CLI emits machine-readable JSON when --json is passed before the audit URL", async () => {
  await withAuditServer(async (baseUrl) => {
    const result = await runCli(["audit", "--json", baseUrl]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, "");

    const report = JSON.parse(result.stdout);
    assert.equal(report.target, `${baseUrl}/`);
    assert.equal(typeof report.score, "number");
    assert.equal(report.checks.some((check) => check.id === "productSchema"), true);
  });
});
