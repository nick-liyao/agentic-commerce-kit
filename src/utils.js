export function normalizeBaseUrl(input) {
  const url = new URL(input.startsWith("http") ? input : `https://${input}`);
  url.hash = "";
  url.search = "";
  url.pathname = "/";
  return url.toString();
}

export async function fetchText(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "agentic-commerce-kit/0.1 (+https://github.com/nick-liyao/agentic-commerce-kit)"
      }
    });

    return {
      ok: response.ok,
      status: response.status,
      text: await response.text()
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      text: "",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
