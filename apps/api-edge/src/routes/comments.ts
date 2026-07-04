import { Hono } from "hono";
import { getDb } from "../db/db";
import { sql } from "drizzle-orm";

const commentsRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

commentsRouter.get("/", async (c) => {
  const anilistId = c.req.query("anilistId");
  const episodeNumber = c.req.query("episodeNumber");

  if (!anilistId || !episodeNumber)
    return c.json({ error: "Missing params" }, 400);

  const db = getDb(c.env);

  try {
    const query = sql`
        SELECT c.id, c.text, c.timestamp_sec as timestamp, c.created_at,
               c.parent_id,
               u.id as user_id, u.name as user_name, u.image as user_image,
               (SELECT json_agg(json_build_object('emoji', r.emoji, 'count', r.count))
                FROM (SELECT emoji, COUNT(*) as count FROM comment_reactions WHERE comment_id = c.id GROUP BY emoji) r
               ) as reactions
        FROM comments c
        JOIN "user" u ON c.user_id = u.id
        WHERE c."anilistId" = ${anilistId} AND c."episodeNumber" = ${episodeNumber}
        ORDER BY c.created_at DESC
    `;
    const rows = await db.execute(query);

    // Group into threads
    const commentsMap = new Map();
    const threads: any[] = [];

    for (const row of rows) {
      row.replies = [];
      commentsMap.set(row.id, row);
    }

    for (const row of rows) {
      if (row.parent_id && commentsMap.has(row.parent_id)) {
        commentsMap.get(row.parent_id).replies.push(row);
      } else {
        threads.push(row);
      }
    }

    return c.json(threads);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

commentsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const db = getDb(c.env);

    await db.execute(sql`
      INSERT INTO comments (user_id, "anilistId", "episodeNumber", text, timestamp_sec, parent_id, created_at)
      VALUES (${body.user_id}, ${body.anilistId}, ${body.episodeNumber}, ${body.text}, ${body.timestamp || null}, ${body.parent_id || null}, NOW())
    `);

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

commentsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const userId = c.req.query("user_id");
  if (!id || !userId) return c.json({ error: "Missing params" }, 400);

  const db = getDb(c.env);
  try {
    await db.execute(sql`
      DELETE FROM comments WHERE id = ${id} AND user_id = ${userId}
    `);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

commentsRouter.post("/reaction", async (c) => {
  try {
    const body = await c.req.json();
    const db = getDb(c.env);

    await db.execute(sql`
      INSERT INTO comment_reactions (comment_id, user_id, emoji, created_at)
      VALUES (${body.comment_id}, ${body.user_id}, ${body.emoji}, NOW())
      ON CONFLICT (comment_id, user_id, emoji) 
      DO DELETE
    `);

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default commentsRouter;
