import { Hono } from "hono"
import { cors } from "hono/cors"
import { handle } from "hono/cloudflare-pages"
import { z } from "zod"
import postgres from "postgres"

type Env = {
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
  SENDBOOK_ASSETS: R2Bucket
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Env }>()

app.use("*", cors({
  origin: ["http://localhost:8081", "http://localhost:3000", "https://sendbook.pages.dev"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

function getSql(env: Env) {
  return postgres(env.DATABASE_URL, { prepare: false, max: 2, idle_timeout: 30 })
}

app.get("/api/health", (c) => c.json({ status: "ok", service: "sendbook" }))

const createStoreSchema = z.object({
  slug: z.string().min(2).max(30).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  whatsapp: z.string().min(8).max(20),
  address: z.string().max(300).optional(),
  maps_url: z.string().url().optional(),
})

app.post("/api/stores", async (c) => {
  const body = await c.req.json()
  const parsed = createStoreSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)
  const sql = getSql(c.env)
  try {
    const [store] = await sql`
      INSERT INTO stores (owner_id, slug, name, description, whatsapp, address, maps_url)
      VALUES (${c.req.header("x-user-id") || "anonymous"}, ${parsed.data.slug}, ${parsed.data.name}, ${parsed.data.description || null}, ${parsed.data.whatsapp}, ${parsed.data.address || null}, ${parsed.data.maps_url || null})
      RETURNING *
    `
    return c.json(store, 201)
  } catch (e: any) {
    if (e?.code === "23505") return c.json({ error: "Slug already taken" }, 409)
    return c.json({ error: "Internal error" }, 500)
  } finally {
    await sql.end()
  }
})

app.get("/api/stores/:slug", async (c) => {
  const sql = getSql(c.env)
  try {
    const [store] = await sql`SELECT * FROM stores WHERE slug = ${c.req.param("slug")}`
    if (!store) return c.json({ error: "Not found" }, 404)
    return c.json(store)
  } finally {
    await sql.end()
  }
})

app.patch("/api/stores/:slug", async (c) => {
  const body = await c.req.json()
  const sql = getSql(c.env)
  try {
    const [store] = await sql`SELECT * FROM stores WHERE slug = ${c.req.param("slug")}`
    if (!store) return c.json({ error: "Not found" }, 404)
    const [updated] = await sql`
      UPDATE stores SET ${sql(body, "name", "description", "address", "whatsapp", "maps_url", "theme", "social_links", "payment_methods", "is_published")}, updated_at = now()
      WHERE slug = ${c.req.param("slug")}
      RETURNING *
    `
    return c.json(updated)
  } finally {
    await sql.end()
  }
})

const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().int().positive(),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  images: z.array(z.string()).optional(),
})

app.get("/api/stores/:slug/products", async (c) => {
  const sql = getSql(c.env)
  try {
    const products = await sql`
      SELECT p.* FROM products p
      JOIN stores s ON s.id = p.store_id
      WHERE s.slug = ${c.req.param("slug")}
      ORDER BY p.sort_order, p.created_at
    `
    return c.json(products)
  } finally {
    await sql.end()
  }
})

app.post("/api/stores/:slug/products", async (c) => {
  const body = await c.req.json()
  const parsed = createProductSchema.safeParse(body)
  if (!parsed.success) return c.json({ error: parsed.error.issues }, 400)
  const sql = getSql(c.env)
  try {
    const [store] = await sql`SELECT id FROM stores WHERE slug = ${c.req.param("slug")}`
    if (!store) return c.json({ error: "Store not found" }, 404)
    const [product] = await sql`
      INSERT INTO products (store_id, name, price, description, category, images)
      VALUES (${store.id}, ${parsed.data.name}, ${parsed.data.price}, ${parsed.data.description || null}, ${parsed.data.category || null}, ${parsed.data.images || []})
      RETURNING *
    `
    return c.json(product, 201)
  } finally {
    await sql.end()
  }
})

app.patch("/api/products/:id", async (c) => {
  const body = await c.req.json()
  const sql = getSql(c.env)
  try {
    const [updated] = await sql`
      UPDATE products SET ${sql(body, "name", "price", "description", "category", "images", "is_available", "sort_order")}, updated_at = now()
      WHERE id = ${c.req.param("id")}
      RETURNING *
    `
    if (!updated) return c.json({ error: "Not found" }, 404)
    return c.json(updated)
  } finally {
    await sql.end()
  }
})

app.delete("/api/products/:id", async (c) => {
  const sql = getSql(c.env)
  try {
    const [deleted] = await sql`
      DELETE FROM products WHERE id = ${c.req.param("id")} RETURNING id
    `
    if (!deleted) return c.json({ error: "Not found" }, 404)
    return c.json({ success: true })
  } finally {
    await sql.end()
  }
})

app.post("/api/upload", async (c) => {
  const form = await c.req.formData()
  const file = form.get("file") as File | null
  if (!file) return c.json({ error: "No file" }, 400)
  if (file.size > 5 * 1024 * 1024) return c.json({ error: "Max 5MB" }, 400)
  if (!file.type.startsWith("image/")) return c.json({ error: "Only images" }, 400)
  const key = `products/${crypto.randomUUID()}-${file.name}`
  await c.env.SENDBOOK_ASSETS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  })
  const publicUrl = `https://pub-8b6a4088db2c4966974f91de589f6cb9.r2.dev/${key}`
  return c.json({ url: publicUrl, key })
})

app.post("/api/analytics/event", async (c) => {
  const { store_id, type, product_id } = await c.req.json()
  if (!["visit", "whatsapp_click"].includes(type)) return c.json({ error: "Invalid type" }, 400)
  const sql = getSql(c.env)
  try {
    await sql`
      INSERT INTO analytics_events (store_id, type, product_id)
      VALUES (${store_id}, ${type}, ${product_id || null})
    `
    return c.json({ success: true }, 201)
  } finally {
    await sql.end()
  }
})

app.get("/api/stores/:slug/analytics", async (c) => {
  const sql = getSql(c.env)
  try {
    const stats = await sql`
      SELECT type, COUNT(*)::int as count, DATE(created_at) as date
      FROM analytics_events ae
      JOIN stores s ON s.id = ae.store_id
      WHERE s.slug = ${c.req.param("slug")}
        AND created_at > now() - interval '30 days'
      GROUP BY type, DATE(created_at)
      ORDER BY date DESC
    `
    return c.json(stats)
  } finally {
    await sql.end()
  }
})

export const onRequest = handle(app)
