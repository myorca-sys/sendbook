import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { getDb } from "../db/db";
import { stores, products } from "../db/schema";
import { getAuth } from "../auth";

const router = new Hono<{ Bindings: any }>();

const createStoreSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/),
  whatsapp: z.string().min(1),
  description: z.string().max(500).optional(),
  address: z.string().optional(),
  mapsUrl: z.string().optional(),
});

const updateStoreSchema = createStoreSchema.partial();

async function requireAuth(c: any) {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;
  return session;
}

async function requireStoreOwner(c: any, storeId: string) {
  const session = await requireAuth(c);
  if (!session) return null;
  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.id, storeId)).limit(1);
  if (!store || store.ownerId !== session.user.id) return null;
  return store;
}

router.post("/", zValidator("json", createStoreSchema), async (c) => {
  const session = await requireAuth(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb(c.env);
  const body = c.req.valid("json");

  const existing = await db.select().from(stores).where(eq(stores.slug, body.slug)).limit(1);
  if (existing.length > 0) return c.json({ error: "Slug already taken" }, 409);

  const [store] = await db.insert(stores).values({
    ownerId: session.user.id,
    ...body,
  }).returning();

  return c.json({ success: true, data: store }, 201);
});

router.get("/me", async (c) => {
  const session = await requireAuth(c);
  if (!session) return c.json({ error: "Unauthorized" }, 401);

  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.ownerId, session.user.id)).limit(1);
  if (!store) return c.json({ error: "Store not found" }, 404);

  return c.json({ success: true, data: store });
});

router.get("/:slug", async (c) => {
  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.slug, c.req.param("slug"))).limit(1);
  if (!store) return c.json({ error: "Store not found" }, 404);

  const allProducts = await db.select().from(products)
    .where(eq(products.storeId, store.id))
    .orderBy(products.sortOrder);

  return c.json({ success: true, data: { ...store, products: allProducts } });
});

router.put("/:id", zValidator("json", updateStoreSchema), async (c) => {
  const store = await requireStoreOwner(c, c.req.param("id"));
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  const body = c.req.valid("json");
  const [updated] = await db.update(stores).set({ ...body, updatedAt: new Date() })
    .where(eq(stores.id, store.id)).returning();

  return c.json({ success: true, data: updated });
});

router.delete("/:id", async (c) => {
  const store = await requireStoreOwner(c, c.req.param("id"));
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  await db.delete(stores).where(eq(stores.id, store.id));
  return c.json({ success: true });
});

export default router;
