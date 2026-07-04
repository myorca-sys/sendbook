export class ProxyFetcher {
  static async getHtml(
    url: string,
    proxyUrl: string,
    proxySecret: string,
  ): Promise<string> {
    if (!proxyUrl || !proxySecret) {
      console.warn(
        "[ProxyFetcher] Missing proxy configuration, falling back to direct fetch",
      );
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        },
      });
      if (!res.ok) throw new Error(`Direct Fetch Failed: ${res.status}`);
      return await res.text();
    }

    const encodedUrl = encodeURIComponent(url);
    const reqUrl = `${proxyUrl.replace(/\/$/, "")}/?url=${encodedUrl}`;

    console.log(`[ProxyFetcher] Routing request via proxy: ${url}`);

    const res = await fetch(reqUrl, {
      headers: {
        "x-proxy-key": proxySecret,
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Proxy Fetch Failed: HTTP ${res.status} - ${errText}`);
    }

    return await res.text();
  }
}
