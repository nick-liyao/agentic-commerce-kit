import { fetchText, normalizeBaseUrl } from "./utils.js";

const PRODUCT_SCHEMA_TYPES = new Set(["Product", "ProductGroup"]);

function hasOpenGraph(html) {
  return /<meta\s+[^>]*(property|name)=["']og:/i.test(html);
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const pattern = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = pattern.exec(html))) {
    const raw = match[1].trim();

    try {
      blocks.push(JSON.parse(raw));
    } catch {
      blocks.push({ parseError: true, rawPreview: raw.slice(0, 120) });
    }
  }

  return blocks;
}

function flattenSchemaNodes(value) {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenSchemaNodes);
  }

  const nodes = [value];

  if (Array.isArray(value["@graph"])) {
    nodes.push(...value["@graph"].flatMap(flattenSchemaNodes));
  }

  return nodes;
}

function schemaTypeMatches(type) {
  if (Array.isArray(type)) {
    return type.some((item) => PRODUCT_SCHEMA_TYPES.has(item));
  }

  return PRODUCT_SCHEMA_TYPES.has(type);
}

function analyzeJsonLd(html) {
  const blocks = extractJsonLdBlocks(html);
  const nodes = blocks.flatMap(flattenSchemaNodes);
  const productNodes = nodes.filter((node) => schemaTypeMatches(node["@type"]));

  return {
    totalBlocks: blocks.length,
    parseErrors: blocks.filter((block) => block.parseError).length,
    productNodes: productNodes.length,
    productsWithOffers: productNodes.filter((node) => Boolean(node.offers)).length
  };
}

function analyzeImages(html) {
  const imageMatches = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const missingAlt = imageMatches.filter((tag) => !/\salt\s*=/i.test(tag)).length;
  const weakAlt = imageMatches.filter((tag) => {
    const alt = tag.match(/\salt\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() || "";
    return alt.length > 0 && alt.length < 8;
  }).length;

  return {
    total: imageMatches.length,
    missingAlt,
    weakAlt
  };
}

function scoreChecks(checks) {
  const earned = checks.reduce((total, check) => total + (check.ok ? check.weight : 0), 0);
  const possible = checks.reduce((total, check) => total + check.weight, 0);
  return Math.round((earned / possible) * 100);
}

async function checkPublicFile(baseUrl, pathname) {
  const url = new URL(pathname, baseUrl);
  const result = await fetchText(url.toString());

  return {
    url: url.toString(),
    ok: result.ok,
    status: result.status,
    text: result.text
  };
}

export async function auditSite(inputUrl) {
  const baseUrl = normalizeBaseUrl(inputUrl);
  const homepage = await fetchText(baseUrl);

  if (!homepage.ok) {
    throw new Error(`Could not fetch homepage: ${homepage.status} ${baseUrl}`);
  }

  const [robots, sitemap, feed] = await Promise.all([
    checkPublicFile(baseUrl, "/robots.txt"),
    checkPublicFile(baseUrl, "/sitemap.xml"),
    checkPublicFile(baseUrl, "/feed.xml")
  ]);

  const jsonLd = analyzeJsonLd(homepage.text);
  const images = analyzeImages(homepage.text);
  const openGraph = hasOpenGraph(homepage.text);

  const checks = [
    {
      id: "robots",
      label: "robots.txt is available",
      ok: robots.ok,
      weight: 10,
      detail: robots.ok ? robots.url : `Missing or unavailable: ${robots.status}`
    },
    {
      id: "sitemap",
      label: "sitemap.xml is available",
      ok: sitemap.ok,
      weight: 15,
      detail: sitemap.ok ? sitemap.url : `Missing or unavailable: ${sitemap.status}`
    },
    {
      id: "openGraph",
      label: "OpenGraph metadata is present",
      ok: openGraph,
      weight: 10,
      detail: openGraph ? "Found og:* metadata" : "No og:* metadata found on homepage"
    },
    {
      id: "jsonLd",
      label: "JSON-LD structured data is present",
      ok: jsonLd.totalBlocks > 0 && jsonLd.parseErrors === 0,
      weight: 15,
      detail: `${jsonLd.totalBlocks} JSON-LD blocks, ${jsonLd.parseErrors} parse errors`
    },
    {
      id: "productSchema",
      label: "Product schema is visible",
      ok: jsonLd.productNodes > 0,
      weight: 20,
      detail: `${jsonLd.productNodes} Product/ProductGroup schema nodes found`
    },
    {
      id: "productOffers",
      label: "Product schema includes offers",
      ok: jsonLd.productsWithOffers > 0,
      weight: 10,
      detail: `${jsonLd.productsWithOffers} product schema nodes include offers`
    },
    {
      id: "imageAlt",
      label: "Homepage images have useful alt text",
      ok: images.total === 0 || images.missingAlt + images.weakAlt <= Math.ceil(images.total * 0.25),
      weight: 10,
      detail: `${images.total} images, ${images.missingAlt} missing alt, ${images.weakAlt} weak alt`
    },
    {
      id: "feed",
      label: "Public feed is available",
      ok: feed.ok,
      weight: 10,
      detail: feed.ok ? feed.url : "No /feed.xml found; consider an AI/catalog feed"
    }
  ];

  return {
    target: baseUrl,
    score: scoreChecks(checks),
    checkedAt: new Date().toISOString(),
    checks,
    signals: {
      jsonLd,
      images
    }
  };
}
