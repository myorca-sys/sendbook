import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { getDb } from "../db/db";
import { stores, products } from "../db/schema";
import { getAuth } from "../auth";

const router = new Hono<{ Bindings: any }>();

async function requireStoreOwner(c: any) {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;

  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.ownerId, session.user.id)).limit(1);
  if (!store) return null;
  return store;
}

const productSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().int().min(0),
  description: z.string().max(1000).optional(),
  images: z.array(z.string()).optional(),
  category: z.string().optional(),
  isAvailable: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

router.post("/", zValidator("json", productSchema), async (c) => {
  const store = await requireStoreOwner(c);
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  const body = c.req.valid("json");
  const [product] = await db.insert(products).values({ storeId: store.id, ...body }).returning();

  return c.json({ success: true, data: product }, 201);
});

router.put("/:id", zValidator("json", productSchema.partial()), async (c) => {
  const store = await requireStoreOwner(c);
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  const [product] = await db.select().from(products).where(eq(products.id, c.req.param("id"))).limit(1);
  if (!product || product.storeId !== store.id) return c.json({ error: "Not found" }, 404);

  const body = c.req.valid("json");
  const [updated] = await db.update(products).set({ ...body, updatedAt: new Date() })
    .where(eq(products.id, product.id)).returning();

  return c.json({ success: true, data: updated });
});

router.delete("/:id", async (c) => {
  const store = await requireStoreOwner(c);
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  const [product] = await db.select().from(products).where(eq(products.id, c.req.param("id"))).limit(1);
  if (!product || product.storeId !== store.id) return c.json({ error: "Not found" }, 404);

  await db.delete(products).where(eq(products.id, product.id));
  return c.json({ success: true });
});

export default router;
