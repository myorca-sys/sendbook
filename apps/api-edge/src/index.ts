import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./auth";
import anilistRouter from "./routes/anilist";
import v2Router from "./routes/v2";
import triviaRouter from "./routes/trivia";
import dreasRouter from "./routes/dreas";
import edgeScraperRouter from "./routes/edge_scraper";
import cronRouter from "./routes/cron";
import scheduleRouter from "./routes/schedule";

type Bindings = {
  AI: any;
  HYPERDRIVE: any;
  SCRAPER_RULES_KV: any;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:8081",
      "https://orcanime.pages.dev",
      "https://orcanime-admin.pages.dev",
      "*",
    ], // Adjust as needed
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "x-admin-key"],
    credentials: true,
  }),
);

// Mount Better-Auth
app.all("/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

// Simple debug route
app.post("/api/debug/fix_opm", async (c) => {
  try {
    const { getDb } = await import("./db/db");
    const { mediaExternalIds, mediaMappings, mediaContent, mediaMetadata } = await import("./db/polymorphic_schema");
    const { inArray, eq } = await import("drizzle-orm");
    const db = getDb(c.env);
    
    const externals = await db.select({ mediaId: mediaExternalIds.mediaId }).from(mediaExternalIds).where(
        eq(mediaExternalIds.anilistId, 21087)
    );
    // Kita pastikan tidak ada undefined
    const mediaIds = externals.map(e => e.mediaId).filter(id => id !== null) as string[];
    
    if (mediaIds.length > 0) {
        await db.delete(mediaMappings).where(inArray(mediaMappings.mediaId, mediaIds));
        await db.delete(mediaContent).where(inArray(mediaContent.mediaId, mediaIds));
        
        const toDelete = mediaIds.slice(1);
        if (toDelete.length > 0) {
            await db.delete(mediaMetadata).where(inArray(mediaMetadata.id, toDelete));
        }
    }
    
    return c.json({ success: true, message: "OPM 21087 cleared cleanly.", affectedIds: mediaIds.length });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

// Mount Routes
app.route("/api/anilist", anilistRouter);
app.route("/api/v2/dreas", dreasRouter);
app.route("/api/v2", v2Router);
app.route("/api/trivia", triviaRouter);
app.route("/api/edge-scrape", edgeScraperRouter);
app.route("/api/cron", cronRouter);
app.route("/api/v1/schedule", scheduleRouter);

export default {
  fetch: app.fetch,
  async scheduled(event: any, env: Bindings, ctx: any) {
    const rustApiUrl = env.RUST_API_URL || "https://orcanime-orcanime-api-rust.hf.space";
    const qstashToken = env.BETTER_AUTH_SECRET || env.GOOGLE_CLIENT_SECRET || ""; // fallback if missing, QStash token is needed
    // Actually env.QSTASH_TOKEN is in bindings, let's cast as any to get it securely
    const token = (env as any).QSTASH_TOKEN;
    const publicUrl = env.WORKER_PUBLIC_URL || "https://orcanime-api-edge.moehamadhkl.workers.dev";

    if (!token) {
      console.error("[Cron Trigger] QSTASH_TOKEN not found in environment.");
      return;
    }

    try {
      console.log("[Cron Trigger] Fetching ongoing IDs from Rust API...");
      const res = await fetch(`${rustApiUrl}/api/v1/internal/ongoing_ids`);
      const data: any = await res.json();

      if (!data.success || !data.ids) {
        console.error("[Cron Trigger] Failed to fetch ongoing IDs from Rust API.");
        return;
      }

      const ids: number[] = data.ids;
      console.log(`[Cron Trigger] Found ${ids.length} ongoing IDs. Dispatching to QStash...`);

      const dispatchPromises = ids.map((id, index) => {
        const delay = `${index * 5}s`;
        return fetch(
          `https://qstash.upstash.io/v2/publish/${publicUrl}/api/v2/internal/sync/${id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Upstash-Delay": delay,
              "Upstash-Retries": "3",
            },
          }
        );
      });

      await Promise.allSettled(dispatchPromises);
      console.log("[Cron Trigger] All tasks successfully dispatched.");
    } catch (e: any) {
      console.error("[Cron Trigger Error]", e.message);
    }
  }
};
