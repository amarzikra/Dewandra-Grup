import type { Session } from "@/lib/session";

// TEMPORARY preview mode. Set VITE_AUTH_BYPASS=true in .env.local to browse
// protected pages without signing in. Remove the flag to restore real auth.
// Gated with import.meta.env.DEV so a production build always enforces auth.
export const authBypassEnabled =
  import.meta.env.DEV && import.meta.env.VITE_AUTH_BYPASS === "true";

const now = new Date();

export const demoSession = {
  session: {
    id: "dev-bypass-session",
    createdAt: now,
    updatedAt: now,
    userId: "dev-bypass-user",
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    token: "dev-bypass-token",
    ipAddress: "127.0.0.1",
    userAgent: "dev-auth-bypass",
  },
  user: {
    id: "dev-bypass-user",
    createdAt: now,
    updatedAt: now,
    email: "demo@dewandra.local",
    emailVerified: true,
    name: "Pemilik Demo",
    image: null,
    role: "user",
    banned: false,
    banReason: null,
    banExpires: null,
  },
} as unknown as Session;
