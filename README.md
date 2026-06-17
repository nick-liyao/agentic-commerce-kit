# Agentic Commerce Kit

AI-agent readiness audits and MCP-ready commerce utilities for Shopify and ecommerce stores.

> Make your store readable by Codex, Claude Code, Cursor, and the next wave of shopping agents.

```bash
npx agentic-commerce-kit audit https://your-store.com
```

For CI jobs, agents, and dashboards, emit the same audit as machine-readable JSON:

```bash
npx agentic-commerce-kit audit --json https://your-store.com
```

Agentic Commerce Kit is a developer toolkit for the new AI-commerce stack: machine-readable product data, clean structured metadata, agent-safe store context, and MCP-ready ecommerce workflows.

## Why This Exists

AI coding agents can write code, inspect data, and automate workflows. Most ecommerce stores are not ready for that world.

Product data is scattered across storefront pages, Shopify APIs, feeds, sitemaps, schema markup, images, blogs, and collection pages. A human can click around and understand the store. An AI agent needs clean, machine-readable context.

Agentic Commerce Kit gives developers a practical way to answer one question:

**Can an AI agent understand this store?**

The first release is a public-site audit. The next milestones are a read-only MCP server, Shopify catalog adapters, and agent-readable commerce feeds.

## Quick Start

```bash
npx agentic-commerce-kit audit https://your-store.com
```

Or after cloning:

```bash
npm install
npm run audit -- https://pixvoices.com
```

Example output:

```text
Agentic Commerce Kit

Target: https://example-store.com/
AI Agent Readiness Score: 72/100

Checks:
OK   robots.txt is available
OK   sitemap.xml is available
OK   OpenGraph metadata is present
WARN Product schema is visible
     0 Product/ProductGroup schema nodes found

Recommended next steps:
1. Fix: Product schema is visible.
2. Add an agent-readable commerce catalog feed.
3. Wire the store into an MCP server for read-only AI agent access.
```

## What It Checks

- `robots.txt`
- `sitemap.xml`
- OpenGraph metadata
- JSON-LD structured data
- Product/ProductGroup schema
- Product offers in schema markup
- Homepage image alt text
- Public feed availability

## Why It Matters

AI shopping and agentic commerce are moving from demos into infrastructure. Stores need to expose product context in a way that agents can verify, retrieve, and safely use.

This project focuses on the merchant/developer side:

- Can agents discover your catalog?
- Can agents trust your product metadata?
- Can coding tools safely read store context?
- Can feeds support both legacy channels and AI workflows?
- Can store audits run in CI before automation is added?

## Roadmap

- Shopify catalog discovery.
- Agent-readable commerce catalog JSON.
- Pinterest-compatible RSS feed generation.
- MCP server for Claude Code, Cursor, Codex, and other agent clients.
- GitHub Action for scheduled store audits.
- Product page crawling from sitemap.
- Blog and SEO audit for AI retrieval.

## Planned MCP Tools

The next milestone is a read-only MCP server with tools such as:

- `list_products`
- `get_product`
- `search_products`
- `get_collections`
- `get_blog_posts`
- `generate_catalog_feed`

## Example: PixVoices Audit

This repository was started from a real Shopify-based independent store workflow. The public audit mode can run without private credentials:

```bash
node src/cli.js audit https://pixvoices.com
```

Sample result from the initial version:

```text
AI Agent Readiness Score: 60/100

OK   robots.txt is available
OK   sitemap.xml is available
OK   OpenGraph metadata is present
OK   JSON-LD structured data is present
WARN Product schema is visible
WARN Product schema includes offers
WARN Public feed is available
```

## Security Model

The default audit mode only uses public website data. It does not require Shopify Admin API credentials.

Never commit:

- `.env` files
- Shopify Admin API tokens
- customer data
- order data
- private analytics exports
- private supplier or fulfillment data

## Why Developers Might Use This

- You run a Shopify store and want to use AI coding tools safely.
- You build ecommerce automation workflows.
- You want Claude Code, Cursor, Codex, or another agent to understand product context.
- You need a public, repeatable audit before adding AI automation to a store.
- You want feeds that work for both old channels and agentic workflows.

## Project Status

Early public MVP. The CLI audit works today. MCP and Shopify catalog adapters are next.

Stars, issues, and feature requests help decide what gets built first.

## License

MIT
