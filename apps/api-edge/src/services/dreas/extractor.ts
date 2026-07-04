import * as cheerio from "cheerio";

export class VideoExtractor {
  static async extract(url: string): Promise<string> {
    if (!url) return "";

    const urlLower = url.toLowerCase();

    try {
      // PIXELDRAIN
      if (urlLower.includes("pixeldrain.com/api/file/")) return url;
      if (urlLower.includes("pixeldrain.com/u/")) {
        const fileId = url.split("/u/")[1].split("?")[0];
        return `https://pixeldrain.com/api/file/${fileId}`;
      }

      // WIBUFILE
      if (urlLower.includes("wibufile.com")) {
        if (urlLower.includes("/video") || urlLower.includes("s0.wibufile")) {
          if (urlLower.endsWith(".mp4") || urlLower.endsWith(".m3u8"))
            return url;
        }
        if (urlLower.includes("/embed/")) {
          try {
            const res = await fetch(url, {
              headers: {
                Referer: "https://v2.samehadaku.how/",
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            });
            const html = await res.text();
            const match = html.match(/["']file["']\s*:\s*["']([^"']+)["']/i);
            if (match && match[1]) return match[1].replace(/\\/g, "");
          } catch (e) {}
        }
      }

      // MP4UPLOAD
      if (urlLower.includes("mp4upload.com")) {
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            Referer: url,
          },
        });
        const html = await res.text();
        const match =
          html.match(/player\.src\(\{\s*src:\s*["']([^"']+)["']/i) ||
          html.match(/src:\s*["']([^"']+\.mp4)["']/i);
        if (match && match[1]) return match[1];
      }

      // STREAMTAPE
      if (urlLower.includes("streamtape.com")) {
        const res = await fetch(url);
        const html = await res.text();
        const match =
          html.match(
            /document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*['"]([^'"]+)['"]\s*\+\s*\(['"]([^'"]+)['"]/i,
          ) ||
          html.match(
            /robotlink'\)\.innerHTML\s*=\s*['"]([^'"]+)['"]\s*\+\s*\(['"]([^'"]+)['"]/i,
          );
        if (match && match[1] && match[2]) {
          const token = match[1] + match[2].substring(3);
          return `https:${token}`;
        }
      }

      // DESUSTREAM / DESUDRIVES (Otakudesu)
      if (
        urlLower.includes("desustream") ||
        urlLower.includes("desudrives") ||
        urlLower.includes("desu-stream")
      ) {
        const fetchUrl = url.includes("?")
          ? `${url}&mode=json`
          : `${url}?mode=json`;
        const res = await fetch(fetchUrl);
        const resClone = res.clone();
        try {
          const json: any = await res.json();
          if (json.ok && json.video) {
            return await VideoExtractor.extract(
              json.video.replace(/&amp;/g, "&"),
            );
          }
        } catch (e) {
          const html = await resClone.text();
          // Match <source src="..."> or var player = { file: "..." }
          const sourceMatch =
            html.match(/<source[^>]+src=["']([^"']+)["']/i) ||
            html.match(/file\s*:\s*["']([^"']+)["']/i) ||
            html.match(/urlPlay\s*=\s*["']([^"']+)["']/i);

          if (sourceMatch) return sourceMatch[1].replace(/&amp;/g, "&");
        }
      }

      // KRAKENFILES
      if (urlLower.includes("krakenfiles.com")) {
        const res = await fetch(url);
        const html = await res.text();
        const tokenMatch =
          html.match(/var\s+token\s*=\s*["']([^"']+)["']/i) ||
          html.match(/name="token"\s+value=["']([^"']+)["']/i);
        const formMatch =
          html.match(
            /url:\s*["'](\/\/krakenfiles.com\/download\/[^"']+)["']/i,
          ) ||
          html.match(/action=["'](\/\/krakenfiles.com\/download\/[^"']+)["']/i);
        if (tokenMatch && formMatch) {
          const dlUrl = `https:${formMatch[1]}`;
          const res2 = await fetch(dlUrl, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `token=${tokenMatch[1]}`,
          });
          const json: any = await res2.json();
          if (json.status === "ok" && json.url) return json.url;
        }
      }

      // UNIVERSAL FALLBACK (Try to find any raw media link in the page)
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          Referer: url,
        },
      });
      const html = await res.text();
      const universalMatch =
        html.match(/<source[^>]+src=["']([^"']+)["']/i) ||
        html.match(/["']url["']\s*:\s*["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/i) ||
        html.match(/file\s*:\s*["']([^"']+\.(?:mp4|m3u8)[^"']*)["']/i);

      if (universalMatch)
        return universalMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
    } catch (e) {
      console.error(`[VideoExtractor] Extraction failed for ${url}:`, e);
    }

    return url; // Fallback to original url
  }
}
