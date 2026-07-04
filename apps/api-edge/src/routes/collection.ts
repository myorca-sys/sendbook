import { Hono } from "hono";
import { CollectionService } from "../services/collection.service";
import { MediaService } from "../services/media.service";

const collectionRouter = new Hono<{ Bindings: { DATABASE_URL: string } }>();

collectionRouter.get("/", async (c) => {
  const userId = c.req.query("user_id");
  if (!userId) return c.json({ error: "Missing user_id" }, 400);

  try {
    const rows = await CollectionService.getUserCollections(c.env, userId);
    return c.json(rows);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

collectionRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();
    await CollectionService.ensureUser(c.env, body.user_id);

    let targetMediaId = null;
    if (body.title && body.img && !isNaN(Number(body.anilistId))) {
      targetMediaId = await MediaService.upsertMetadata(c.env, {
        type: body.mediaType === "manga" ? "MANGA" : "ANIME",
        title: body.title,
        img: body.img,
        anilistId: Number(body.anilistId),
      });
    }

    if (!targetMediaId) {
      return c.json({ error: "Could not resolve media_id for collection" }, 400);
    }

    await CollectionService.updateCollection(c.env, {
      userId: body.user_id,
      mediaId: targetMediaId,
      status: body.status,
      progress: body.progress,
    });

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

collectionRouter.delete("/", async (c) => {
  const userId = c.req.query("user_id");
  const anilistId = c.req.query("anilistId");
  if (!userId || !anilistId) return c.json({ error: "Missing params" }, 400);

  try {
    const anilistIdNum = Number(anilistId);
    if (isNaN(anilistIdNum)) return c.json({ error: "Invalid anilistId" }, 400);

    const targetMediaId = await MediaService.resolveMediaId(c.env, anilistIdNum);
    if (targetMediaId) {
      await CollectionService.deleteCollection(c.env, userId, targetMediaId);
    }
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default collectionRouter;
