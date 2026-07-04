import { Hono } from "hono";
import { dreas } from "../schemas/dreas_pb";

type Bindings = {
  SCRAPER_RULES_KV: any;
};

const dreasRouter = new Hono<{ Bindings: Bindings }>();

dreasRouter.get("/rules/:provider", async (c) => {
  const provider = c.req.param("provider");
  const acceptHeader = c.req.header("Accept") || "";

  if (!c.env.SCRAPER_RULES_KV) {
    return c.json({ success: false, error: "KV namespace not bound" }, 500);
  }

  try {
    const rulesStr = await c.env.SCRAPER_RULES_KV.get(`rule_${provider}`);

    if (!rulesStr) {
      return c.json({ success: false, error: "Rules not found" }, 404);
    }

    const rulesJson = JSON.parse(rulesStr);

    // Cache at edge for 60 seconds, serve stale up to 1 day
    c.header(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=86400",
    );

    if (acceptHeader.includes("application/x-protobuf")) {
      const message = dreas.DREASManifest.fromObject(rulesJson);
      const buffer = dreas.DREASManifest.encode(message).finish();

      c.header("Content-Type", "application/x-protobuf");
      return c.body(buffer as any);
    }

    return c.json({
      success: true,
      data: rulesJson,
    });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

// Admin-only route to update rules
dreasRouter.post("/rules/:provider", async (c) => {
  const provider = c.req.param("provider");
  const adminKey = c.req.header("x-admin-key");

  // Use a safer way to access secret
  const secret = (c.env as any).BETTER_AUTH_SECRET;
  if (!adminKey || adminKey !== secret) {
    return c.json({ success: false, error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json();
    await c.env.SCRAPER_RULES_KV.put(`rule_${provider}`, JSON.stringify(body));
    return c.json({ success: true, message: "Rules updated successfully" });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

export default dreasRouter;
