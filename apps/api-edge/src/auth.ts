import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db/db";

export const getAuth = (env: any) => {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL || "http://localhost:8787",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(env), { provider: "pg" }),
    emailAndPassword: { enabled: true },
    socialProviders: {},
    advanced: {
      cookiePrefix: "sendbook",
      crossSubDomainCookies: { enabled: true },
      defaultCookieAttributes: { sameSite: "none", secure: true },
    },
  });
};
