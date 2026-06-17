# Public Launch Posts

## X / Twitter

I am building Agentic Commerce Kit: an open-source toolkit that helps AI coding agents audit, understand, and automate Shopify/ecommerce stores.

First feature: run one command and get an AI-agent readiness report for your store.

```bash
npx agentic-commerce-kit audit https://your-store.com
```

MCP support for Claude Code, Cursor, and Codex is next.

GitHub: <repo-url>

## Hacker News - Show HN

Title:

Show HN: Agentic Commerce Kit - AI-agent readiness audits for Shopify stores

Post:

I am building an open-source toolkit for ecommerce developers who want to make their stores easier for AI agents and coding assistants to understand.

The first version audits a public ecommerce site and checks common signals such as robots.txt, sitemap.xml, Product JSON-LD, OpenGraph metadata, product image alt text, and feed availability. The goal is to answer a practical question: can an AI agent reliably understand this store?

The next milestone is an MCP server that exposes product and collection context to Claude Code, Cursor, Codex, and other MCP clients.

I started this because I run a Shopify-based independent store and found that the current tooling is fragmented: feeds are built for legacy channels, schema is easy to miss, and AI coding tools need a cleaner way to access store context.

GitHub: <repo-url>

## V2EX

标题：

做了一个开源工具：检测 Shopify/独立站是否适合被 AI Agent 读取

正文：

最近在做跨境独立站和 AI coding，发现一个问题：Claude Code、Cursor、Codex 这类工具越来越强，但电商网站的数据对 agent 来说并不总是友好。

所以我准备开源一个工具 Agentic Commerce Kit。

第一版目标：

- 检测 robots.txt / sitemap.xml。
- 检测 Product JSON-LD。
- 检测 OpenGraph。
- 检测产品图 alt。
- 检测 feed。
- 输出一个 AI Agent Readiness Score。

后面会加 MCP server，让 Claude Code / Cursor / Codex 可以安全读取商品、集合、博客等上下文。

仓库：<repo-url>

