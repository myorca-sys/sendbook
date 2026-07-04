import { Hono } from "hono";
import { cors } from "hono/cors";
import { getAuth } from "./auth";
import storesRouter from "./routes/stores";
import productsRouter from "./routes/products";
import uploadRouter from "./routes/upload";
import analyticsRouter from "./routes/analytics";

type Bindings = {
  DATABASE_URL: string
  BETTER_AUTH_SECRET: string
  BETTER_AUTH_URL: string
  UPSTASH_REDIS_REST_URL: string
  UPSTASH_REDIS_REST_TOKEN: string
  SENDBOOK_ASSETS: R2Bucket
  ENVIRONMENT: string
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors({
  origin: ["http://localhost:8081", "http://localhost:3000", "https://sendbook.pages.dev"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.all("/api/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

app.route("/api/stores", storesRouter);
app.route("/api/products", productsRouter);
app.route("/api/upload", uploadRouter);
app.route("/api/analytics", analyticsRouter);

app.get("/api/health", (c) => c.json({ status: "ok", service: "sendbook" }));

export default {
  fetch: app.fetch,
};
