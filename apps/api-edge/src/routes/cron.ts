import { Hono } from "hono";
import { SERVER_DOMAINS } from "@shared/config/domains";
import { getDb } from "../db/db";
import { mediaMetadata, mediaExternalIds } from "../db/polymorphic_schema";
import { sql } from "drizzle-orm";

const app = new Hono<{
  Bindings: {
    RUST_API_URL: string;
    QSTASH_TOKEN: string;
    WORKER_PUBLIC_URL: string;
    DATABASE_URL: string;
  };
}>();

app.get("/sync-ongoing", async (c) => {
  const rustApiUrl =
    c.env.RUST_API_URL || SERVER_DOMAINS.rustApi;
  const qstashToken = c.env.QSTASH_TOKEN;
  const publicUrl =
    c.env.WORKER_PUBLIC_URL ||
    SERVER_DOMAINS.edgeApi;

  if (!qstashToken) {
    return c.json(
      { success: false, error: "QSTASH_TOKEN not configured" },
      500,
    );
  }

  try {
    // 1. Get ongoing IDs from Rust
    const res = await fetch(`${rustApiUrl}/api/v1/internal/ongoing_ids`);
    const data: any = await res.json();

    if (!data.success || !data.ids) {
      return c.json(
        { success: false, error: "Failed to fetch IDs from Rust" },
        500,
      );
    }

    const ids: number[] = data.ids;
    console.log(`[Cron] Found ${ids.length} ongoing anime to sync.`);

    // 2. Dispatch to QStash for each ID
    // Note: We use QStash to distribute load so we don't hit HF Space timeout or rate limits
    const dispatchPromises = ids.map((id, index) => {
      const delay = `${index * 5}s`; // Stagger requests by 5 seconds
      return fetch(
        `https://qstash.upstash.io/v2/publish/${publicUrl}/api/v2/internal/sync/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${qstashToken}`,
            "Upstash-Delay": delay,
            "Upstash-Retries": "3",
          },
        },
      );
    });

    await Promise.allSettled(dispatchPromises);

    return c.json({
      success: true,
      count: ids.length,
      message: "Sync tasks dispatched to QStash",
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.get("/sync-missing-metadata", async (c) => {
  const qstashToken = c.env.QSTASH_TOKEN;
  const publicUrl = c.env.WORKER_PUBLIC_URL || SERVER_DOMAINS.edgeApi;

  if (!qstashToken) {
    return c.json(
      { success: false, error: "QSTASH_TOKEN not configured" },
      500,
    );
  }

  try {
    const db = getDb(c.env);
    // Kueri database untuk mencari data dengan cover_image null ATAU title_english null
    const rows = await db.execute(sql`
      SELECT ex.anilist_id as "anilistId"
      FROM ${mediaMetadata} m
      JOIN ${mediaExternalIds} ex ON m.id = ex.media_id
      WHERE m.media_type = 'ANIME' AND (m.cover_image IS NULL OR m.title_english IS NULL)
    `);

    const ids = rows
      .map((r: any) => r.anilistId)
      .filter((id) => id !== null && !isNaN(Number(id))) as number[];

    console.log(`[Cron] Found ${ids.length} anime with missing metadata to sync.`);

    if (ids.length === 0) {
      return c.json({
        success: true,
        count: 0,
        message: "No anime with missing metadata found",
      });
    }

    // Kirim task sinkronisasi ke QStash dengan stagger delay 5 detik
    const dispatchPromises = ids.map((id, index) => {
      const delay = `${index * 5}s`;
      return fetch(
        `https://qstash.upstash.io/v2/publish/${publicUrl}/api/v2/internal/sync/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${qstashToken}`,
            "Upstash-Delay": delay,
            "Upstash-Retries": "3",
          },
        },
      );
    });

    await Promise.allSettled(dispatchPromises);

    return c.json({
      success: true,
      count: ids.length,
      message: "Missing metadata sync tasks dispatched to QStash",
      ids,
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default app;
