import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db/db";

export const getAuth = (env: any) => {
  return betterAuth({
    baseURL: env.BETTER_AUTH_URL || "http://localhost:8787",
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDb(env), {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId:
          env.GOOGLE_CLIENT_ID ||
          "475749423464-4eqtfgbmjfvj7jsi999vcap2mcug5lip.apps.googleusercontent.com",
        clientSecret: env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    advanced: {
      cookiePrefix: "better-auth",
      crossSubDomainCookies: {
        enabled: true,
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
  });
};
