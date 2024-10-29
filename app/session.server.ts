import { createCookieSessionStorage } from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secrets: [process.env.SESSION_SECRET || "default_secret"],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    domain: isProduction ? ".fly.dev" : undefined,
  },
});

export { getSession, commitSession, destroySession };
