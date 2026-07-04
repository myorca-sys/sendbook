import { Hono } from "hono";
import { DreasEdgeEngine } from "../services/dreas/engine";
import { dreas } from "../schemas/dreas_pb";
import { ANIME_DOMAINS } from "@shared/config/domains";
import { sql } from "drizzle-orm";

type Bindings = {
  SCRAPER_RULES_KV: any;
};

const edgeScraperRouter = new Hono<{ Bindings: Bindings }>();

// Proxy endpoint for Kuronime source resolution.
// animeku.org blocks Cloudflare Workers egress (CF WAF error 1106).
// Delegates to api-rust on Hugging Face (non-CF egress) to bypass the block.
edgeScraperRouter.post("/kuronime-sources", async (c) => {
  try {
    const { reqId } = await c.req.json();
    if (!reqId) {
      return c.json({ success: false, error: "Missing reqId" }, 400);
    }

    const rustApiUrl = (c.env as any).RUST_API_URL || "https://orcanime-orcanime-api-rust.hf.space";
    const targetApi = `${rustApiUrl}/api/v1/kuronime-sources`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(targetApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reqId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await res.json();
      return c.json(data);
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      return c.json({ success: false, error: `Fetch error via Rust proxy: ${fetchErr.message}` }, 500);
    }
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Swarm Contribution Endpoint (Receives raw HTML from mobile clients)
edgeScraperRouter.post("/swarm", async (c) => {
  try {
    const { provider, endpoint, html, url, extraData, videoSources } = await c.req.json();

    if (!provider || !endpoint || (!html && !videoSources)) {
      return c.json(
        { success: false, error: "Missing provider, endpoint, or payload" },
        400,
      );
    }

    // Fast path: WebView extracted video sources directly from rendered DOM
    if (videoSources && Array.isArray(videoSources) && videoSources.length > 0) {
      const urlHash = url ? btoa(url).replace(/[^a-zA-Z0-9]/g, "") : "default";
      const cacheKey = `swarm_${provider}_${endpoint}_${urlHash}`;
      await c.env.SCRAPER_RULES_KV.put(cacheKey, JSON.stringify(videoSources), { expirationTtl: 900 });
      console.log(`[Swarm] Direct videoSources cached for ${provider}/${endpoint}: ${videoSources.length} items`);
      return c.json({ success: true, message: "Direct video sources cached", extracted_items: videoSources.length });
    }

    // 1. Fetch Rules
    const rulesStr = await c.env.SCRAPER_RULES_KV.get(`rule_${provider}`);
    if (!rulesStr) return c.json({ success: false, error: "Rules not found" }, 404);

    const manifestJson = JSON.parse(rulesStr);
    const manifest = dreas.DREASManifest.fromObject(manifestJson);

    // 2. Validate HTML by parsing it
    let data;
    if (extraData) {
      data = [{ req_id: "prefetched", __kuronime_prefetched: extraData }];
    } else {
      data = await DreasEdgeEngine.execute(manifest, endpoint, html);
    }

    if (data.length === 0) {
      return c.json(
        {
          success: false,
          error: "Parsed data is empty. Anti-bot block or invalid HTML.",
        },
        400,
      );
    }

    // Ingest episode ke database fisik secara permanen (Self-Healing DB fisik)
    if (url && endpoint === "video_sources") {
      try {
        const epMatch = url.match(/-episode-(\d+)/);
        if (epMatch) {
          const epNum = parseFloat(epMatch[1]);
          if (!isNaN(epNum)) {
            const urlObj = new URL(url);
            const path = urlObj.pathname.replace(/^\/|\/$/g, ""); // "one-piece-episode-927"
            
            // Bersihkan suffix episode untuk mendapatkan slug anime
            let animeSlug = path.replace(new RegExp(`-episode-${epMatch[1]}`), "");
            if (provider === "kuronime") {
              animeSlug = animeSlug.replace(/-sub-indo$/, "");
            }

            const { getDb } = await import("../db/db");
            const db = getDb(c.env as any);
            
            // Cari media_id dari mappings
            const mappingResult = await db.execute(sql`
              SELECT media_id FROM media_mappings
              WHERE provider_id = ${provider} AND provider_content_id = ${animeSlug}
              LIMIT 1
            `);
            const mediaId = mappingResult[0]?.media_id;

            if (mediaId) {
              const formattedTitle = `${animeSlug.replace(/-/g, " ").toUpperCase()} Episode ${epNum}`;
              await db.execute(sql`
                INSERT INTO media_content (media_id, provider_id, content_type, number, title, url, created_at)
                VALUES (${mediaId as string}, ${provider}, 'EPISODE', ${epNum}, ${formattedTitle}, ${url}, NOW())
                ON CONFLICT (media_id, provider_id, content_type, number)
                DO UPDATE SET url = EXCLUDED.url, title = EXCLUDED.title, created_at = NOW()
              `);
              console.log(`[Swarm DB Ingestion] Successfully healed and ingested episode ${epNum} for media ${mediaId} in DB.`);
            }
          }
        }
      } catch (dbErr: any) {
        console.error("[Swarm DB Ingestion] Failed to ingest physical episode:", dbErr.message);
      }
    }

    // 3. Cache the successful result for 15 minutes (900 seconds)
    const urlHash = url ? btoa(url).replace(/[^a-zA-Z0-9]/g, "") : "default";
    const cacheKey = `swarm_${provider}_${endpoint}_${urlHash}`;
    await c.env.SCRAPER_RULES_KV.put(cacheKey, JSON.stringify(data), {
      expirationTtl: 900,
    });

    return c.json({
      success: true,
      message: "Swarm contribution accepted and processed",
      extracted_items: data.length,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Main Endpoint (Serves data to mobile clients)
edgeScraperRouter.get("/:provider/:endpoint", async (c) => {
  const provider = c.req.param("provider");
  const endpoint = c.req.param("endpoint");

  const providerUrls: Record<string, string> = {
    samehadaku: ANIME_DOMAINS.samehadaku,
    kuronime: ANIME_DOMAINS.kuronime,
  };

  const targetUrl = c.req.query("url") || providerUrls[provider];
  if (!targetUrl) return c.json({ success: false, error: "Target URL missing" }, 400);

  const startTime = Date.now();

  // Special case: kuronime/video_sources MUST be rendered in WebView
  // because animeku.js populates the player dynamically — static scrape only returns an ads token.
  // Check cache first; if miss, immediately trigger Swarm WebView resolution.
  if (provider === "kuronime" && endpoint === "video_sources") {
    const urlHash = targetUrl ? btoa(targetUrl).replace(/[^a-zA-Z0-9]/g, "") : "default";
    const cacheKey = `swarm_${provider}_${endpoint}_${urlHash}`;
    const cachedData = await c.env.SCRAPER_RULES_KV.get(cacheKey);
    if (cachedData) {
      return c.json({
        success: true,
        meta: { environment: "Cloudflare Edge (Swarm Cache)", target_url: targetUrl, from_cache: true },
        data: JSON.parse(cachedData),
      });
    }
    return c.json({
      success: false,
      need_swarm: true,
      meta: { target_url: targetUrl },
      error: "Kuronime video_sources requires WebView rendering. Triggering SwarmResolver.",
    }, 403);
  }

  try {
    const urlHash = targetUrl ? btoa(targetUrl).replace(/[^a-zA-Z0-9]/g, "") : "default";
    const cacheKey = `swarm_${provider}_${endpoint}_${urlHash}`;

    // 1. Check Swarm Cache First (O(1) Resolution)
    const cachedData = await c.env.SCRAPER_RULES_KV.get(cacheKey);

    if (cachedData) {
      return c.json({
        success: true,
        meta: {
          environment: "Cloudflare Edge (Swarm Cache)",
          target_url: targetUrl,
          total_latency_ms: Date.now() - startTime,
          from_cache: true,
        },
        data: JSON.parse(cachedData),
      });
    }

    // 2. No Cache -> Get Rules
    const rulesStr = await c.env.SCRAPER_RULES_KV.get(`rule_${provider}`);
    if (!rulesStr) return c.json({ success: false, error: `Rules not found` }, 404);

    const manifestJson = JSON.parse(rulesStr);
    const manifest = dreas.DREASManifest.fromObject(manifestJson);

    // 3. Attempt Raw HTTP Fetch at Edge (Will fail on Turnstile)
    const fetchStart = Date.now();
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/html",
      },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const fetchTime = Date.now() - fetchStart;

    // 4. Parse
    const parseStart = Date.now();
    const data = await DreasEdgeEngine.execute(manifest, endpoint, html);
    const parseTime = Date.now() - parseStart;

    // 5. Detect Anti-Bot failure
    if (data.length === 0) {
      return c.json(
        {
          success: false,
          need_swarm: true, // TRIGGER SIGNAL FOR MOBILE
          error: "Data empty. Cloudflare Turnstile detected. Please initiate Swarm Request.",
        },
        403,
      );
    }

    // 6. Success -> Cache it so others don't have to fetch
    await c.env.SCRAPER_RULES_KV.put(cacheKey, JSON.stringify(data), {
      expirationTtl: 900,
    });

    return c.json({
      success: true,
      meta: {
        environment: "Cloudflare Edge (Direct Fetch)",
        target_url: targetUrl,
        fetch_latency_ms: fetchTime,
        parse_latency_ms: parseTime,
        total_latency_ms: Date.now() - startTime,
        from_cache: false,
      },
      data,
    });
  } catch (err: any) {
    return c.json({ success: false, need_swarm: true, error: err.message }, 500);
  }
});

export default edgeScraperRouter;
