import { getDb } from "../db/db";
import { mediaMetadata, mediaExternalIds, mediaContent } from "../db/polymorphic_schema";
import { sql, eq, and } from "drizzle-orm";
import { Redis } from "@upstash/redis/cloudflare";

export class MediaService {
  static async getMediaByAnilistId(env: any, id: number, type: "ANIME" | "MANGA") {
    const db = getDb(env);
    const result = await db.execute(sql`
      SELECT m.*, m.title_main as "title_romaji", m.description as "synopsis", ex.anilist_id as "anilistId" 
      FROM ${mediaMetadata} m 
      JOIN ${mediaExternalIds} ex ON m.id = ex.media_id 
      WHERE ex.anilist_id = ${id} AND m.media_type = ${type}
    `);
    return result[0] || null;
  }

  static async getMediaContent(env: any, mediaId: string, contentType: "EPISODE" | "CHAPTER") {
    const db = getDb(env);
    const cols =
      contentType === "EPISODE"
        ? sql.raw('number as "episodeNumber", title as "episodeTitle", url as "episodeUrl"')
        : sql.raw('number as "chapterNumber", title as "chapterTitle", url as "chapterUrl"');

    return await db.execute(sql`
      SELECT DISTINCT ON (number) ${cols}, thumbnail as "thumbnailUrl"
      FROM ${mediaContent}
      WHERE media_id = ${mediaId} AND content_type = ${contentType}
      ORDER BY number DESC, created_at DESC
    `);
  }
  static async resolveMediaId(env: any, anilistId: number): Promise<string | null> {
    const db = getDb(env);
    const result = await db.execute(
      sql`SELECT media_id FROM ${mediaExternalIds} WHERE anilist_id = ${anilistId} LIMIT 1`,
    );
    return (result[0]?.media_id as string) || null;
  }

  static async upsertMetadata(
    env: any,
    data: {
      id?: string;
      type: "ANIME" | "MANGA";
      title: string;
      img: string;
      anilistId: number;
    },
  ) {
    const db = getDb(env);
    let targetMediaId = data.id;

    if (!targetMediaId) {
      const existingId = await this.resolveMediaId(env, data.anilistId);
      if (!existingId) {
        const newMedia = await db.execute(sql`
          WITH new_media AS (
            INSERT INTO ${mediaMetadata} (id, media_type, title_main, cover_image, updated_at)
            VALUES (gen_random_uuid(), ${data.type}, ${data.title}, ${data.img}, NOW())
            RETURNING id
          )
          INSERT INTO ${mediaExternalIds} (media_id, anilist_id)
          SELECT id, ${data.anilistId} FROM new_media
          RETURNING media_id
        `);
        targetMediaId = newMedia[0]?.media_id as string;
      } else {
        targetMediaId = existingId as string;
        await db.execute(sql`
          UPDATE ${mediaMetadata}
          SET title_main = ${data.title}, cover_image = ${data.img}, updated_at = NOW()
          WHERE id = ${targetMediaId}
        `);
      }

      // Automated Cache Invalidation (Redis Sweeper)
      try {
        const redis = new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        });
        const cacheKey = `${data.type.toLowerCase()}:v2:${data.anilistId}`;
        await redis.del(cacheKey);
        console.log(`[Redis Sweeper] Cache cleared for key: ${cacheKey}`);
      } catch (redisErr) {
        console.error("[Redis Sweeper] Failed to invalidate cache:", redisErr);
      }
    }
    return targetMediaId;
  }
}
