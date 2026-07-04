import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq, and, sql, gte } from "drizzle-orm";
import { getDb } from "../db/db";
import { stores, analyticsEvents } from "../db/schema";
import { getAuth } from "../auth";

const router = new Hono<{ Bindings: any }>();

async function requireStore(c: any) {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;
  const db = getDb(c.env);
  const [store] = await db.select().from(stores).where(eq(stores.ownerId, session.user.id)).limit(1);
  return store || null;
}

router.get("/summary", async (c) => {
  const store = await requireStore(c);
  if (!store) return c.json({ error: "Forbidden" }, 403);

  const db = getDb(c.env);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [[visits], [todayVisits], [clicks], [todayClicks]] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
      .where(and(eq(analyticsEvents.storeId, store.id), eq(analyticsEvents.type, "visit"))),
    db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
      .where(and(eq(analyticsEvents.storeId, store.id), eq(analyticsEvents.type, "visit"), gte(analyticsEvents.createdAt, today))),
    db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
      .where(and(eq(analyticsEvents.storeId, store.id), eq(analyticsEvents.type, "whatsapp_click"))),
    db.select({ count: sql<number>`count(*)` }).from(analyticsEvents)
      .where(and(eq(analyticsEvents.storeId, store.id), eq(analyticsEvents.type, "whatsapp_click"), gte(analyticsEvents.createdAt, today))),
  ]);

  const topProducts = await db.select({
    id: analyticsEvents.productId,
    count: sql<number>`count(*)`,
  }).from(analyticsEvents)
    .where(and(eq(analyticsEvents.storeId, store.id), eq(analyticsEvents.type, "visit")))
    .groupBy(analyticsEvents.productId)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  return c.json({
    success: true,
    data: {
      totalVisits: Number(visits.count),
      todayVisits: Number(todayVisits.count),
      totalWhatsappClicks: Number(clicks.count),
      todayWhatsappClicks: Number(todayClicks.count),
      topProducts,
    },
  });
});

const trackSchema = z.object({
  storeId: z.string(),
  type: z.enum(["visit", "whatsapp_click"]),
  productId: z.string().optional(),
});

router.post("/track", zValidator("json", trackSchema), async (c) => {
  const db = getDb(c.env);
  const body = c.req.valid("json");

  const ip = c.req.header("cf-connecting-ip") || "";
  const ipHash = ip ? sql`encode(sha256(${ip}::bytea), 'hex')` : null;

  await db.insert(analyticsEvents).values({
    storeId: body.storeId,
    type: body.type,
    productId: body.productId,
    ipHash: ipHash as any,
    userAgent: c.req.header("user-agent") || "",
  });

  return c.json({ success: true });
});

export default router;
