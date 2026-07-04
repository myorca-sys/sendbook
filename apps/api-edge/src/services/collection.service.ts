import { getDb } from "../db/db";
import { collections, user } from "../db/schema";
import { mediaMetadata, mediaExternalIds } from "../db/polymorphic_schema";
import { sql, eq, and } from "drizzle-orm";

export class CollectionService {
  static async getUserCollections(env: any, userId: string) {
    const db = getDb(env);
    return await db.execute(sql`
        SELECT c.*,
               ex.anilist_id as "anilistId",
               md.cover_image as "coverImage",
               md.title_main as "cleanTitle",
               md.title_native as "nativeTitle",
               md.media_type as "mediaType",
               (SELECT COUNT(DISTINCT mc.number) FROM media_content mc WHERE mc.media_id = md.id) as "totalEps",
               (SELECT MAX(number) FROM media_content mc WHERE mc.media_id = md.id) as "latestEpisode"
        FROM ${collections} c
        LEFT JOIN ${mediaMetadata} md ON c.media_id = md.id
        LEFT JOIN ${mediaExternalIds} ex ON md.id = ex.media_id
        WHERE c."userId" = ${userId}
        ORDER BY c."updatedAt" DESC
    `);
  }

  static async updateCollection(
    env: any,
    data: {
      userId: string;
      mediaId: string;
      status?: string;
      progress?: number;
    },
  ) {
    const db = getDb(env);
    const status = data.status || "plan_to_watch";
    const progress = data.progress || 0;

    return await db.execute(sql`
      INSERT INTO ${collections} ("userId", "media_id", status, progress, "updatedAt")
      VALUES (${data.userId}, ${data.mediaId}, ${status}, ${progress}, NOW())
      ON CONFLICT ("userId", "media_id") 
      DO UPDATE SET status = EXCLUDED.status, progress = EXCLUDED.progress, "updatedAt" = NOW()
    `);
  }

  static async deleteCollection(env: any, userId: string, mediaId: string) {
    const db = getDb(env);
    return await db.execute(sql`
      DELETE FROM ${collections} WHERE "userId" = ${userId} AND "media_id" = ${mediaId}
    `);
  }

  static async ensureUser(env: any, userId: string) {
    const db = getDb(env);
    return await db.execute(sql`
      INSERT INTO ${user} (id, name, email, "emailVerified", "createdAt", "updatedAt")
      VALUES (${userId}, 'User ' || left(${userId}, 5), ${userId} || '@orca.local', false, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `);
  }
}
