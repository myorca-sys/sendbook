import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { getDb } from "../db/db";
import { stores } from "../db/schema";
import { getAuth } from "../auth";

const router = new Hono<{ Bindings: any }>();

router.post("/", async (c) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.ownerId, session.user.id)).limit(1);
  if (!store) return c.json({ error: "Store not found" }, 404);

  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return c.json({ error: "No file provided" }, 400);

  if (file.size > 5 * 1024 * 1024) return c.json({ error: "File too large (max 5MB)" }, 400);
  if (!file.type.startsWith("image/")) return c.json({ error: "Only images allowed" }, 400);

  const buffer = await file.arrayBuffer();
  const key = `stores/${store.id}/${Date.now()}-${file.name}`;

  await c.env.SENDBOOK_ASSETS.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  return c.json({ success: true, data: { key } }, 201);
});

export default router;
