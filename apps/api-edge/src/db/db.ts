import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export const getDb = (env: any) => {
  let dbUrl = env.HYPERDRIVE?.connectionString || env.DATABASE_URL;

  if (!dbUrl) {
    console.warn("[getDb] DATABASE_URL is missing! Using dummy connection.");
    dbUrl = "postgres://dummy:dummy@db.dummy.supabase.co:6543/postgres";
  }

  // Hyperdrive manages pooling and SSL natively, so we don't need fetch_types: false or ssl: 'require'
  // But we still need prepare: false for PgBouncer/Hyperdrive compatibility.
  // Add max: 1 and idle_timeout: 0 to prevent V8 Isolates from hoarding connections
  const client = postgres(dbUrl, {
    prepare: false,
    max: 1,
    idle_timeout: 0,
  });
  return drizzle(client, { schema });
};
