import { API_URL } from "../../config";
import { storage } from "../../storage";

let configCache: any = null;

export async function getConfig() {
  if (configCache) {
    // Fire background update
    fetchConfigBackground().catch(() => {});
    return configCache;
  }

  // Baca dari MMKV (0ms) agar scraper lokal kebal dari server down/cold-start!
  const cached = storage.getString("@scraper_config");
  if (cached) {
    try {
      configCache = JSON.parse(cached);
      // Fetch in background to keep it updated for next sessions
      fetchConfigBackground().catch(() => {});
      return configCache;
    } catch (e) {}
  }

  // Jika tidak ada di memory dan MMKV, terpaksa tunggu server
  return await fetchConfigBackground();
}

async function fetchConfigBackground() {
  try {
    const targetUrl = API_URL.endsWith("/")
      ? `${API_URL}api/v2/config/app`
      : `${API_URL}/api/v2/config/app`;
    const res = await fetch(targetUrl);
    if (!res.ok)
      throw new Error("Failed to fetch dynamic scraper rules from server");

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Expected JSON for scraper rules, got ${contentType}`);
    }

    const data = await res.json();
    if (data && data.scraper_rules) {
      const rules = data.scraper_rules.anime || data.scraper_rules;
      configCache = rules;
      storage.set("@scraper_config", JSON.stringify(rules));
      return rules;
    }
    throw new Error("Scraper rules not found in server response");
  } catch (e) {
    throw e;
  }
}

export async function reportError(provider: string, url: string, error: any) {
  try {
    const targetUrl = API_URL.endsWith("/")
      ? `${API_URL}api/v2/telemetry/scraper-error`
      : `${API_URL}/api/v2/telemetry/scraper-error`;
    await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        url,
        error_message: error?.message || String(error),
      }),
    });
  } catch (e) {}
}
