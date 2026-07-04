import { Hono } from "hono";

const app = new Hono();

app.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.status === 429) return c.json({ error: "Rate limited" }, 429);
    const data = await res.json();
    return c.json(data);
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export default app;
