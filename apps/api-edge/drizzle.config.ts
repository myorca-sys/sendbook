import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/db/schema.ts", "./src/db/polymorphic_schema.ts"],
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres.ppwocgmumbdbvnqprxrg:Habibiendut1.@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?sslmode=require",
  },
});
