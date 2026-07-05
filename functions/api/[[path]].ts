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

// ─── Dashboard Auth ─────────────────────────────────────

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const parts = hash.split(':')
  if (parts.length !== 2) return false
  const salt = Uint8Array.from(atob(parts[0]), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, key, 256)
  const expected = Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0))
  if (derived.byteLength !== expected.length) return false
  const d = new Uint8Array(derived)
  return d.every((v, i) => v === expected[i])
}

async function createSession(env: Env, userId: string): Promise<string> {
  const token = crypto.randomUUID()
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  const resp = await fetch(env.UPSTASH_REDIS_REST_URL + '/set/session:' + token, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN },
    body: JSON.stringify({ userId, expiresAt }),
  })
  if (!resp.ok) throw new Error('Failed to create session')
  await fetch(env.UPSTASH_REDIS_REST_URL + '/expire/session:' + token + '/604800', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN },
  })
  return token
}

async function getSession(env: Env, token: string): Promise<{ userId: string } | null> {
  const resp = await fetch(env.UPSTASH_REDIS_REST_URL + '/get/session:' + token, {
    headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN },
  })
  const data: any = await resp.json()
  if (!data.result) return null
  const session = JSON.parse(data.result)
  if (session.expiresAt < Date.now()) return null
  return { userId: session.userId }
}

async function deleteSession(env: Env, token: string): Promise<void> {
  await fetch(env.UPSTASH_REDIS_REST_URL + '/del/session:' + token, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + env.UPSTASH_REDIS_REST_TOKEN },
  })
}

app.post('/api/dashboard/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  const sql = getSql(c.env)
  try {
    const [user] = await sql`SELECT * FROM merchant_users WHERE email = ${email}`
    if (!user) return c.json({ error: 'Invalid credentials' }, 401)
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401)
    const token = await createSession(c.env, user.id)
    return new Response(JSON.stringify({ user: { id: user.id, email: user.email, name: user.name, storeId: user.store_id } }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'set-cookie': `sendbook_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`,
      },
    })
  } finally {
    await sql.end()
  }
})

app.get('/api/dashboard/me', async (c) => {
  const cookie = c.req.header('cookie') || ''
  const match = cookie.match(/sendbook_session=([^;]+)/)
  if (!match) return c.json({ error: 'Not authenticated' }, 401)
  const session = await getSession(c.env, match[1])
  if (!session) return c.json({ error: 'Session expired' }, 401)
  const sql = getSql(c.env)
  try {
    const [user] = await sql`SELECT id, email, name, store_id FROM merchant_users WHERE id = ${session.userId}`
    if (!user) return c.json({ error: 'User not found' }, 401)
    return c.json({ user: { id: user.id, email: user.email, name: user.name, storeId: user.store_id } })
  } finally {
    await sql.end()
  }
})

app.post('/api/dashboard/logout', async (c) => {
  const cookie = c.req.header('cookie') || ''
  const match = cookie.match(/sendbook_session=([^;]+)/)
  if (match) await deleteSession(c.env, match[1])
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': 'sendbook_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
    },
  })
})

// ─── Export ────────────────────────────────────────────

export const onRequest = handle(app)
