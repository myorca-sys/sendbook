import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

export const getDb = (env: any) => {
  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL is missing");
  const client = postgres(dbUrl, { prepare: false, max: 1, idle_timeout: 0 });
  return drizzle(client, { schema });
};
