import { resolveValue } from "./resolver";
import OrcaNativeCore from "../../../modules/orca-native-core/src";

const getDefaultHeaders = (headers: any) => ({
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  ...headers,
});

export async function executeFetchHtml(
  config: any,
  state: any,
): Promise<string> {
  const url = resolveValue(config.url, state);
  const headers = getDefaultHeaders(resolveValue(config.headers || {}, state));

  if (OrcaNativeCore?.fetchHtmlAntiBot) {
    try {
      return await OrcaNativeCore.fetchHtmlAntiBot(url, headers);
    } catch (e) {
      console.warn("[Native Fetch Failed, Falling back to JS fetch]", e);
    }
  }

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
  return await res.text();
}

export async function executeFetchApi(config: any, state: any): Promise<any> {
  const url = resolveValue(config.url, state);
  const method = resolveValue(config.method, state) || "GET";
  const body = resolveValue(config.body, state);
  const headers = resolveValue(
    config.headers || {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
    },
    state,
  );

  const options: RequestInit = { method, headers };
  if (body)
    options.body = typeof body === "object" ? JSON.stringify(body) : body;

  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP API Error ${res.status} at ${url}`);

  const contentType = res.headers.get("content-type");
  return contentType?.includes("application/json")
    ? await res.json()
    : await res.text();
}

export async function executeMapApiCalls(
  config: any,
  state: any,
): Promise<any[]> {
  const items = resolveValue(config.input, state);
  if (!Array.isArray(items)) return [];

  const {
    url: urlTpl,
    method: methodTpl = "GET",
    body_form: bodyFormTpl,
    headers: headersTpl = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0",
      "X-Requested-With": "XMLHttpRequest",
    },
  } = config;

  const results: any[] = [];
  for (const item of items) {
    const originalItem = state.item;
    state.item = item;
    try {
      const options: RequestInit = {
        method: resolveValue(methodTpl, state),
        headers: resolveValue(headersTpl, state),
      };
      if (bodyFormTpl) {
        const params = new URLSearchParams();
        for (const [k, v] of Object.entries(resolveValue(bodyFormTpl, state)))
          params.append(k, String(v));
        options.body = params.toString();
      }
      const res = await fetch(resolveValue(urlTpl, state), options);
      if (res.ok) results.push(await res.text());
    } catch (e) {
      console.warn("[RuleEvaluator] Map API Call failed", e);
    } finally {
      state.item = originalItem;
    }
  }
  return results;
}
